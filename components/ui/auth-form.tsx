'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './button'

export function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error, data } = type === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

      if (error) throw error
      
      // Check if we have a session
      if (data?.session) {
        // Force a full page refresh to /generate
        window.location.href = '/generate'
      } else if (type === 'signup') {
        // Handle signup success - may not have immediate session if email confirmation is required
        setError('Account created! Please check your email for confirmation.')
      } else {
        // This shouldn't happen for login, but just in case
        router.push('/generate')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {type === 'login' ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {type === 'login' 
            ? 'Sign in to your account to continue'
            : 'Get started with your free account'}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full justify-center py-2.5 px-4 rounded-lg font-medium transition-all"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : type === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>
      </div>

      {type === 'login' ? (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      ) : (
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      )}
    </form>
  )
}