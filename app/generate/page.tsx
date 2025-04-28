import { JobPostForm } from '@/components/JobPostTextarea'
import { ResumeUpload } from '@/components/ResumeUpload'
import { createClient } from '@/lib/supabase/server'
import { InfoIcon } from 'lucide-react'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  
  // If data.user is undefined, the middleware will handle the redirect
  const userId = data.user?.id || 'anonymous'

  return (
    <div className="container py-8">
      <div className="generate-form animate-fade-in-up max-w-4xl mx-auto">
        <div className="generate-form-header">
          <h1 className="text-gradient">Generate Application</h1>
          <p className="text-muted-foreground">Upload your resume and paste the job description to create a tailored application.</p>
        </div>
        
        <div className="p-4 bg-blue-50 text-blue-800 rounded-lg mb-6 flex items-start gap-3">
          <InfoIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Instructions:</p>
            <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
              <li>First, upload your resume (PDF format)</li>
              <li>Then paste the job description</li>
              <li>Click "Generate Application" to create your tailored application</li>
            </ol>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="generate-field-group">
            <div className="bg-white rounded-lg shadow-sm">
              <ResumeUpload userId={userId} />
            </div>
          </div>
          <div className="generate-field-group">
            <div className="bg-white rounded-lg shadow-sm">
              <JobPostForm userId={userId} />
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Need help? Contact support at support@jobapp.com</p>
        </div>
      </div>
    </div>
  )
}