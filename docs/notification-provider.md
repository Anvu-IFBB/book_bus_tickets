# Notification Provider Architecture (Phase 12.2)

## Overview
The Notification Provider Architecture abstracts the actual delivery mechanism (Email, SMS, Zalo) away from the core business logic.

## Components

1. **`INotificationProvider`**: The core interface for all providers. It defines a `send` method that returns a `ProviderResult`.
2. **`ProviderResult`**: An object containing `success`, `errorCode`, `errorMessage`, and `isPermanentFailure`. It prevents unhandled exceptions from crashing the system.
3. **`ProviderFactory`**: Instantiates the correct provider based on `channel` and environment variables.
4. **`MockNotificationProvider`**: A safe fallback provider used when no real provider is configured, or during tests.
5. **`ResendEmailProvider`**: A real email provider using the Resend HTTP API (`fetch`), requiring zero extra NPM dependencies.

## Error Handling Strategy
- **Permanent Failures**: (e.g., Missing API Key, Invalid Email, 401 Unauthorized, 403 Forbidden). The Notification is marked as `FAILED`, and `isPermanentFailure` is set to true. The system **does not** throw an error, preventing the Automation Job from infinitely retrying.
- **Temporary Failures**: (e.g., 429 Rate Limit, 500 Server Error, Network Timeout). The Notification is marked as `FAILED`, but the system **throws an error**. This signals the `AutomationService` to mark the Job attempt as failed and schedule a retry.

## Adding a New Provider
To add a new provider (e.g., SendGrid):
1. Create `SendGridEmailProvider` implementing `INotificationProvider`.
2. Update `ProviderFactory.ts` to return it when `process.env.EMAIL_PROVIDER === 'sendgrid'`.

## Configuration
Requires the following environment variables (server-side only, NO `NEXT_PUBLIC_`):
- `EMAIL_PROVIDER`: 'mock' or 'resend'
- `EMAIL_API_KEY`: API key for the provider
- `EMAIL_FROM`: Sender email address
- `EMAIL_REPLY_TO` (optional): Reply-to address
