// app/verify-email/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MailCheckIcon } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Verifying your email...')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

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
          setStatus('error')
        } else {
          setMessage('Email verified successfully! Redirecting...')
          setStatus('success')
          setTimeout(() => {
            router.push('/generate')
          }, 2000)
        }
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="verify-email animate-fade-in">
      <div className="verify-email-icon">
        <MailCheckIcon size={48} className={status === 'success' ? 'animate-bounce text-success' : status === 'error' ? 'animate-shake text-destructive' : 'animate-pulse'} />
      </div>
      <h2 className="verify-email-title">{status === 'success' ? 'Email Verified!' : status === 'error' ? 'Verification Failed' : 'Email Verification'}</h2>
      <p className="verify-email-text">{message}</p>
      
      {status === 'error' && (
        <button 
          className="btn btn-primary btn-hover mt-4"
          onClick={() => router.push('/(auth)/login')}
        >
          Back to Login
        </button>
      )}
    </div>
  )
}