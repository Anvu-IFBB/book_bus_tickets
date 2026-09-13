import { getNotificationTemplateRepository } from '@/repositories';
import { NotificationChannel } from '@/types/notification';

export class TemplateEngine {
  private escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  /**
   * Compiles a template string by replacing variables.
   * e.g., 'Hello {{name}}' with { name: 'World' } becomes 'Hello World'
   */
  compile(template: string, payload: Record<string, unknown>, escape: boolean = true): string {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
      if (payload[key] !== undefined) {
        const val = String(payload[key]);
        return escape ? this.escapeHtml(val) : val;
      }
      return match;
    });
  }

  /**
   * Evaluates a template by fetching it from the DB and rendering the payload.
   * Uses memory/firestore repository based on config.
   */
  async evaluateTemplate(templateId: string, payload: Record<string, unknown>): Promise<{ subject?: string; body: string; channel: NotificationChannel }> {
    const templateRepo = getNotificationTemplateRepository();
    const template = await templateRepo.findById(templateId);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    if (!template.enabled) {
      throw new Error(`Template ${templateId} is disabled`);
    }

    // Verify required variables
    for (const requiredVar of template.requiredVariables) {
      if (payload[requiredVar] === undefined) {
        throw new Error(`Missing required variable: ${requiredVar} for template ${templateId}`);
      }
    }

    const escape = template.channel === 'EMAIL' || template.channel === 'IN_APP';
    const body = this.compile(template.body, payload, escape);
    let subject: string | undefined;

    if (template.subject) {
      subject = this.compile(template.subject, payload, escape);
    }

    return {
      body,
      subject,
      channel: template.channel,
    };
  }
}

export const templateEngine = new TemplateEngine();
