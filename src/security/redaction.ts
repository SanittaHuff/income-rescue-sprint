const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const phone = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g;
export const redactSensitiveLogText = (text: string): string => text.replace(email, "[EMAIL_REDACTED]").replace(phone, "[PHONE_REDACTED]");
export const safeErrorMessage = (error: unknown): string => error instanceof Error ? redactSensitiveLogText(error.message) : "An unexpected error occurred.";
