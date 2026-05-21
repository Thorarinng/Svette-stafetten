/** Tillatte e-postdomener for innlogging */
export const ALLOWED_EMAIL_DOMAINS = ['metzum.no'] as const

export function getEmailDomain(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  const at = normalized.lastIndexOf('@')
  if (at < 0) return null
  return normalized.slice(at + 1)
}

export function isAllowedEmail(email: string): boolean {
  const domain = getEmailDomain(email)
  if (!domain) return false
  return (ALLOWED_EMAIL_DOMAINS as readonly string[]).includes(domain)
}

export function allowedEmailError(): string {
  return `Kun ${ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(' og ')}-e-post kan logge inn`
}
