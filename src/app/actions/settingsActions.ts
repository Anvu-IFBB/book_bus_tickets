'use server';

import { getSettingsRepository } from '@/repositories';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { SystemSettings } from '@/types/automation';
import { z } from 'zod';
import { handleActionError } from '@/lib/server/action-error';

// Validation schema for Settings
const pricingConfigSchema = z.object({
  limousineBasePrice: z.number().min(0, 'Giá vé Limousine không hợp lệ'),
  cargoBasePriceUnder5kg: z.number().min(0, 'Giá cước gửi hàng < 5kg không hợp lệ'),
  cargoBasePriceUnder10kg: z.number().min(0, 'Giá cước gửi hàng < 10kg không hợp lệ'),
  cargoExtraPerKg: z.number().min(0, 'Giá cước vượt kg không hợp lệ'),
  contractPricePerDayUnder7Seats: z.number().min(0, 'Giá cước hợp đồng không hợp lệ'),
  contractPricePerDayUnder11Seats: z.number().min(0, 'Giá cước hợp đồng không hợp lệ'),
  contractPricePerDayUnder16Seats: z.number().min(0, 'Giá cước hợp đồng không hợp lệ'),
  contractPricePerDayOver16Seats: z.number().min(0, 'Giá cước hợp đồng không hợp lệ'),
  tourBasePrice: z.number().min(0, 'Giá cước tour không hợp lệ'),
});

const settingsUpdateSchema = z.object({
  hotline1: z.string().optional(),
  hotline2: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  zaloUrl: z.string().url().optional().or(z.literal('')),
  companyName: z.string().optional(),
  address: z.string().optional(),
  workingHours: z.string().optional(),
  bankCode: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  pricingConfig: pricingConfigSchema.optional(),
});

export async function getSettingsAction(): Promise<{ success: boolean; data?: SystemSettings; error?: string }> {
  try {
    const settingsRepo = getSettingsRepository();
    const settings = await settingsRepo.getSettings();
    return { success: true, data: settings };
  } catch (error: unknown) {
    return handleActionError(error, 'getSettingsAction');
  }
}

export async function updateSettingsAction(
  updates: Partial<SystemSettings>
): Promise<{ success: boolean; data?: SystemSettings; error?: string }> {
  try {
    const user = await requirePermission(Permissions.canModifySettings);

    const parsed = settingsUpdateSchema.safeParse(updates);
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.format());
      return { success: false, error: 'Dữ liệu cập nhật cấu hình không hợp lệ.' };
    }

    const settingsRepo = getSettingsRepository();
    const currentSettings = await settingsRepo.getSettings();
    const updatedSettings = await settingsRepo.updateSettings(updates);

    // Ghi Audit Log
    const auditLogId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await settingsRepo.createAuditLog({
      id: auditLogId,
      userId: user.id,
      userEmail: user.email,
      actorRole: user.role,
      action: 'SETTINGS_UPDATED',
      entityType: 'SETTINGS',
      entityId: 'general',
      fromState: JSON.stringify(currentSettings),
      toState: JSON.stringify(updatedSettings),
      createdAt: new Date().toISOString(),
    });

    return { success: true, data: updatedSettings };
  } catch (error: unknown) {
    return handleActionError(error, 'updateSettingsAction');
  }
}
