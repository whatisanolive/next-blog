import { isAdmin } from '@/lib/get-user'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()

  if (!admin) redirect('/')

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}