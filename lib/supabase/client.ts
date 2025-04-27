'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Singleton instance 
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (supabaseInstance) return supabaseInstance
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  console.log('Creating new Supabase client instance')
  
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      debug: true,
    }
  })
  
  return supabaseInstance
}