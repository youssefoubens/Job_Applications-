'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'

interface ApplicationData {
  userId: string
  jobTitle: string
  companyName: string
  jobDescription: string
  resumeText: string
  generatedApplication: string
  status: 'draft' | 'submitted'
}

export function SaveApplication({ 
  userId, 
  jobTitle, 
  companyName, 
  jobDescription, 
  generatedApplication 
}: { 
  userId: string
  jobTitle: string
  companyName: string
  jobDescription: string
  generatedApplication: string
}) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)
    try {
      // Get the resume text from localStorage
      const resumeText = localStorage.getItem('resume_text') || ''

      const applicationData: ApplicationData = {
        userId,
        jobTitle,
        companyName,
        jobDescription,
        resumeText,
        generatedApplication,
        status: 'draft'
      }

      const { error } = await supabase
        .from('applications')
        .insert([applicationData])

      if (error) {
        throw error
      }

      toast.success('Application saved successfully!')
    } catch (error) {
      console.error('Error saving application:', error)
      toast.error('Failed to save application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleSave} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'Saving...' : 'Save Application'}
    </Button>
  )
} 