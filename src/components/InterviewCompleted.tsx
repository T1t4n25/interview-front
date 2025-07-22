import React from 'react';
import { CheckCircle, RotateCcw, Download } from 'lucide-react';

interface InterviewCompletedProps {
  onRestart: () => void;
}

export function InterviewCompleted({ onRestart }: InterviewCompletedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Interview Completed!</h1>
          <p className="text-green-200 text-lg">
            Great job! Your AI interview session has ended successfully.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                What's Next?
              </h2>
              <p className="text-gray-600 mb-6">
                Your interview performance has been recorded and analyzed. You can start a new interview or review your session.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRestart}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Start New Interview
              </button>
              
              <button
                className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-3" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-green-200 text-sm">
            Thank you for using our AI Interview Assistant
          </p>
        </div>
      </div>
    </div>
  );
}