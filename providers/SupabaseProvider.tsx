'use client'

import { createClient } from '@/lib/supabase/client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { ReactNode, useState } from 'react'

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() => createClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}