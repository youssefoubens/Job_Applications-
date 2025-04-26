'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function JobPostForm({ userId }: { userId: string }) {
  const [jobPost, setJobPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!jobPost.trim()) {
      toast.error('Please enter a job post')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Get user's most recent resume
      const { data: resumeData } = await supabase.storage
        .from('resumes')
        .list(`${userId}/`, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (!resumeData?.length) {
        throw new Error('No resume found. Please upload your resume first.')
      }

      const resumeUrl = supabase.storage
        .from('resumes')
        .getPublicUrl(`${userId}/${resumeData[0].name}`).data.publicUrl

      // 2. Create application record
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          linkedin_post: jobPost,
          resume_url: resumeUrl
        })
        .select()
        .single()

      if (error) throw error

      // 3. Redirect to preview page
      router.push(`/preview?applicationId=${application.id}`)
      toast.success('Job post saved successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save job post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Job Post Details</h2>
      <div className="space-y-2">
        <Textarea
          value={jobPost}
          onChange={(e) => setJobPost(e.target.value)}
          placeholder="Paste the LinkedIn job post here..."
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          The AI will analyze this along with your resume to generate a tailored application.
        </p>
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !jobPost.trim()}
        className="w-full"
      >
        {isSubmitting ? 'Processing...' : 'Generate Application'}
      </Button>
    </div>
  )
}