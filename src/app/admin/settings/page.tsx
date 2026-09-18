import React from 'react';
import { Metadata } from 'next';
import SettingsClient from './settings-client';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';

export const metadata: Metadata = {
  title: 'Cấu Hình Hệ Thống & Bảng Giá',
  description: 'Quản lý bảng giá cước, thông tin liên hệ và cài đặt chung của hệ thống',
};

export default async function SettingsPage() {
  await requirePermission(Permissions.canModifySettings);
  return <SettingsClient />;
}
