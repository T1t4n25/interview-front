/**
 * Utility to handle WebSocket URL construction and validation
 */

export function constructWebSocketUrl(apiResponse: any): string {
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
  
  // Clean up the base URL
  baseUrl = baseUrl.replace('/api/resume-flow', '').replace('/api', '');
  
  // Handle localhost specifically for LiveKit development
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    // For local development, LiveKit typically runs on port 7880
    const wsUrl = baseUrl.replace('http://', 'ws://').replace(':8000', ':7880');
    console.log('Constructed local WebSocket URL for LiveKit:', wsUrl);
    return wsUrl;
  }
  
  // For production, convert HTTP to WebSocket
  const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
  console.log('Constructed WebSocket URL:', wsUrl);
  
  return wsUrl;
}

export function validateApiResponse(response: any): { isValid: boolean; missing: string[] } {
  const requiredFields = ['room_name', 'token'];
  const missing: string[] = [];

  console.log('Validating API response fields:', Object.keys(response));

  for (const field of requiredFields) {
    if (!response[field]) {
      missing.push(field);
    }
  }

  // Also check for empty strings
  for (const field of requiredFields) {
    if (response[field] === '') {
      if (!missing.includes(field)) {
        missing.push(`${field} (empty)`);
      }
    }
  }

  const result = {
    isValid: missing.length === 0,
    missing
  };

  console.log('Validation result:', result);
  return result;
}

export function logResponseDetails(response: any) {
  console.group('API Response Analysis');
  console.log('Response type:', typeof response);
  console.log('Response keys:', Object.keys(response));
  console.log('Full response:', JSON.stringify(response, null, 2));
  
  // Check each expected field
  const expectedFields = ['room_name', 'token', 'websocket_url', 'message'];
  expectedFields.forEach(field => {
    const value = response[field];
    console.log(`${field}:`, {
      exists: field in response,
      value: value,
      type: typeof value,
      empty: value === '' || value === null || value === undefined
    });
  });
  console.groupEnd();
}