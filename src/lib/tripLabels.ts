import type { TripDirection, TripType } from './types'

export function tripTypeLabel(type: TripType): string {
  return type === 'bike' ? 'Sykkel' : 'Løp'
}

export function tripDirectionLabel(direction: TripDirection): string {
  return direction === 'roundtrip' ? 'Tur-retur' : 'En vei'
}

export function formatTripDay(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatTripDate(iso: string): string {
  return new Date(iso).toLocaleString('nb-NO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
