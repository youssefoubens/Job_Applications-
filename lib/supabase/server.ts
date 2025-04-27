// lib/supabase/server.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { cache } from 'react'

// Create a simple server-side client without cookie handling
export const createClient = cache(() => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
})