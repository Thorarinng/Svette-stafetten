import { AuthPanel } from './components/AuthPanel'
import { Header } from './components/Header'
import { Leaderboard } from './components/Leaderboard'
import { MyTrips } from './components/MyTrips'
import { StatsBar } from './components/StatsBar'
import { TripForm } from './components/TripForm'
import { AuthProvider } from './contexts/AuthContext'
import { TRIP_DATE_SETUP_HINT, useTrips } from './hooks/useTrips'

function AppContent() {
  const {
    trips,
    loading,
    error,
    needsTripDateMigration,
    addTrip,
    updateTrip,
    deleteTrip,
  } = useTrips()

  return (
    <div className="min-h-svh">
      <Header />

      <main className="relative mx-auto max-w-lg space-y-4 px-4 py-5 pb-10 sm:space-y-5 sm:py-6">
        {needsTripDateMigration && (
          <div className="metzum-alert-error">
            <p className="font-semibold">Database må oppdateres</p>
            <p className="mt-1">{TRIP_DATE_SETUP_HINT}</p>
            <p className="mt-2 text-xs opacity-90">
              Supabase Dashboard → SQL Editor → lim inn hele{' '}
              <code className="rounded bg-black/5 px-1">RUN_THIS_ALL.sql</code> fra repoet.
            </p>
          </div>
        )}

        {error && (
          <div className="metzum-alert-error">
            Kunne ikke laste data: {error}. Sjekk Supabase-tilkoblingen.
          </div>
        )}

        <AuthPanel />
        <StatsBar trips={trips} loading={loading} />
        <TripForm trips={trips} onSubmit={addTrip} />
        <MyTrips
          trips={trips}
          loading={loading}
          onUpdate={updateTrip}
          onDelete={deleteTrip}
        />
        <Leaderboard trips={trips} loading={loading} />
      </main>

      <footer className="flex flex-col items-center gap-2 pb-8 text-center">
        <img
          src="/metzum.png"
          alt="Metzum"
          className="h-10 w-auto max-w-[200px] object-contain opacity-80"
        />
        <p className="text-xs font-medium text-gray-400">
          Ledertavle åpen · Turer krever innlogging
        </p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
