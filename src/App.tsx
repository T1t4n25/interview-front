import React from 'react';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewStatus } from './components/InterviewStatus';
import { InterviewRoom } from './components/InterviewRoom';
import { InterviewCompleted } from './components/InterviewCompleted';
import { useInterview } from './hooks/useInterview';
import '@livekit/components-styles';

function App() {
  const { state, startInterview, endInterview, resetInterview } = useInterview();

  const renderCurrentView = () => {
    switch (state.status) {
      case 'setup':
        return (
          <InterviewSetup
            onStartInterview={startInterview}
            loading={false}
          />
        );

      case 'creating-room':
      case 'joining':
      case 'starting-agent':
        return (
          <InterviewStatus
            status={state.status}
          />
        );

      case 'active':
        return (
          <InterviewRoom
            token={state.token!}
            wsUrl={state.websocketUrl!}
            roomName={state.roomName!}
            onLeave={endInterview}
          />
        );

      case 'ended':
        return (
          <InterviewCompleted
            onRestart={resetInterview}
          />
        );

      case 'error':
        return (
          <InterviewStatus
            status={state.status}
            error={state.error}
          />
        );

      default:
        return (
          <InterviewSetup
            onStartInterview={startInterview}
            loading={false}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentView()}
    </div>
  );
}

export default App;