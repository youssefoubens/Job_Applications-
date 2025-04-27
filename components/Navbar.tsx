'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      setIsAuthenticated(!!data.session)
    }
    
    checkAuth()
  }, [pathname])
  
  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error signing out')
      console.error(error)
    } else {
      toast.success('Signed out successfully')
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/generate" 
              className="text-xl font-bold hover:text-primary transition-colors flex items-center"
            >
              <span className="gradient-text">
                Job App Generator
              </span>
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/generate" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === '/generate' 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' 
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  Generate
                </Link>
                <Link 
                  href="/history" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    pathname === '/history' 
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' 
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  History
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="btn btn-outline text-sm"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline text-sm">
                  Sign In
                </Link>
                <Link href="/signup" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}