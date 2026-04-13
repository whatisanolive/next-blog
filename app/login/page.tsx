import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}