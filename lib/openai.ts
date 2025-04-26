import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateEmail(resumeText: string, jobPost: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional career coach that writes compelling job application emails. 
        Create a personalized email that highlights the candidate's relevant skills from their resume 
        that match the job requirements. Keep it professional but not overly formal (3-4 paragraphs max).`
      },
      {
        role: "user",
        content: `My Resume:\n${resumeText}\n\nJob Posting:\n${jobPost}`
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  })

  return completion.choices[0].message.content || ''
}