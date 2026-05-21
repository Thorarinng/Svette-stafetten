import { buildLeaderboard } from '../lib/leaderboard'
import type { Trip } from '../lib/types'

interface LeaderboardProps {
  trips: Trip[]
  loading?: boolean
}

function rankStyle(index: number): string {
  if (index === 0) return 'bg-primary text-secondary ring-2 ring-warning'
  if (index === 1) return 'bg-accent-teal text-white'
  if (index === 2) return 'bg-accent-blue text-white'
  return 'bg-gray-100 text-gray-600'
}

export function Leaderboard({ trips, loading }: LeaderboardProps) {
  const entries = buildLeaderboard(trips)

  if (loading) {
    return (
      <div className="metzum-card p-6">
        <h2 className="metzum-section-title">Ledertavle</h2>
        <p className="mt-4 text-center metzum-muted">Laster …</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="metzum-card p-6">
        <h2 className="metzum-section-title">Ledertavle</h2>
        <p className="mt-4 text-center metzum-muted">
          Ingen turer registrert ennå. Vær den første!
        </p>
      </div>
    )
  }

  return (
    <div className="metzum-card overflow-hidden">
      <div className="border-b border-primary/20 bg-gradient-to-r from-primary/25 via-white to-accent-teal/10 px-4 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-gray-600">Ledertavle</h2>
        <p className="text-sm font-medium text-accent-teal">Sortert etter poeng</p>
      </div>

      <ul className="divide-y divide-gray-100">
        {entries.map((entry, index) => (
          <li
            key={entry.name}
            className={`flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4 ${
              index === 0 ? 'bg-primary/5' : ''
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold sm:h-10 sm:w-10 ${rankStyle(index)}`}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-gray-600">{entry.name}</p>
              <p className="text-sm text-gray-500">
                {entry.tripCount} {entry.tripCount === 1 ? 'tur' : 'turer'}
                <span className="mx-1.5 text-gray-300">·</span>
                <span className="text-accent-teal">🚲 {entry.bikeCount}</span>
                <span className="mx-1 text-gray-300">·</span>
                <span className="text-accent-purple">🏃 {entry.runCount}</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-extrabold text-success">{entry.totalPoints}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                poeng
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
