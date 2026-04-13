import { SignupForm } from '@/components/auth/signup-form'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="text-zinc-400 text-sm">Start reading and commenting today</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}