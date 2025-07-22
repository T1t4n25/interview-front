import { useState, useCallback } from 'react';
import { createInterviewRoom, startInterviewer, InterviewApiError } from '../services/interviewApi';
import type { InterviewState } from '../types/interview';

export function useInterview() {
  const [state, setState] = useState<InterviewState>({
    status: 'setup',
  });

  const startInterview = useCallback(async (resume: string, jobDescription: string) => {
    try {
      // Step 1: Create room
      setState({ status: 'creating-room' });
      
      const roomResponse = await createInterviewRoom();
      
      // Step 2: Join the room immediately
      setState(prev => ({
        ...prev,
        status: 'active',
        roomName: roomResponse.room_name,
        token: roomResponse.token,
        websocketUrl: roomResponse.websocket_url,
      }));

      // Step 3: Start the AI interviewer asynchronously (don't wait for response)
      startInterviewer(roomResponse.room_name, resume, jobDescription).catch(error => {
        console.error('Failed to start interviewer:', error);
        // Could optionally show a warning that the bot failed to start
      });
      
    } catch (error) {
      console.error('Interview start error:', error);
      
      let errorMessage = 'Failed to start interview. Please try again.';
      
      if (error instanceof InterviewApiError) {
        if (error.status === 401) {
          errorMessage = 'Authentication failed. Please check your API key.';
        } else if (error.status === 429) {
          errorMessage = 'Rate limit exceeded. Please wait before trying again.';
        } else {
          errorMessage = error.message;
        }
      }

      setState({
        status: 'error',
        error: errorMessage,
      });
    }
  }, []);

  const endInterview = useCallback(() => {
    setState({ status: 'ended' });
  }, []);

  const resetInterview = useCallback(() => {
    setState({ status: 'setup' });
  }, []);

  return {
    state,
    startInterview,
    endInterview,
    resetInterview,
  };
}