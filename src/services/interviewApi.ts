const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/resume-flow';
const API_KEY = import.meta.env.VITE_API_KEY || 'dOoxF5rGQ_9KE7N5jEJehI38hQ1Hvgo9P3TjGRIy5NE';

export class InterviewApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'InterviewApiError';
  }
}

async function makeApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making API request to:', url);
  console.log('Using API key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'No API key');
  
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials for cross-origin requests
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = `HTTP ${response.status} ${response.statusText}`;
      }
      
      console.error('API Error Response:', errorText);
      
      // Handle specific error cases
      if (response.status === 0 || response.status === 404) {
        throw new InterviewApiError(
          'Unable to connect to the interview server. Please check if the server is running and accessible.',
          response.status
        );
      }
      
      if (response.status >= 500) {
        throw new InterviewApiError(
          'Server error occurred. Please try again later.',
          response.status
        );
      }
      
      throw new InterviewApiError(
        `API request failed: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`,
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new InterviewApiError('Server returned non-JSON response', response.status);
    }

    return response.json();
  } catch (error) {
    if (error instanceof InterviewApiError) {
      throw error;
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new InterviewApiError(
        'Network error: Unable to connect to the server. Please check your internet connection and server availability.',
        0
      );
    }
    
    throw new InterviewApiError(
      `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0
    );
  }
}

export async function createInterviewRoom() {
  const response = await makeApiRequest<{
    room_name: string;
    token: string;
    websocket_url?: string; // Make optional since it might not be returned
    message: string;
    [key: string]: any; // Allow additional fields
  }>('/interview/start-room', {
    method: 'POST',
  });
  
  // Log the raw response for debugging
  console.log('Raw API response:', JSON.stringify(response, null, 2));
  
  return response;
}

export async function startInterviewer(
  roomName: string,
  resume: string,
  jobDescription: string
) {
  const params = new URLSearchParams({
    room_name: roomName,
    resume,
    job_description: jobDescription,
  });

  return makeApiRequest<{
    message: string;
    room_name: string;
  }>(`/interview/start-interviewer?${params.toString()}`, {
    method: 'POST',
  });
}