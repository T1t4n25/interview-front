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
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new InterviewApiError(
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
      response.status
    );
  }

  return response.json();
}

export async function createInterviewRoom() {
  return makeApiRequest<{
    room_name: string;
    token: string;
    websocket_url: string;
    message: string;
  }>('/interview/start-room', {
    method: 'POST',
  });
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