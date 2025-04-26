import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="flex flex-col gap-8 items-center justify-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold sm:text-5xl">Generate Personalized Job Applications</h1>
        
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Use AI to create tailored job applications that match your resume to the job description.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-8">
          <div className="card p-6 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Image
                src="/file.svg"
                alt="Upload icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">Upload Resume</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload your resume as a PDF to extract your skills and experience</p>
          </div>
          
          <div className="card p-6 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Image
                src="/globe.svg"
                alt="Job Post icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">Job Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Paste the job posting text to match your skills to the requirements</p>
          </div>
          
          <div className="card p-6 flex flex-col items-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <Image
                src="/window.svg" 
                alt="Generate icon"
                width={24}
                height={24}
                className="dark:invert"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">Generate Application</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get a personalized email or cover letter highlighting your relevant experience</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="btn btn-primary w-full sm:w-auto"
            href="/generate"
          >
            Get Started
          </Link>
          <Link
            className="btn btn-secondary w-full sm:w-auto"
            href="/history"
          >
            View History
          </Link>
        </div>
      </div>
      
      <footer className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-16 text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Job Application Generator</p>
        <div className="h-1 w-1 rounded-full bg-current hidden sm:block"></div>
        <p>Streamline your job search with personalized applications</p>
      </footer>
    </div>
  );
}
