'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function EmailPreview({ applicationId, userId }: { applicationId: string, userId: string }) {
  const [emailContent, setEmailContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [loadingError, setLoadingError] = useState<string | null>(null)
  const [resumeSize, setResumeSize] = useState<number>(0)

  // Personal details state (automatically populated by AI)
  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')

  useEffect(() => {
    const savedResumeData = localStorage.getItem('resume_text')
    const jobDescription = localStorage.getItem('current_job_post')

    if (!jobDescription) {
      toast.error('Job description not found. Please submit a job post first.')
      return
    }

    if (!savedResumeData) {
      toast.error('Resume data not found. Please upload your resume first.')
      return
    }

    generateEmailWithAI(savedResumeData, jobDescription)
  }, [applicationId])

  const generateEmailWithAI = async (resumeData: string, jobDescription: string) => {
    setIsGenerating(true)
    setLoadingError(null)

    try {
      // Approximate token size calculation for monitoring
      setResumeSize(resumeData.length)

      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumeData }),
      })

      const data = await response.json()

      if (!response.ok || !data.emailContent) {
        throw new Error(data.message || 'Failed to generate email')
      }

      // Set email content
      setEmailContent(data.emailContent)

      // Extract personal details from AI response
      if (data.personalDetails) {
        setFullName(data.personalDetails.name || '')
        setEmail(data.personalDetails.email || '')
        setPhone(data.personalDetails.phone || '')
      }

      // Save the generated email
      localStorage.setItem('generated_email', data.emailContent)

    } catch (error) {
      setLoadingError(error instanceof Error ? error.message : 'Failed to generate email')
    
    } finally {
      setIsGenerating(false)
    }
  }

  

  const handleRegenerate = () => {
    if (resumeSize > 100000) toast.warning('Your resume may be too large.')
    const resumeData = localStorage.getItem('resume_text') || ''
    const jobDescription = localStorage.getItem('current_job_post') || ''
    if (resumeData && jobDescription) {
      generateEmailWithAI(resumeData, jobDescription)
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Application Email</h2>
        <Button onClick={() => window.history.back()}>Back</Button>
      </div>
  
      {isGenerating && (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto" />
          <p>Generating email...</p>
        </div>
      )}
  
      {loadingError && (
        <div className="bg-red-50 text-red-800 p-3 rounded">
          <p>Error: {loadingError}</p>
        </div>
      )}
  
      <Textarea
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
        className="min-h-[500px]"
        disabled={isGenerating}
      />
      
      <div className="flex gap-2 justify-end">
        <Button
          onClick={() => navigator.clipboard.writeText(emailContent)}
          disabled={!emailContent}
        >
          Copy
        </Button>
        
        <Button
          onClick={handleRegenerate}
          disabled={isGenerating}
          variant="outline"
        >
          Regenerate
        </Button>
      </div>
    </div>
  )
}
