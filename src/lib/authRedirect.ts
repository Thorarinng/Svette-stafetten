/**
 * URL brukeren sendes til etter magisk lenke.
 * - Lokalt: window.location.origin (http://localhost:5173)
 * - Vercel: sett VITE_APP_URL til https://din-app.vercel.app
 */
export function getAuthRedirectUrl(): string {
  const configured = import.meta.env.VITE_APP_URL?.trim()
  if (configured) {
    return configured.replace(/\/$/, '')
  }
  return window.location.origin
}

export function isLocalDevOrigin(): boolean {
  const origin = window.location.origin
  return (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('[::1]')
  )
}
