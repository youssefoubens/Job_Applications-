'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export function JobPostForm({ userId }: { userId: string }) {
  const [jobPost, setJobPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resumeAvailable, setResumeAvailable] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if resume data is available in localStorage
    const resumeData = localStorage.getItem('resume_file_data')
    const resumeName = localStorage.getItem('resume_file_name')
    
    if (resumeData && resumeName) {
      setResumeAvailable(true)
    }
  }, [])

  const handleSubmit = async () => {
    if (!jobPost.trim()) {
      toast.error('Please enter a job post')
      setErrorMessage('Please enter a job post description')
      return
    }

    if (!resumeAvailable) {
      toast.error('Please upload your resume first')
      setErrorMessage('Please upload your resume before generating an application')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      // Skip database operations entirely and use only localStorage
      
      // Get timestamp for ID
      const timestamp = new Date().toISOString()
      const applicationId = Date.now().toString()
      
      // Store data in localStorage
      localStorage.setItem('current_job_post', jobPost)
      localStorage.setItem('application_timestamp', timestamp)
      localStorage.setItem('application_id', applicationId)
      
      // Success message
      toast.success('Application processed successfully!')
      
      // Navigate to preview with ID
      router.push(`/preview?applicationId=${applicationId}`)
    } catch (error) {
      // This shouldn't happen with localStorage, but just in case
      const message = error instanceof Error ? error.message : 'Failed to process application'
      toast.error(message)
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold">Job Post Details</h2>
      <p className="text-sm text-muted-foreground">
        Paste the job description below to match with your resume.
      </p>
      
      {!resumeAvailable && (
        <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          Please upload your resume first before generating an application.
        </div>
      )}
      
      <div className="space-y-2">
        <Textarea
          value={jobPost}
          onChange={(e) => setJobPost(e.target.value)}
          placeholder="Paste the job description here..."
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          The AI will analyze this along with your resume to generate a tailored application.
        </p>
        {errorMessage && (
          <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
        )}
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !jobPost.trim() || !resumeAvailable}
        className="w-full"
      >
        {isSubmitting ? 'Processing...' : 'Generate Application'}
      </Button>
    </div>
  )
}