import React from 'react';
import { 
  LiveKitRoom, 
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  ConnectionState,
  useConnectionState
} from '@livekit/components-react';
import { Track, Room, RoomOptions, VideoPresets } from 'livekit-client';
import { PhoneOff, Wifi, WifiOff } from 'lucide-react';

interface InterviewRoomProps {
  token: string;
  wsUrl: string;
  roomName: string;
  onLeave: () => void;
}

function InterviewContent({ onLeave }: { onLeave: () => void }) {
  const connectionState = useConnectionState();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.Microphone, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const getConnectionStatus = () => {
    switch (connectionState) {
      case ConnectionState.Connecting:
        return { text: 'Connecting...', icon: Wifi, color: 'text-yellow-400' };
      case ConnectionState.Connected:
        return { text: 'Connected', icon: Wifi, color: 'text-green-400' };
      case ConnectionState.Disconnected:
        return { text: 'Disconnected', icon: WifiOff, color: 'text-red-400' };
      case ConnectionState.Reconnecting:
        return { text: 'Reconnecting...', icon: Wifi, color: 'text-yellow-400' };
      default:
        return { text: 'Unknown', icon: WifiOff, color: 'text-gray-400' };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Interview Session</h2>
            <div className="flex items-center text-sm">
              <StatusIcon className={`w-4 h-4 mr-2 ${status.color}`} />
              <span className={status.color}>{status.text}</span>
            </div>
          </div>
          <button
            onClick={onLeave}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            Leave Interview
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 relative">
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 140px)' }}>
          <ParticipantTile />
        </GridLayout>
        
        {/* Audio renderer for remote participants */}
        <RoomAudioRenderer />
      </div>

      {/* Bottom control bar */}
      <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <ControlBar variation="verbose" />
      </div>
    </div>
  );
}

export function InterviewRoom({ token, wsUrl, roomName, onLeave }: InterviewRoomProps) {
  // Create room options using livekit-client
  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
    publishDefaults: {
      videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
    },
  };

  const handleDisconnected = () => {
    console.log('Disconnected from room');
  };

  const handleError = (error: Error) => {
    console.error('Room error:', error);
  };

  const handleConnected = () => {
    console.log('Successfully connected to LiveKit room:', roomName);
  };

  // Log connection details for debugging
  console.log('LiveKit connection details:', {
    token: token ? `${token.substring(0, 20)}...` : 'No token',
    wsUrl,
    roomName
  });

  // Validate required props
  if (!token || !wsUrl) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400">Missing connection credentials</p>
          <button
            onClick={onLeave}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={wsUrl}
      options={roomOptions}
      video={true}
      audio={true}
      connect={true}
      data-lk-theme="default"
      style={{ height: '100vh' }}
      onConnected={handleConnected}
      onDisconnected={handleDisconnected}
      onError={handleError}
    >
      <InterviewContent onLeave={onLeave} />
    </LiveKitRoom>
  );
}