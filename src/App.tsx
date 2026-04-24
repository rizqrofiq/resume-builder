import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FileDown, LayoutPanelLeft } from 'lucide-react';
import { ResumeEditor } from './components/ResumeEditor';
import { ResumePreview } from './components/ResumePreview';
import type { ResumeData } from './types/resume';
import { initialResumeData } from './types/resume';

const GithubIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      <header className="flex-none h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <LayoutPanelLeft className="text-blue-600" size={24} />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Builder<span className="text-blue-600">ATS</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/rizqrofiq/resume-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            title="View source on GitHub"
          >
            <GithubIcon size={20} />
            <span className="hidden sm:inline">View source</span>
          </a>
          <button
            onClick={() => handlePrint()}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <FileDown size={18} className="mr-2" />
            Download PDF
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-1/2 h-full overflow-y-auto border-r border-slate-200 bg-slate-50 relative z-0 custom-scrollbar">
          <ResumeEditor data={resumeData} onChange={setResumeData} />
        </div>

        <div className="w-1/2 h-full overflow-y-auto bg-slate-200 p-8 flex justify-center custom-scrollbar">
          <ResumePreview data={resumeData} previewRef={previewRef} />
        </div>
      </main>
    </div>
  );
}

export default App;
