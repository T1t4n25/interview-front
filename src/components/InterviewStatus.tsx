import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Users, Bot } from 'lucide-react';

interface InterviewStatusProps {
  status: string;
  error?: string;
}

const statusConfig = {
  'creating-room': {
    icon: Loader2,
    title: 'Creating Interview Room',
    description: 'Setting up your private interview space...',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  'starting-agent': {
    icon: Bot,
    title: 'Initializing AI Interviewer',
    description: 'Your AI interviewer is preparing questions based on your profile...',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  'joining': {
    icon: Users,
    title: 'Joining Interview Room',
    description: 'Connecting to your interview session with the AI interviewer...',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  'error': {
    icon: AlertCircle,
    title: 'Connection Error',
    description: 'We encountered an issue. Please try again.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

export function InterviewStatus({ status, error }: InterviewStatusProps) {
  const config = statusConfig[status as keyof typeof statusConfig];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const isLoading = ['creating-room', 'joining', 'starting-agent'].includes(status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className={`${config.bgColor} rounded-2xl p-8 shadow-2xl`}>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full mb-6`}>
              <Icon 
                className={`w-8 h-8 ${config.color} ${isLoading ? 'animate-spin' : ''}`}
              />
            </div>
            
            <h2 className={`text-2xl font-bold ${config.color} mb-3`}>
              {config.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {error || config.description}
            </p>

            {isLoading && (
              <div className="flex items-center justify-center space-x-2">
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full animate-bounce`}></div>
                  <div className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                  <div className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Please wait while we prepare your interview experience
          </p>
        </div>
      </div>
    </div>
  );
}