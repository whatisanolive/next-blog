import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
   const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const payload = await request.json()

  // Supabase sends event type in the payload
  const { type, record } = payload

  if (type === 'INSERT' && record) {
    try {
      await prisma.user.upsert({
        where: { supabaseId: record.id },
        update: {},
        create: {
          supabaseId: record.id,
          email: record.email,
          name: record.raw_user_meta_data?.name ?? null,
          avatarUrl: record.raw_user_meta_data?.avatar_url ?? null,
          role: 'USER',
        },
      })
    } catch (error) {
      console.error('Error syncing user:', error)
      return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}