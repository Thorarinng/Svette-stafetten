export type TripType = 'bike' | 'run'
export type TripDirection = 'roundtrip' | 'oneway'

export interface Trip {
  id: string
  created_at: string
  trip_date: string | null
  name: string
  user_id: string | null
  type: TripType
  direction: TripDirection
  points: number
}

export interface LeaderboardEntry {
  name: string
  totalPoints: number
  tripCount: number
  bikeCount: number
  runCount: number
}

export interface NewTrip {
  name: string
  user_id: string
  trip_date: string
  type: TripType
  direction: TripDirection
}
