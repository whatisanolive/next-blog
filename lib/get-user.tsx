import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import type { CurrentUser } from '@/types'

// cache() deduplicates calls within a single request
// so no matter how many server components call getCurrentUser()
// it only hits the database once per request
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
      },
    })

    return dbUser
  } catch {
    return null
  }
})

// Convenience helper for admin checks
export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN'
})