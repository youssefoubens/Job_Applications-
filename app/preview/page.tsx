import { EmailPreview } from '@/components/EmailPreview'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: { applicationId: string }
}) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect('/login')

  return (
    <div className="container mx-auto px-4 py-8">
      <EmailPreview 
        applicationId={searchParams.applicationId}
        userId={data.user.id}
      />
    </div>
  )
}