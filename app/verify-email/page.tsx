// app/verify-email/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verifyEmail = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (token_hash && type === 'signup') {
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({
          type: 'signup',
          token_hash
        })

        if (error) {
          setMessage('Verification failed. Please try again.')
        } else {
          setMessage('Email verified successfully! Redirecting...')
          router.push('/generate')
        }
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}