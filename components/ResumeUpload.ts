'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { toast } from 'sonner'
import { PDFExtract } from 'pdf.js-extract'

export function ResumeUpload({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const supabase = createClient()

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer()
    const pdfExtract = new PDFExtract()
    const data = await pdfExtract.extractBuffer(arrayBuffer)
    
    if (!data || !data.pages) {
      throw new Error('Failed to extract text from PDF')
    }
    
    // Extract text from all pages
    let text = ''
    for (const page of data.pages) {
      for (const content of page.content) {
        if (content.str) {
          text += content.str + ' '
        }
      }
      text += '\n'
    }
    
    return text.trim()
  }

  const handleUpload = async () => {
    if (!file) {
      const msg = 'Please select a resume file first'
      setErrorMessage(msg)
      toast.error(msg)
      return
    }

    if (file.type !== 'application/pdf') {
      const msg = 'Only PDF files are accepted'
      setErrorMessage(msg)
      toast.error(msg)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = 'File size must be less than 5MB'
      setErrorMessage(msg)
      toast.error(msg)
      return
    }

    setLoading(true)
    setErrorMessage(null)
    setUploadSuccess(false)
    
    try {
      // Step 1: Upload the PDF to Supabase
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('resume')
        .upload(fileName, file)

      if (uploadError) {
        throw new Error(`Failed to upload file: ${uploadError.message}`)
      }

      // Step 2: Extract text from the uploaded PDF
      const text = await extractTextFromPDF(file)
      setExtractedText(text)

      // Optional: store in localStorage if needed
      localStorage.setItem('resume_text', text)
      localStorage.setItem('resume_file_path', fileName)

      setUploadSuccess(true)
      toast.success('Resume uploaded and processed successfully!')
    } catch (error) {
      let message = 'Failed to process resume'
      if (error instanceof Error) {
        message = error.message
      }
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold">Upload Resume</h2>
      <p className="text-sm text-muted-foreground">
        Upload your resume as a PDF file (max 5MB). We'll upload it and extract the text.
      </p>
      
      <div className="grid gap-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0]
            if (selectedFile) {
              setFile(selectedFile)
              setUploadSuccess(false)
              setErrorMessage(null)
              setExtractedText('')
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {file && (
          <div className="text-sm text-gray-500">
            <p>Selected file: <span className="font-medium">{file.name}</span></p>
            <p>Size: {(file.size / 1024).toFixed(1)} KB</p>
            <p>Type: {file.type}</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="text-sm text-red-500 font-medium space-y-1">
            <p>Error:</p>
            <p>{errorMessage}</p>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="space-y-2">
            <p className="text-sm text-green-600 font-medium">
              ✓ Resume uploaded and processed successfully!
            </p>
            {extractedText && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Extracted Text:</h3>
                <pre className="text-sm whitespace-pre-wrap">{extractedText}</pre>
              </div>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className={`w-full ${uploadSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {loading ? 'Processing...' : uploadSuccess ? 'Processed!' : 'Process Resume'}
        </Button>
      </div>
    </div>
  )
}
