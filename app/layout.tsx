import { SupabaseProvider } from '@/providers/SupabaseProvider'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <SupabaseProvider>
          <div className="flex min-h-screen flex-col">
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