import { useMemo, useState } from 'react'
import { calculatePoints } from '../lib/constants'
import { hasDisplayName } from '../lib/auth'
import { getTripDateKey } from '../lib/tripDates'
import { formatTripDay, tripDirectionLabel, tripTypeLabel } from '../lib/tripLabels'
import { isMyTrip } from '../lib/tripOwnership'
import { useAuth } from '../contexts/AuthContext'
import type { Trip, TripDirection, TripType } from '../lib/types'
import { ToggleGroup } from './ToggleGroup'

interface MyTripsProps {
  trips: Trip[]
  loading?: boolean
  onUpdate: (
    tripId: string,
    userId: string,
    type: TripType,
    direction: TripDirection,
  ) => Promise<unknown>
  onDelete: (tripId: string, userId: string) => Promise<void>
}

export function MyTrips({ trips, loading, onUpdate, onDelete }: MyTripsProps) {
  const { user, displayName } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editType, setEditType] = useState<TripType>('bike')
  const [editDirection, setEditDirection] = useState<TripDirection>('roundtrip')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<{
    tripId: string
    message: string
  } | null>(null)

  const myTrips = useMemo(
    () =>
      user
        ? trips
            .filter((t) => isMyTrip(t, user.id, displayName))
            .sort(
              (a, b) =>
                getTripDateKey(b).localeCompare(getTripDateKey(a)) ||
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            )
        : [],
    [trips, user, displayName],
  )

  if (!user || !hasDisplayName(user)) return null

  function startEdit(trip: Trip) {
    setEditingId(trip.id)
    setEditType(trip.type)
    setEditDirection(trip.direction)
    setActionError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setActionError(null)
  }

  return (
    <div className="metzum-card overflow-hidden">
      <div className="border-b border-gray-100 bg-primary/15 px-4 py-4 sm:px-6">
        <h2 className="metzum-section-title">Mine turer</h2>
        <p className="metzum-muted">Rediger eller slett dine egne registreringer</p>
      </div>

      {loading ? (
        <p className="p-6 text-center metzum-muted">Laster …</p>
      ) : myTrips.length === 0 ? (
        <p className="p-6 text-center metzum-muted">Du har ikke logget noen turer ennå.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {myTrips.map((trip) => {
            const isEditing = editingId === trip.id
            const isBusy = busyId === trip.id
            const editPoints = isEditing ? calculatePoints(editDirection) : trip.points

            return (
              <li key={trip.id} className="px-4 py-4 sm:px-6">
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-teal">
                      Rediger tur · {formatTripDay(getTripDateKey(trip))}
                    </p>
                    <ToggleGroup
                      label="Type"
                      value={editType}
                      onChange={setEditType}
                      options={[
                        { value: 'bike', label: 'Sykkel', icon: '🚲' },
                        { value: 'run', label: 'Løp', icon: '🏃' },
                      ]}
                    />
                    <ToggleGroup
                      label="Retning"
                      value={editDirection}
                      onChange={setEditDirection}
                      options={[
                        { value: 'roundtrip', label: 'Tur-retur' },
                        { value: 'oneway', label: 'En vei' },
                      ]}
                    />
                    <p className="text-center text-sm text-gray-500">
                      Gir{' '}
                      <span className="font-bold text-success">{editPoints}</span> poeng
                    </p>
                    {actionError?.tripId === trip.id && (
                      <p className="metzum-alert-error">{actionError.message}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          setBusyId(trip.id)
                          setActionError(null)
                          try {
                            await onUpdate(trip.id, user.id, editType, editDirection)
                            setEditingId(null)
                          } catch (err) {
                            setActionError({
                              tripId: trip.id,
                              message:
                                err instanceof Error ? err.message : 'Kunne ikke lagre',
                            })
                          } finally {
                            setBusyId(null)
                          }
                        }}
                        className="metzum-btn flex-1 !py-2.5"
                      >
                        {isBusy ? 'Lagrer …' : 'Lagre'}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={cancelEdit}
                        className="metzum-btn-ghost flex-1 !py-2.5"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-secondary">
                        {tripTypeLabel(trip.type)} · {tripDirectionLabel(trip.direction)}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {formatTripDay(getTripDateKey(trip))}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-success">
                        {trip.points} poeng
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => startEdit(trip)}
                        className="metzum-btn-ghost !px-3 !py-1.5 text-xs"
                      >
                        Endre
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              'Slette denne turen? Poengene oppdateres på ledertavlen.',
                            )
                          ) {
                            return
                          }
                          setBusyId(trip.id)
                          setActionError(null)
                          try {
                            await onDelete(trip.id, user.id)
                          } catch (err) {
                            setActionError({
                              tripId: trip.id,
                              message:
                                err instanceof Error ? err.message : 'Kunne ikke slette',
                            })
                          } finally {
                            setBusyId(null)
                          }
                        }}
                        className="rounded-xl border border-error/30 bg-error/10 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/15 disabled:opacity-50"
                      >
                        {isBusy ? '…' : 'Slett'}
                      </button>
                    </div>
                  </div>
                )}
                {!isEditing && actionError?.tripId === trip.id && (
                  <p className="mt-2 metzum-alert-error">{actionError.message}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
