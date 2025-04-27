import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container py-16 lg:py-24">
        <div className="flex flex-col gap-10 items-center justify-center text-center max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="gradient-text">
              Generate Personalized Job Applications
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Use AI to create tailored job applications that match your resume to the job description in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-12">
            <div className="card p-8 flex flex-col items-center hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                <Image
                  src="/file.svg"
                  alt="Upload icon"
                  width={32}
                  height={32}
                  className="dark:brightness-125"
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Upload Resume</h3>
              <p className="text-muted-foreground text-center">Upload your resume as a PDF to extract your skills and experience</p>
            </div>
            
            <div className="card p-8 flex flex-col items-center hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mb-6 text-secondary-600 dark:text-secondary-400">
                <Image
                  src="/globe.svg"
                  alt="Job Post icon"
                  width={32}
                  height={32}
                  className="dark:brightness-125"
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Job Description</h3>
              <p className="text-muted-foreground text-center">Paste the job posting text to match your skills to the requirements</p>
            </div>
            
            <div className="card p-8 flex flex-col items-center hover:shadow-lg hover:-translate-y-1">
              <div className="w-16 h-16 bg-primary-100/50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                <Image
                  src="/window.svg" 
                  alt="Generate icon"
                  width={32}
                  height={32}
                  className="dark:brightness-125"
                />
              </div>
              <h3 className="font-semibold text-xl mb-3">Generate Application</h3>
              <p className="text-muted-foreground text-center">Get a personalized email or cover letter highlighting your relevant experience</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
            <Link
              className="btn btn-primary rounded-full px-8 py-3 shadow-md hover:shadow-primary/20 w-full sm:w-auto"
              href="/generate"
            >
              Get Started →
            </Link>
            <Link
              className="btn btn-outline rounded-full px-8 py-3 w-full sm:w-auto"
              href="/history"
            >
              View History
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Job Application Generator</p>
            <div className="h-1 w-1 rounded-full bg-current hidden sm:block"></div>
            <p>Streamline your job search with personalized applications</p>
          </div>
        </div>
      </footer>
    </div>
  );
}