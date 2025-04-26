'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Error signing out')
      console.error(error)
    } else {
      toast.success('Signed out successfully')
      router.push('/login')
    }
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="bg-red-500 container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-semibold hover:opacity-80 transition-opacity">
              Job App Generator
            </Link>
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                href="/generate" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/generate' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                Generate
              </Link>
              <Link 
                href="/history" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/history' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                History
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleSignOut}
              className="btn btn-secondary"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}