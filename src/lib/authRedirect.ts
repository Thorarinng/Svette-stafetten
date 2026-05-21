import { PRODUCTION_APP_URL } from './authConfig'

/**
 * URL brukeren sendes til etter magisk lenke (emailRedirectTo).
 * - npm run dev → localhost
 * - Vercel (produksjonsbuild) → alltid PRODUCTION_APP_URL
 */
export function getAuthRedirectUrl(): string {
  const envUrl = import.meta.env.VITE_APP_URL?.trim()
  if (envUrl) {
    return envUrl.replace(/\/$/, '')
  }

  if (import.meta.env.DEV) {
    return window.location.origin
  }

  return PRODUCTION_APP_URL
}

export function isLocalDevOrigin(): boolean {
  const origin = window.location.origin
  return (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('[::1]')
  )
}

/** Etter klikk på magisk lenke: localhost + token → send til Vercel */
export function redirectAuthHashToProductionIfNeeded(): void {
  if (!isLocalDevOrigin()) return

  const hash = window.location.hash
  const search = window.location.search
  const hasAuthParams =
    hash.includes('access_token') ||
    hash.includes('refresh_token') ||
    search.includes('code=')

  if (!hasAuthParams) return

  const target = `${PRODUCTION_APP_URL}${window.location.pathname}${search}${hash}`
  if (window.location.href !== target) {
    window.location.replace(target)
  }
}
