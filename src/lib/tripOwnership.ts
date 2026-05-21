import type { Trip } from './types'

/** Turer brukeren eier eller kan ta over (manglet user_id ved gammel registrering). */
export function isMyTrip(
  trip: Trip,
  userId: string,
  displayName: string,
): boolean {
  if (trip.user_id === userId) return true
  if (trip.user_id != null) return false
  return trip.name.trim().toLowerCase() === displayName.trim().toLowerCase()
}
