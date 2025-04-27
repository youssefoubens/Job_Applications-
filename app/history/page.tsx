import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatDistanceToNow } from '@/lib/utils'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: sessionData } = await supabase.auth.getUser()
  
  if (!sessionData.user) {
    redirect('/login')
  }
  
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', sessionData.user.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1>Application History</h1>
        <Link 
          href="/generate"
          className="btn btn-primary"
        >
          Create New
        </Link>
      </div>
      
      {applications && applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Application {app.id.substring(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {formatDistanceToNow(new Date(app.created_at))} ago
                  </p>
                </div>
                <Link
                  href={`/preview/${app.id}`}
                  className="btn btn-secondary text-sm py-1.5 px-3"
                >
                  View Details
                </Link>
              </div>
              
              {app.final_email && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded max-h-40 overflow-hidden relative">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {app.final_email}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-800"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card p-8">
          <h3 className="text-xl font-medium mb-2">No applications yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Start by creating your first personalized job application
          </p>
          <Link
            href="/generate"
            className="btn btn-primary"
          >
            Create Application
          </Link>
        </div>
      )}
    </div>
  )
} 