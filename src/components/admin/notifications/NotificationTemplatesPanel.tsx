'use client';

import { useState, useEffect } from 'react';
import { listTemplatesAction, updateTemplateAction } from '@/app/actions/notificationActions';
import { NotificationTemplate } from '@/types/notification';

export default function NotificationTemplatesPanel() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await listTemplatesAction();
        if (res.success) {
          setTemplates(res.templates);
        }
      } catch (error) {
        console.error('Failed to load templates', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const handleToggle = async (id: string, currentEnabled: boolean) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !currentEnabled } : t))
    );
    try {
      await updateTemplateAction(id, { enabled: !currentEnabled });
    } catch (error) {
      console.error('Failed to toggle template', error);
      // revert
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabled: currentEnabled } : t))
      );
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh sách mẫu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Mẫu thông báo (Templates)</h2>
          <p className="text-sm text-slate-500 mt-1">Quản lý nội dung và bật/tắt các mẫu gửi tin nhắn, email tự động.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow relative bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-slate-900">{template.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${
                    template.channel === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                    template.channel === 'SMS' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {template.channel}
                  </span>
                </div>
                <button
                  onClick={() => handleToggle(template.id, template.enabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    template.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      template.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {template.subject && (
                <div className="mb-2">
                  <span className="text-xs font-medium text-slate-500">Tiêu đề: </span>
                  <span className="text-sm text-slate-700">{template.subject}</span>
                </div>
              )}
              
              <div className="bg-slate-50 rounded p-3 mb-3 text-sm text-slate-600 font-mono whitespace-pre-wrap">
                {template.body}
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500">Biến bắt buộc: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.requiredVariables.map(v => (
                    <span key={v} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-100">
                      {'{'}{'{'}{v}{'}'}{'}'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500">
              Không có mẫu thông báo nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
