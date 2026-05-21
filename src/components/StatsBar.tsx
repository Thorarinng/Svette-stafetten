import type { Trip } from '../lib/types'
import { getDaysRemaining } from '../lib/constants'

interface StatsBarProps {
  trips: Trip[]
  loading?: boolean
}

const ACCENT_BARS = [
  'bg-accent-purple',
  'bg-primary',
  'bg-accent-teal',
] as const

export function StatsBar({ trips, loading }: StatsBarProps) {
  const totalTrips = trips.length
  const bikeCount = trips.filter((t) => t.type === 'bike').length
  const runCount = trips.filter((t) => t.type === 'run').length
  const daysRemaining = getDaysRemaining()
  const bikePct = totalTrips > 0 ? Math.round((bikeCount / totalTrips) * 100) : 0
  const runPct = totalTrips > 0 ? Math.round((runCount / totalTrips) * 100) : 0

  const stats = [
    {
      label: 'Turer logget',
      value: loading ? '…' : totalTrips.toString(),
      sub: null as string | null,
    },
    {
      label: 'Dager igjen',
      value: daysRemaining.toString(),
      sub: null,
    },
    {
      label: 'Sykkel / løp',
      value: `${bikeCount} / ${runCount}`,
      sub: totalTrips > 0 ? `${bikePct}% / ${runPct}%` : null,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="metzum-card overflow-hidden p-0"
        >
          <div className={`h-1 ${ACCENT_BARS[i]}`} />
          <div className="p-3 sm:p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-extrabold text-secondary sm:text-2xl">
              {stat.value}
            </p>
            {stat.sub && (
              <p className="mt-0.5 text-xs font-medium text-accent-teal">{stat.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
