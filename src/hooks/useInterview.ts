import { useState, useCallback } from 'react';
import { createInterviewRoom, startInterviewer, InterviewApiError } from '../services/interviewApi';
import type { InterviewState } from '../types/interview';

// Utility functions for WebSocket URL handling
function constructWebSocketUrl(apiResponse: any): string {
  console.log('Constructing WebSocket URL from response:', apiResponse);
  
  // First, try to use the websocket_url from response if it exists
  if (apiResponse.websocket_url) {
    console.log('Using provided WebSocket URL:', apiResponse.websocket_url);
    return apiResponse.websocket_url;
  }

  // If websocket_url is missing, try other common field names
  const possibleWsFields = [
    'ws_url', 
    'websocket', 
    'livekit_url', 
    'server_url',
    'ws_endpoint',
    'livekit_ws_url'
  ];
  
  for (const field of possibleWsFields) {
    if (apiResponse[field]) {
      console.log(`Using WebSocket URL from field '${field}':`, apiResponse[field]);
      return apiResponse[field];
    }
  }

  // Try to construct from API base URL
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  console.log('API Base URL:', apiBase);
  
  // Remove API path and construct WebSocket URL
  let baseUrl = apiBase;
  baseUrl = baseUrl.replace('/api/resume-flow', '').replace('/api', '');
  
  // Handle localhost specifically for LiveKit development
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    const wsUrl = baseUrl.replace('http://', 'ws://').replace(':8000', ':7880');
    console.log('Constructed local WebSocket URL for LiveKit:', wsUrl);
    return wsUrl;
  }
  
  const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
  console.log('Constructed WebSocket URL:', wsUrl);
  return wsUrl;
}

function validateApiResponse(response: any): { isValid: boolean; missing: string[] } {
  const requiredFields = ['room_name', 'token'];
  const missing: string[] = [];

  console.log('Validating API response fields:', Object.keys(response));

  for (const field of requiredFields) {
    if (!response[field] || response[field] === '') {
      missing.push(field);
    }
  }

  return { isValid: missing.length === 0, missing };
}

export function useInterview() {
  const [state, setState] = useState<InterviewState>({
    status: 'setup',
  });

  const startInterview = useCallback(async (resume: string, jobDescription: string) => {
    try {
      console.log('Starting interview process...');
      
      // Step 1: Create room
      setState({ status: 'creating-room' });
      
      console.log('Creating interview room...');
      const roomResponse = await createInterviewRoom();
      
      // Detailed logging of the response
      console.group('API Response Analysis');
      console.log('Response type:', typeof roomResponse);
      console.log('Response keys:', Object.keys(roomResponse));
      console.log('Full response:', JSON.stringify(roomResponse, null, 2));
      
      // Check each expected field
      const expectedFields = ['room_name', 'token', 'websocket_url', 'message'];
      expectedFields.forEach(field => {
        const value = roomResponse[field];
        console.log(`${field}:`, {
          exists: field in roomResponse,
          value: value,
          type: typeof value,
          empty: value === '' || value === null || value === undefined
        });
      });
      console.groupEnd();
      
      // Validate the response
      const validation = validateApiResponse(roomResponse);
      if (!validation.isValid) {
        console.error('Missing required fields:', validation.missing);
        throw new InterviewApiError(
          `Invalid room response: missing required fields (${validation.missing.join(', ')}). Check console for full response details.`
        );
      }
      
      // Handle websocket URL construction
      const websocketUrl = constructWebSocketUrl(roomResponse);
      
      // Step 2: Join the room immediately
      setState(prev => ({
        ...prev,
        status: 'active',
        roomName: roomResponse.room_name,
        token: roomResponse.token,
        websocketUrl: websocketUrl,
      }));

      console.log('Joined room successfully, starting interviewer...');

      // Step 3: Start the AI interviewer asynchronously (don't wait for response)
      startInterviewer(roomResponse.room_name, resume, jobDescription)
        .then(() => {
          console.log('Interviewer started successfully');
        })
        .catch(error => {
          console.error('Failed to start interviewer:', error);
          // Could optionally show a warning that the bot failed to start
          // For now, we'll continue with the room connection
        });
      
    } catch (error) {
      console.error('Interview start error:', error);
      
      let errorMessage = 'Failed to start interview. Please try again.';
      let debugInfo = '';
      
      if (error instanceof InterviewApiError) {
        switch (error.status) {
          case 0:
            errorMessage = 'Cannot connect to server. Please ensure the interview service is running.';
            debugInfo = 'Check if the API server is accessible at the configured URL.';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please check your API key.';
            debugInfo = 'Verify the API key is correct in your environment variables.';
            break;
          case 403:
            errorMessage = 'Access denied. Please check your permissions.';
            break;
          case 404:
            errorMessage = 'Interview service endpoint not found.';
            debugInfo = 'The API endpoint may be incorrect or the service may not be deployed.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait before trying again.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = 'Server error. Please try again in a few moments.';
            debugInfo = 'The server may be temporarily unavailable.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
      } else if (error instanceof TypeError) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
        debugInfo = 'Unable to reach the interview service.';
      }

      // Log debug info to console for development
      if (debugInfo) {
        console.log('Debug info:', debugInfo);
      }

      setState({
        status: 'error',
        error: errorMessage,
      });
    }
  }, []);

  const endInterview = useCallback(() => {
    console.log('Ending interview');
    setState({ status: 'ended' });
  }, []);

  const resetInterview = useCallback(() => {
    console.log('Resetting interview');
    setState({ status: 'setup' });
  }, []);

  return {
    state,
    startInterview,
    endInterview,
    resetInterview,
  };
}