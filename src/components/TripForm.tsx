import { useMemo, useState } from 'react'
import { calculatePoints, getCountdown } from '../lib/constants'
import { hasDisplayName } from '../lib/auth'
import {
  getDefaultTripDate,
  getSelectableDateBounds,
  getTripDateKey,
  toDateKey,
  userHasTripOnDate,
} from '../lib/tripDates'
import { useAuth } from '../contexts/AuthContext'
import type { Trip, TripDirection, TripType } from '../lib/types'
import { ToggleGroup } from './ToggleGroup'
import { TripDatePicker } from './TripDatePicker'

interface TripFormProps {
  trips: Trip[]
  onSubmit: (
    userId: string,
    displayName: string,
    type: TripType,
    direction: TripDirection,
    tripDate: string,
  ) => Promise<unknown>
}

export function TripForm({ trips, onSubmit }: TripFormProps) {
  const { user, displayName } = useAuth()
  const bounds = getSelectableDateBounds()
  const defaultDate = getDefaultTripDate()
  const [tripDate, setTripDate] = useState(defaultDate ?? '')
  const [type, setType] = useState<TripType>('bike')
  const [direction, setDirection] = useState<TripDirection>('roundtrip')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const countdown = getCountdown()
  const points = calculatePoints(direction)

  const occupiedDates = useMemo(() => {
    if (!user) return new Set<string>()
    return new Set(
      trips
        .filter((t) => t.user_id === user.id)
        .map((t) => getTripDateKey(t)),
    )
  }, [trips, user])

  const dateTaken = user && tripDate ? userHasTripOnDate(trips, user.id, tripDate) : false
  const canSubmit = Boolean(bounds && tripDate && !dateTaken && !countdown.ended)

  if (!user || !hasDisplayName(user)) {
    return (
      <div className="metzum-card p-5 sm:p-6">
        <h2 className="metzum-section-title">Logg tur</h2>
        <p className="mt-2 metzum-muted">
          Logg inn og sett visningsnavn for å registrere turer.
        </p>
      </div>
    )
  }

  if (countdown.ended) {
    return (
      <div className="metzum-card p-5 sm:p-6 text-center">
        <h2 className="metzum-section-title">Logg tur</h2>
        <p className="mt-3 metzum-muted">Konkurransen er over — ingen flere turer kan registreres.</p>
      </div>
    )
  }

  if (!bounds || !defaultDate) {
    return (
      <div className="metzum-card overflow-hidden p-0">
        <div className="bg-gradient-to-br from-primary/25 via-white to-accent-teal/10 px-5 py-6 sm:px-6">
          <h2 className="metzum-section-title">Logg tur</h2>
          <p className="mt-2 metzum-muted">
            Konkurransen starter 26. mai. Da kan du logge turer — også med tilbakevirkende kraft
            for dager du har pendlet.
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !canSubmit) return

    setSubmitError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      await onSubmit(user.id, displayName, type, direction, tripDate)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Noe gikk galt')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="metzum-card overflow-hidden p-0">
      <div className="border-b border-primary/20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent-teal/10 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm ring-1 ring-white">
            🚲
          </span>
          <div>
            <h2 className="metzum-section-title">Logg tur</h2>
            <p className="text-xs font-medium text-accent-teal">Én registrering per dag · velg dato</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-warning">
            Registreres som
          </p>
          <p className="font-bold text-gray-600">{displayName}</p>
        </div>

        <TripDatePicker
          value={tripDate}
          onChange={setTripDate}
          min={bounds.min}
          max={bounds.max}
          occupiedDates={occupiedDates}
          todayKey={toDateKey(new Date())}
        />

        <ToggleGroup
          label="Type"
          value={type}
          onChange={setType}
          options={[
            { value: 'bike', label: 'Sykkel', icon: '🚲' },
            { value: 'run', label: 'Løp', icon: '🏃' },
          ]}
        />

        <ToggleGroup
          label="Retning"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'roundtrip', label: 'Tur-retur' },
            { value: 'oneway', label: 'En vei' },
          ]}
        />

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/25 via-white to-accent-teal/15 px-4 py-5 text-center ring-1 ring-primary/35">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent-teal/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-primary/30 blur-xl" />
          <p className="relative text-sm font-medium text-gray-500">Denne turen gir</p>
          <p className="relative text-5xl font-extrabold tabular-nums text-warning">{points}</p>
          <p className="relative text-xs font-semibold uppercase tracking-wide text-accent-teal">
            poeng
          </p>
        </div>

        {submitError && <p className="metzum-alert-error text-center">{submitError}</p>}
        {success && (
          <p className="metzum-alert-success">Tur registrert! Ledertavlen oppdateres.</p>
        )}

        <button type="submit" disabled={submitting || !canSubmit} className="metzum-btn">
          {submitting
            ? 'Registrerer …'
            : dateTaken
              ? 'Allerede logget denne dagen'
              : 'Registrer tur'}
        </button>
      </div>
    </form>
  )
}
