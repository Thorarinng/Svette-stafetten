import type { TripDirection } from './types'

export const COMPETITION_START = new Date('2026-05-26T00:00:00')
export const COMPETITION_END = new Date('2026-06-26T23:59:59')
export const COMPETITION_START_KEY = '2026-05-26'
export const COMPETITION_END_KEY = '2026-06-26'

export const POINTS: Record<TripDirection, number> = {
  roundtrip: 2,
  oneway: 1,
}

export function calculatePoints(direction: TripDirection): number {
  return POINTS[direction]
}

export function getDaysRemaining(now = new Date()): number {
  const diff = COMPETITION_END.getTime() - now.getTime()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getCountdown(now = new Date()): {
  days: number
  hours: number
  minutes: number
  seconds: number
  ended: boolean
  notStarted: boolean
} {
  if (now < COMPETITION_START) {
    const diff = COMPETITION_START.getTime() - now.getTime()
    return {
      ...breakdown(diff),
      ended: false,
      notStarted: true,
    }
  }

  const diff = COMPETITION_END.getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true, notStarted: false }
  }

  return {
    ...breakdown(diff),
    ended: false,
    notStarted: false,
  }
}

function breakdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}
