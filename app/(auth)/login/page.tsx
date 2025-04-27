// app/login/page.tsx
import { AuthForm } from '@/components/ui/auth-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()
  if (data.user) redirect('/generate')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <AuthForm type="login" />
    </div>
  )
}