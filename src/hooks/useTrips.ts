import { useCallback, useEffect, useState } from 'react'
import { calculatePoints } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { isDateKeyInRange, userHasTripOnDate } from '../lib/tripDates'
import type { NewTrip, Trip, TripDirection, TripType } from '../lib/types'

function generateId(): string {
  return crypto.randomUUID()
}

function isSchemaSetupError(message: string): boolean {
  return (
    message.includes('schema cache') ||
    message.includes('does not exist') ||
    message.includes('permission denied') ||
    message.includes('42501')
  )
}

const SETUP_HINT =
  'Kjør supabase/RUN_THIS_FOR_EDIT_DELETE.sql i Supabase SQL Editor, vent 10 sek, og prøv igjen.'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('trips')
      .select('*')
      .order('trip_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setTrips((data as Trip[]) ?? [])
    setError(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      await fetchTrips()
      if (!cancelled) setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fetchTrips])

  const addTrip = useCallback(
    async (
      userId: string,
      displayName: string,
      type: TripType,
      direction: TripDirection,
      tripDate: string,
    ) => {
      const trimmedName = displayName.trim()
      if (!trimmedName) {
        throw new Error('Navn er påkrevd')
      }

      if (!isDateKeyInRange(tripDate)) {
        throw new Error('Datoen må være innen konkurranseperioden og ikke i fremtiden')
      }

      if (userHasTripOnDate(trips, userId, tripDate)) {
        throw new Error('Du har allerede registrert en tur denne dagen')
      }

      const points = calculatePoints(direction)
      const optimisticTrip: Trip = {
        id: generateId(),
        created_at: new Date().toISOString(),
        trip_date: tripDate,
        name: trimmedName,
        user_id: userId,
        type,
        direction,
        points,
      }

      setTrips((prev) => [optimisticTrip, ...prev])

      const payload: NewTrip = {
        name: trimmedName,
        user_id: userId,
        trip_date: tripDate,
        type,
        direction,
        points,
      }

      const { data, error: insertError } = await supabase
        .from('trips')
        .insert(payload)
        .select()
        .single()

      if (insertError) {
        setTrips((prev) => prev.filter((t) => t.id !== optimisticTrip.id))
        if (insertError.code === '23505') {
          throw new Error('Du har allerede registrert en tur denne dagen')
        }
        if (
          insertError.message.includes('trip_date') ||
          insertError.message.includes('column')
        ) {
          throw new Error(
            'Kjør supabase/migrations/006_trip_date.sql i Supabase SQL Editor, vent 10 sek, og prøv igjen.',
          )
        }
        throw new Error(insertError.message)
      }

      setTrips((prev) =>
        prev.map((t) => (t.id === optimisticTrip.id ? (data as Trip) : t)),
      )

      return data as Trip
    },
    [trips],
  )

  const updateTrip = useCallback(
    async (
      tripId: string,
      _userId: string,
      type: TripType,
      direction: TripDirection,
    ) => {
      const points = calculatePoints(direction)
      const previous = trips.find((t) => t.id === tripId)
      if (!previous) throw new Error('Turen finnes ikke')

      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error('Du må være innlogget for å redigere')

      const userId = session.user.id

      setTrips((prev) =>
        prev.map((t) =>
          t.id === tripId ? { ...t, type, direction, points, user_id: userId } : t,
        ),
      )

      const { data, error: updateError } = await supabase
        .from('trips')
        .update({ type, direction, points, user_id: userId })
        .eq('id', tripId)
        .select()

      if (updateError) {
        setTrips((prev) =>
          prev.map((t) => (t.id === tripId ? previous : t)),
        )
        if (isSchemaSetupError(updateError.message)) {
          throw new Error(SETUP_HINT)
        }
        throw new Error(updateError.message)
      }

      const updated = (data as Trip[] | null)?.[0]
      if (!updated) {
        setTrips((prev) =>
          prev.map((t) => (t.id === tripId ? previous : t)),
        )
        throw new Error(SETUP_HINT)
      }

      setTrips((prev) =>
        prev.map((t) => (t.id === tripId ? updated : t)),
      )

      return updated
    },
    [trips],
  )

  const deleteTrip = useCallback(async (tripId: string, _userId: string) => {
    const previous = trips.find((t) => t.id === tripId)
    if (!previous) throw new Error('Turen finnes ikke')

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error('Du må være innlogget for å slette')

    setTrips((prev) => prev.filter((t) => t.id !== tripId))

    const { data: deleted, error: deleteError } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .select('id')

    if (deleteError) {
      setTrips((prev) =>
        [...prev, previous].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      )
      if (isSchemaSetupError(deleteError.message)) {
        throw new Error(SETUP_HINT)
      }
      throw new Error(deleteError.message)
    }

    if (!deleted?.length) {
      setTrips((prev) =>
        [...prev, previous].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      )
      throw new Error(SETUP_HINT)
    }
  }, [trips])

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    refetch: fetchTrips,
  }
}
