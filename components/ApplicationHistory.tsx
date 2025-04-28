'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Application {
  id: string
  created_at: string
  jobTitle: string
  companyName: string
  status: 'draft' | 'submitted'
  generatedApplication: string
}

export function ApplicationHistory({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchApplications()
  }, [userId])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, created_at, jobTitle, companyName, status, generatedApplication')
        .eq('userId', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load application history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setApplications(applications.filter(app => app.id !== id))
      toast.success('Application deleted successfully')
    } catch (error) {
      console.error('Error deleting application:', error)
      toast.error('Failed to delete application')
    }
  }

  if (loading) {
    return <div className="p-4">Loading applications...</div>
  }

  if (applications.length === 0) {
    return <div className="p-4 text-center text-gray-500">No applications found</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Application History</h2>
      <div className="grid gap-4">
        {applications.map((application) => (
          <div key={application.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{application.jobTitle}</h3>
                <p className="text-sm text-gray-500">{application.companyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  application.status === 'draft' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {application.status}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(application.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Created: {new Date(application.created_at).toLocaleDateString()}
            </p>
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-1">Generated Application:</h4>
              <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-2 rounded">
                {application.generatedApplication}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 