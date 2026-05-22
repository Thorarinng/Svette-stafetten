import { PRODUCTION_APP_URL } from './authConfig'

/**
 * URL etter magisk lenke (emailRedirectTo / redirect_to).
 * Standard: alltid produksjon — også når du kjører npm run dev.
 * Kun med VITE_USE_LOCAL_AUTH=true → localhost.
 */
export function getAuthRedirectUrl(): string {
  if (import.meta.env.VITE_USE_LOCAL_AUTH === 'true') {
    return window.location.origin
  }

  const envUrl = import.meta.env.VITE_APP_URL?.trim()
  if (envUrl && !isLocalhostUrl(envUrl)) {
    return envUrl.replace(/\/$/, '')
  }

  return PRODUCTION_APP_URL
}

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1|\[::1\]/i.test(url)
}

export function isLocalDevOrigin(): boolean {
  return isLocalhostUrl(window.location.origin)
}

/** localhost + innloggingstoken → Vercel */
export function redirectAuthHashToProductionIfNeeded(): void {
  if (!isLocalDevOrigin()) return

  const hash = window.location.hash
  const search = window.location.search
  const hasAuthParams =
    hash.includes('access_token') ||
    hash.includes('refresh_token') ||
    search.includes('code=') ||
    search.includes('token_hash=')

  if (!hasAuthParams) return

  const target = `${PRODUCTION_APP_URL}${window.location.pathname}${search}${hash}`
  if (window.location.href !== target) {
    window.location.replace(target)
  }
}
