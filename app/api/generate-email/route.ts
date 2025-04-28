import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

// Helper function to process and clean resume data
function processResumeData(resumeData: string): string {
  try {
    let cleanedData = resumeData;
    if (resumeData.includes(';base64,')) {
      cleanedData = resumeData.split(';base64,')[1] || '';
    }

    if (!cleanedData.startsWith('%PDF')) {
      return cleanedData.substring(0, 3000) + 
        (cleanedData.length > 3000 ? '\n[Resume content truncated due to length]' : '');
    }

    const textOnly = cleanedData.replace(/[^\x20-\x7E\n]/g, '').replace(/\s+/g, ' ').trim().substring(0, 3000);
    return textOnly + '\n[Resume content truncated to essential text]';
  } catch (error) {
    console.error('Error processing resume data:', error);
    return 'Error extracting text from resume. Please upload a text-based resume.';
  }
}

// Helper function to extract personal details using OpenAI
async function extractPersonalDetails(resumeText: string): Promise<{name: string, email: string, phone: string}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a resume parser. Extract only the person\'s full name, email address, and phone number from the resume text.' },
        { role: 'user', content: `Extract only the following fields as a JSON object from this resume text:\n\n${resumeText}` },
      ],
      temperature: 0.1,
      max_tokens: 150,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      name: result.name || '',
      email: result.email || '',
      phone: result.phone || '',
    };
  } catch (error) {
    console.error('Error extracting personal details:', error);
    return { name: '', email: '', phone: '' };
  }
}

// POST handler to process the request
export async function POST(req: NextRequest) {
  try {
    const { jobDescription, resumeFileName, resumeData } = await req.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json({ message: 'Job description and resume data are required' }, { status: 400 });
    }

    const processedResumeData = processResumeData(resumeData);
    const personalDetails = await extractPersonalDetails(processedResumeData);

    // Limit job description length
    const limitedJobDescription = jobDescription.substring(0, 2000) + 
      (jobDescription.length > 2000 ? '\n[Job description truncated due to length]' : '');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert job application assistant. Generate a personalized job application email based on the resume and job description provided.',
        },
        {
          role: 'user',
          content: `
            Job Description: ${limitedJobDescription}\n
            Resume: ${processedResumeData}\n
            Personal Details: Name: ${personalDetails.name}, Email: ${personalDetails.email}, Phone: ${personalDetails.phone}
          `,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const emailContent = completion.choices[0]?.message?.content || 'Error generating email content';

    return NextResponse.json({ emailContent, personalDetails });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({
      message: 'Failed to generate email with AI',
      emailContent: 'Error generating email content. Please try again.',
    }, { status: 500 });
  }
}
