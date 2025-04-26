'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'

export function ResumeUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const { error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file)

      if (error) throw error

      toast.success('Resume uploaded successfully!')
    } catch (error) {
      toast.error('Error uploading resume'+error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Resume</h2>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </div>
  )
}