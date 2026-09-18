import { requireAuth } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import NotificationTemplatesPanel from '@/components/admin/notifications/NotificationTemplatesPanel';
import { getSettingsRepository } from '@/repositories';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Trung tâm thông báo - Admin',
};

export default async function NotificationsPage() {
  const session = await requireAuth();
  if (!Permissions.canManageAutomation(session.role)) redirect('/admin');
  
  const settingsRepo = getSettingsRepository();
  const settings = await settingsRepo.getSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các thông báo tự động gửi qua Email, SMS, Zalo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${settings.notifications?.enabled ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-sm font-medium text-slate-500">Master Switch</p>
          <p className={`text-xl font-bold mt-1 ${settings.notifications?.enabled ? 'text-indigo-700' : 'text-gray-500'}`}>
            {settings.notifications?.enabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${settings.notifications?.emailEnabled ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-sm font-medium text-slate-500">Email Gateway</p>
          <p className={`text-xl font-bold mt-1 ${settings.notifications?.emailEnabled ? 'text-blue-700' : 'text-gray-500'}`}>
            {settings.notifications?.emailEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${settings.notifications?.smsEnabled ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-sm font-medium text-slate-500">SMS Gateway</p>
          <p className={`text-xl font-bold mt-1 ${settings.notifications?.smsEnabled ? 'text-green-700' : 'text-gray-500'}`}>
            {settings.notifications?.smsEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${settings.notifications?.zaloEnabled ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-sm font-medium text-slate-500">Zalo ZNS</p>
          <p className={`text-xl font-bold mt-1 ${settings.notifications?.zaloEnabled ? 'text-blue-700' : 'text-gray-500'}`}>
            {settings.notifications?.zaloEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
          </p>
        </div>
      </div>

      <NotificationTemplatesPanel />
    </div>
  );
}
