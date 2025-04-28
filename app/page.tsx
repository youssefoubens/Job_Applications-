import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Generate Personalized Job Applications
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Use AI to create tailored job applications that match your resume to the job description in seconds.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Image
                    src="/file.svg"
                    alt="Upload icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2">Upload Resume</h3>
                <p className="text-gray-500">Upload your resume as a PDF to extract your skills and experience</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Image
                    src="/globe.svg"
                    alt="Job Post icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2">Job Description</h3>
                <p className="text-gray-500">Paste the job posting text to match your skills to the requirements</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Image
                    src="/window.svg" 
                    alt="Generate icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="font-semibold text-xl mb-2">Generate Application</h3>
                <p className="text-gray-500">Get a personalized email or cover letter highlighting your relevant experience</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                href="/generate"
              >
                Get Started →
              </Link>
              <Link
                className="px-8 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-full transition-colors"
                href="/history"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Job Application Generator</p>
            <p>Streamline your job search with personalized applications</p>
          </div>
        </div>
      </footer>
    </div>
  );
}