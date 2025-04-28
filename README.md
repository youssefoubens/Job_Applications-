# Job Application Generator

A web application that helps users create tailored job applications by analyzing job descriptions and resumes.

## Features

- Upload your resume
- Input job descriptions
- Generate tailored application emails using OpenAI
- Copy to clipboard functionality
- No database required (uses localStorage)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with the following:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Replace `your_openai_api_key_here` with your actual OpenAI API key.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `OPENAI_API_KEY`: Required for generating application emails using the OpenAI API.

## Using the Application

1. Upload your resume on the home page
2. Enter the job description on the job post page
3. Click "Generate Application" to create a tailored application email
4. Copy the generated email or regenerate as needed

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- OpenAI API
