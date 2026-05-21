import { useEffect, useState } from 'react'
import { getCountdown } from '../lib/constants'

export function Countdown() {
  const [countdown, setCountdown] = useState(() => getCountdown())

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown()), 1000)
    return () => clearInterval(id)
  }, [])

  if (countdown.ended) {
    return (
      <p className="py-2 text-center text-sm font-semibold text-warning">
        Konkurransen er avsluttet
      </p>
    )
  }

  const label = countdown.notStarted ? 'Starter om' : 'Tid igjen'

  const units = [
    { value: countdown.days, label: 'dager' },
    { value: countdown.hours, label: 'timer' },
    { value: countdown.minutes, label: 'min' },
    { value: countdown.seconds, label: 'sek' },
  ]

  return (
    <div className="px-2 py-4 text-center sm:px-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-accent-teal">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-xl bg-gradient-to-b from-primary/15 to-white px-1 py-2.5 ring-1 ring-primary/40"
          >
            <span className="block text-2xl font-extrabold tabular-nums text-secondary">
              {u.value}
            </span>
            <span className="text-[10px] font-semibold uppercase text-gray-500">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
