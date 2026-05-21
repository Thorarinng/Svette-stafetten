import type { LeaderboardEntry, Trip } from './types'

export function buildLeaderboard(trips: Trip[]): LeaderboardEntry[] {
  const byName = new Map<string, LeaderboardEntry>()

  for (const trip of trips) {
    const key = trip.name.trim()
    if (!key) continue

    const existing = byName.get(key) ?? {
      name: key,
      totalPoints: 0,
      tripCount: 0,
      bikeCount: 0,
      runCount: 0,
    }

    existing.totalPoints += trip.points
    existing.tripCount += 1
    if (trip.type === 'bike') existing.bikeCount += 1
    else existing.runCount += 1

    byName.set(key, existing)
  }

  return [...byName.values()].sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    return b.tripCount - a.tripCount
  })
}

export function getKnownNames(trips: Trip[]): string[] {
  const names = new Set<string>()
  for (const trip of trips) {
    const n = trip.name.trim()
    if (n) names.add(n)
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'nb'))
}
