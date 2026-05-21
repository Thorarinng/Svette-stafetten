import { useState } from 'react'
import { hasDisplayName } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'
import { ALLOWED_EMAIL_DOMAINS } from '../lib/email'

export function AuthPanel() {
  const { user, displayName, loading, signInWithEmail, signOut, updateDisplayName } =
    useAuth()
  const [email, setEmail] = useState('')
  const [profileName, setProfileName] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="metzum-card p-4 text-center metzum-muted">
        Sjekker innlogging …
      </div>
    )
  }

  if (!user) {
    return (
      <div className="metzum-card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple/15 text-lg">
            ✉️
          </span>
          <h2 className="metzum-section-title">Logg inn</h2>
        </div>
        <p className="metzum-muted">
          Kun {ALLOWED_EMAIL_DOMAINS.map((d) => `@${d}`).join(' / ')}. Magisk lenke — ingen
          passord.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setMessage(null)
            setBusy(true)
            try {
              await signInWithEmail(email)
              setMessage('Sjekk innboksen din og klikk på lenken for å logge inn.')
              setEmail('')
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Innlogging feilet')
            } finally {
              setBusy(false)
            }
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="navn@metzum.no"
            required
            autoComplete="email"
            className="metzum-input"
          />
          {error && <p className="metzum-alert-error">{error}</p>}
          {message && <p className="metzum-alert-success">{message}</p>}
          <button type="submit" disabled={busy || !email.trim()} className="metzum-btn">
            {busy ? 'Sender …' : 'Send innloggingslenke'}
          </button>
        </form>
      </div>
    )
  }

  if (!hasDisplayName(user)) {
    return (
      <div className="metzum-card p-5 sm:p-6">
        <h2 className="metzum-section-title">Velg visningsnavn</h2>
        <p className="mt-1 metzum-muted">
          Dette navnet vises på ledertavlen når du logger turer.
        </p>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            setError(null)
            setBusy(true)
            try {
              await updateDisplayName(profileName)
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Kunne ikke lagre navn')
            } finally {
              setBusy(false)
            }
          }}
        >
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Ditt navn"
            required
            autoComplete="name"
            className="metzum-input"
          />
          {error && <p className="metzum-alert-error">{error}</p>}
          <button
            type="submit"
            disabled={busy || !profileName.trim()}
            className="metzum-btn"
          >
            {busy ? 'Lagrer …' : 'Lagre navn'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-3 metzum-card px-4 py-3.5 sm:px-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-teal">
          Innlogget
        </p>
        <p className="truncate font-bold text-secondary">{displayName}</p>
        <p className="truncate text-xs text-gray-400">{user.email}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          setBusy(true)
          try {
            await signOut()
          } finally {
            setBusy(false)
          }
        }}
        disabled={busy}
        className="metzum-btn-ghost"
      >
        Logg ut
      </button>
    </div>
  )
}
