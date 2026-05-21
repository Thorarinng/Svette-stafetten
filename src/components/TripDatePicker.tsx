import { useMemo } from 'react'
import {
  getSelectableDateKeys,
  parseDateKey,
  toDateKey,
} from '../lib/tripDates'

interface TripDatePickerProps {
  value: string
  onChange: (dateKey: string) => void
  min: string
  max: string
  occupiedDates: ReadonlySet<string>
  todayKey?: string
}

function formatLongLabel(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function TripDatePicker({
  value,
  onChange,
  min,
  max,
  occupiedDates,
  todayKey = toDateKey(new Date()),
}: TripDatePickerProps) {
  const quickDays = useMemo(() => {
    const all = getSelectableDateKeys()
    return all.slice(0, 14)
  }, [])

  const showCalendar = !quickDays.includes(value)

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-semibold text-gray-600">Hvilken dag?</span>
        <span className="text-[11px] font-medium text-accent-teal">Maks én tur per dag</span>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quickDays.map((dateKey) => {
          const taken = occupiedDates.has(dateKey)
          const selected = value === dateKey
          const isToday = dateKey === todayKey

          return (
            <button
              key={dateKey}
              type="button"
              disabled={taken}
              onClick={() => onChange(dateKey)}
              className={`relative flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center rounded-2xl px-3 py-2.5 text-center transition-all ${
                taken
                  ? 'cursor-not-allowed bg-gray-100/90 text-gray-400 ring-1 ring-gray-200/80'
                  : selected
                    ? 'bg-gradient-to-br from-primary via-[#f8d54a] to-accent-teal/30 text-secondary shadow-[0_8px_24px_rgba(240,189,0,0.45)] ring-2 ring-primary scale-[1.02]'
                    : 'bg-white text-gray-600 ring-1 ring-gray-200/80 hover:ring-accent-teal/50 hover:shadow-md'
              }`}
            >
              {isToday && !taken && (
                <span className="absolute -top-1 right-2 h-2 w-2 rounded-full bg-accent-teal shadow-[0_0_8px_rgba(7,162,168,0.8)]" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                {taken ? '✓' : isToday ? 'I dag' : parseDateKey(dateKey).toLocaleDateString('nb-NO', { weekday: 'short' })}
              </span>
              <span className="mt-0.5 text-lg font-extrabold tabular-nums leading-none">
                {parseDateKey(dateKey).getDate()}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold capitalize opacity-70">
                {taken
                  ? 'Logget'
                  : parseDateKey(dateKey).toLocaleDateString('nb-NO', { month: 'short' })}
              </span>
            </button>
          )
        })}
      </div>

      <div
        className={`overflow-hidden rounded-2xl ring-1 transition-all ${
          showCalendar
            ? 'bg-gradient-to-r from-accent-teal/10 via-white to-primary/10 ring-accent-teal/40'
            : 'bg-gray-50/80 ring-gray-200/70'
        }`}
      >
        <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
              showCalendar
                ? 'bg-accent-teal/15 ring-1 ring-accent-teal/30'
                : 'bg-white ring-1 ring-gray-200/80'
            }`}
          >
            📅
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Velg annen dato
            </span>
            <span className="block truncate text-sm font-bold text-secondary">
              {formatLongLabel(value)}
            </span>
          </span>
          <input
            type="date"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value)
            }}
            className="h-10 w-[7.5rem] shrink-0 cursor-pointer rounded-xl border-0 bg-white/90 px-2 text-sm font-semibold text-secondary shadow-sm ring-1 ring-gray-200/80 [color-scheme:light] focus:ring-2 focus:ring-accent-teal/40"
          />
        </label>
      </div>

      {occupiedDates.has(value) && (
        <p className="rounded-xl bg-warning/10 px-3 py-2 text-center text-sm font-medium text-warning ring-1 ring-warning/25">
          Du har allerede en tur denne dagen — velg en annen dato eller rediger under Mine turer.
        </p>
      )}
    </div>
  )
}
