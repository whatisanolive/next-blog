'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CurrentUser } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function NavbarClient({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? ''} alt={user.name ?? ''} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm hidden md:block">{user.name}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {user.role === 'ADMIN' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-400 focus:text-red-400 cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}