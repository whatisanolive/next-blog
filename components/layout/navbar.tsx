import Link from 'next/link'
import { getCurrentUser } from '@/lib/get-user'
import { NavbarClient } from './navbar-client'

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="border-b border-zinc-800 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight">
          yourname.dev
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/tech" className="hover:text-foreground transition">Tech</Link>
          <Link href="/dsa" className="hover:text-foreground transition">DSA</Link>
          <Link href="/blank-canvas" className="hover:text-foreground transition">Blank Canvas</Link>
        </nav>

        {/* Auth */}
        <NavbarClient user={user} />

      </div>
    </header>
  )
}