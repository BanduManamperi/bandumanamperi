/**
 * Set NEXT_PUBLIC_CONTACT_FORM_ENABLED=true when Resend (RESEND_API_KEY, RESEND_FROM_EMAIL) is configured.
 * Until then, the UI shows email/phone instead of the message form.
 */
export const CONTACT_FORM_ENABLED =
  process.env.NEXT_PUBLIC_CONTACT_FORM_ENABLED === "true";
