import { NextRequest, NextResponse } from 'next/server';
import { AutomationService } from '@/services/automationService';

// Bật force-dynamic để endpoint này không bao giờ bị cache
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    const automationService = new AutomationService();
    
    // 1. Scan và tạo Job cho các chuyến đi đã hoàn thành cần gửi Feedback Reminder
    await automationService.scanAndCreateFeedbackJobs();

    // 2. Chạy các Job đang PENDING hoặc FAILED (cần retry)
    await automationService.processJobs();

    return NextResponse.json({ success: true, message: 'Automation executed successfully' });
  } catch (error: unknown) {
    console.error('Automation Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
