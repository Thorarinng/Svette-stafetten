import { createClient } from '@supabase/supabase-js'
import type { Trip } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Mangler VITE_SUPABASE_URL eller VITE_SUPABASE_ANON_KEY. Sett miljøvariabler for å koble til Supabase.',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type TripsTable = Trip
