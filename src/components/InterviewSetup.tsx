import React, { useState } from 'react';
import { Users, FileText, Briefcase, Play } from 'lucide-react';

interface InterviewSetupProps {
  onStartInterview: (resume: string, jobDescription: string) => void;
  loading: boolean;
}

export function InterviewSetup({ onStartInterview, loading }: InterviewSetupProps) {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resume.trim() && jobDescription.trim()) {
      onStartInterview(resume, jobDescription);
    }
  };

  const isFormValid = resume.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Interview Assistant</h1>
          <p className="text-blue-200 text-lg">
            Start your personalized AI-powered interview experience
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="resume" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <FileText className="w-4 h-4 mr-2" />
                Resume / CV Content
              </label>
              <textarea
                id="resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume content here, including your experience, skills, education, and achievements..."
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label htmlFor="jobDescription" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for the role you're interviewing for, including requirements, responsibilities, and qualifications..."
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Setting up your interview...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-3" />
                  Start AI Interview
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Your interview will be conducted by an AI assistant tailored to your resume and the job requirements
          </p>
        </div>
      </div>
    </div>
  );
}