import { EmailPreview } from '@/components/EmailPreview'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PreviewPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Handle applicationId properly
  const applicationId = typeof searchParams?.applicationId === 'string' 
    ? searchParams.applicationId 
    : Array.isArray(searchParams?.applicationId) 
      ? searchParams.applicationId[0] 
      : '';

  // Redirect if no applicationId
  if (!applicationId) {
    redirect('/');
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  
  // In our localStorage version, we don't strictly need auth
  // Let's provide a fallback userId if auth fails
  const userId = data.user?.id || 'local-user';

  return (
    <div className="preview-container animate-fade-in-up">
      <div className="preview-document">
        <EmailPreview 
          applicationId={applicationId}
          userId={userId}
        />
      </div>
    </div>
  )
}