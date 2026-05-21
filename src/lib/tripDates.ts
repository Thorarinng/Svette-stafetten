import {
  COMPETITION_END,
  COMPETITION_END_KEY,
  COMPETITION_START,
  COMPETITION_START_KEY,
} from './constants'

export { COMPETITION_START_KEY, COMPETITION_END_KEY }

export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, day] = key.split('-').map(Number)
  return new Date(y, m - 1, day)
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getSelectableDateBounds(now = new Date()): {
  min: string
  max: string
} | null {
  const today = startOfDay(now)
  const start = startOfDay(COMPETITION_START)
  const end = startOfDay(COMPETITION_END)

  if (today < start) return null
  if (today > end) return null

  return {
    min: COMPETITION_START_KEY,
    max: toDateKey(today < end ? today : end),
  }
}

export function isDateKeyInRange(key: string, now = new Date()): boolean {
  const bounds = getSelectableDateBounds(now)
  if (!bounds) return false
  return key >= bounds.min && key <= bounds.max
}

export function getDefaultTripDate(now = new Date()): string | null {
  return getSelectableDateBounds(now)?.max ?? null
}

/** Newest first — days you can still log a trip for */
export function getSelectableDateKeys(now = new Date()): string[] {
  const bounds = getSelectableDateBounds(now)
  if (!bounds) return []

  const keys: string[] = []
  let cursor = parseDateKey(bounds.max)
  const min = parseDateKey(bounds.min)

  while (cursor >= min) {
    keys.push(toDateKey(cursor))
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - 1)
  }

  return keys
}

export function getTripDateKey(trip: { trip_date?: string | null; created_at: string }): string {
  if (trip.trip_date) return trip.trip_date
  return toDateKey(new Date(trip.created_at))
}

export function userHasTripOnDate(
  trips: { trip_date?: string | null; created_at: string; user_id: string | null }[],
  userId: string,
  dateKey: string,
): boolean {
  return trips.some(
    (t) => t.user_id === userId && getTripDateKey(t) === dateKey,
  )
}
