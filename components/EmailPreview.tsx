'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { generateEmail } from '@/lib/openai'
import { extractTextFromPdf } from '@/lib/pdf-parser'
import { useRouter } from 'next/navigation'

export function EmailPreview({
  applicationId,
  userId
}: {
  applicationId: string
  userId: string
}) {
  const [emailContent, setEmailContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (error) {
        toast.error('Failed to load application')
        console.error(error)
        return
      }

      if (data.generated_email) {
        setEmailContent(data.generated_email)
      } else {
        generateEmailContent(data)
      }
    }

    fetchApplication()
  }, [applicationId])

  const generateEmailContent = async (application: any) => {
    setIsGenerating(true)
    try {
      // 1. Get resume text
      const resumeText = await extractTextFromPdf(application.resume_url)

      // 2. Generate email with OpenAI
      const generatedEmail = await generateEmail(
        resumeText,
        application.linkedin_post || ''
      )

      // 3. Update in database
      const { error } = await supabase
        .from('applications')
        .update({ generated_email: generatedEmail })
        .eq('id', applicationId)

      if (error) throw error

      setEmailContent(generatedEmail)
      toast.success('Email generated successfully!')
    } catch (error) {
      toast.error('Failed to generate email')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailContent.trim()) {
      toast.error('Email content cannot be empty')
      return
    }

    setIsSending(true)
    try {
      // 1. Update final email in database
      const { error } = await supabase
        .from('applications')
        .update({ final_email: emailContent })
        .eq('id', applicationId)

      if (error) throw error

      // 2. Send email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          emailContent
        })
      })

      if (!response.ok) throw new Error('Failed to send email')

      router.push('/success')
      toast.success('Application sent successfully!')
    } catch (error) {
      toast.error('Failed to send application')
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Email</h2>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      <div className="space-y-4">
        <Textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
          placeholder="Generating email content..."
        />
        
        <div className="flex justify-end space-x-4">
          <Button
            variant="secondary"
            onClick={async () => {
              const { data } = await supabase
                .from('applications')
                .select('*')
                .eq('id', applicationId)
                .single()
              
              if (data) generateEmailContent(data)
            }}
            disabled={isGenerating}
          >
            {isGenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
          
          <Button
            onClick={handleSendEmail}
            disabled={isSending || isGenerating}
          >
            {isSending ? 'Sending...' : 'Send Application'}
          </Button>
        </div>
      </div>
    </div>
  )
}