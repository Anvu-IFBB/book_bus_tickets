'use client';

import { useState, useEffect } from 'react';
import { AutomationJob } from '@/types/automation';
import { getAutomationJobsAction } from '@/app/actions/automationActions';

export default function AdminAutomationPage() {
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    const res = await getAutomationJobsAction();
    if (res.jobs && !res.error) {
      setJobs(res.jobs);
    } else {
      setError(res.error || 'Failed to load automation jobs');
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Chờ xử lý</span>;
      case 'RUNNING':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Đang chạy</span>;
      case 'COMPLETED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Thành công</span>;
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Thất bại</span>;
      case 'SKIPPED':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Bỏ qua</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản Lý Background Jobs</h1>
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Lỗi truy cập</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Background Jobs</h1>
        <button onClick={loadJobs} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Làm mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có job automation nào trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID / Entity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại Job</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lần chạy</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian tạo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={job.id}>{job.id}</div>
                      <div className="text-sm text-gray-500">Ref: {job.entityId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(job.status)}
                      {job.error && (
                        <div className="text-xs text-red-500 mt-1 truncate max-w-[200px]" title={job.error}>
                          {job.error}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.attempts} / {job.maxAttempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
