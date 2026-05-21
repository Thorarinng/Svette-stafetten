import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getDisplayName } from '../lib/auth'
import { allowedEmailError, isAllowedEmail } from '../lib/email'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  user: User | null
  displayName: string
  loading: boolean
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user
      if (nextUser?.email && !isAllowedEmail(nextUser.email)) {
        void supabase.auth.signOut()
        setSession(null)
        setLoading(false)
        return
      }
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const email = session?.user?.email
    if (email && !isAllowedEmail(email)) {
      void supabase.auth.signOut()
    }
  }, [session])

  const signInWithEmail = useCallback(async (email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) throw new Error('E-post er påkrevd')
    if (!isAllowedEmail(trimmed)) throw new Error(allowedEmailError())

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) throw new Error(error.message)
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }, [])

  const updateDisplayName = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) throw new Error('Navn er påkrevd')

    const { error } = await supabase.auth.updateUser({
      data: { full_name: trimmed },
    })

    if (error) throw new Error(error.message)
  }, [])

  const user = session?.user ?? null
  const displayName = getDisplayName(user)

  const value = useMemo(
    () => ({
      session,
      user,
      displayName,
      loading,
      signInWithEmail,
      signOut,
      updateDisplayName,
    }),
    [session, user, displayName, loading, signInWithEmail, signOut, updateDisplayName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth må brukes innenfor AuthProvider')
  return ctx
}
