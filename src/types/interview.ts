export interface InterviewState {
  status: 'setup' | 'creating-room' | 'joining' | 'starting-agent' | 'active' | 'ended' | 'error';
  roomName?: string;
  token?: string;
  websocketUrl?: string;
  error?: string;
}

export interface InterviewData {
  resume: string;
  jobDescription: string;
}

export interface ApiResponse {
  room_name: string;
  token: string;
  websocket_url: string;
  message: string;
}

export interface AgentResponse {
  message: string;
  room_name: string;
}