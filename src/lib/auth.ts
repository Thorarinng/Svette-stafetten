import type { User } from '@supabase/supabase-js'

export function getDisplayName(user: User | null): string {
  if (!user) return ''

  const meta = user.user_metadata ?? {}
  const fromMeta =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    (typeof meta.name === 'string' && meta.name.trim()) ||
    (typeof meta.display_name === 'string' && meta.display_name.trim())

  if (fromMeta) return fromMeta

  const email = user.email ?? ''
  const local = email.split('@')[0]?.trim()
  return local || 'Ukjent'
}

export function hasDisplayName(user: User | null): boolean {
  if (!user) return false
  const meta = user.user_metadata ?? {}
  return Boolean(
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
      (typeof meta.name === 'string' && meta.name.trim()) ||
      (typeof meta.display_name === 'string' && meta.display_name.trim()),
  )
}
