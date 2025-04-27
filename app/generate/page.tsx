import { JobPostForm } from '@/components/JobPostTextarea'
import { ResumeUpload } from '@/components/ResumeUpload'
import { createClient } from '@/lib/supabase/server'

export default async function GeneratePage() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  
  // If data.user is undefined, the middleware will handle the redirect
  const userId = data.user?.id || 'anonymous'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Generate Application</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResumeUpload userId={userId} />
        <JobPostForm userId={userId} />
      </div>
    </div>
  )
}