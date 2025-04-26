import pdf from 'pdf-parse'

export async function extractTextFromPdf(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()
    const data = await pdf(Buffer.from(buffer))
    return data.text
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw error
  }
}