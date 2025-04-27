import { SupabaseProvider } from '@/providers/SupabaseProvider'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { headers } from 'next/headers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Job Application Generator',
  description: 'Generate personalized job applications tailored to your resume and job postings',
  keywords: ['job application', 'resume', 'ai', 'cover letter', 'job search'],
}

// Disable client-side data revalidation to prevent refresh loops
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate at most once per hour

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Force headers read to improve caching - prevents redundant revalidation
  headers()
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <SupabaseProvider>
          <div className="relative flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}