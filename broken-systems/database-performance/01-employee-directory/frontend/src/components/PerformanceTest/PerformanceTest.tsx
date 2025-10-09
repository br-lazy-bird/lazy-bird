import React, { useState } from 'react';
import { PerformanceTestState, ProgressData, FinalResult } from '../../types/performance';
import TestDescription from './TestDescription.tsx';
import TestControls from './TestControls.tsx';
import ProgressDisplay from './ProgressDisplay.tsx';
import ResultsDisplay from './ResultsDisplay.tsx';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const PerformanceTest: React.FC = () => {
  const [state, setState] = useState<PerformanceTestState>({ status: 'idle' });

  const startPerformanceTest = () => {
    setState({ status: 'running', progress: {
      progress: 0,
      total: 10,
      percentage: 0,
      average_time: 0,
      current_query_time: 0,
      total_time: 0,
      results_count: 0,
      status: 'running'
    }});

    const eventSource = new EventSource(`${BACKEND_URL}/performance/search`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.status === 'completed' && data.queries_executed !== undefined) {
          const finalResult: FinalResult = {
            status: 'completed',
            total_execution_time_ms: data.total_execution_time_ms,
            p50_ms: data.p50_ms,
            p95_ms: data.p95_ms,
            p99_ms: data.p99_ms,
            queries_executed: data.queries_executed,
            results_count: data.results_count
          };
          setState({ status: 'completed', result: finalResult });
          eventSource.close();
        } else {
          const progressData: ProgressData = data;
          setState({ status: 'running', progress: progressData });
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        setState({ 
          status: 'error', 
          message: 'Failed to parse server response' 
        });
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      setState({ 
        status: 'error', 
        message: 'Connection to server failed' 
      });
      eventSource.close();
    };
  };

  return (
    <div className="card">
      <h1 className="title">
        Employee Search Performance Test
      </h1>

      <TestDescription />

      <TestControls
        onStart={startPerformanceTest}
        isRunning={state.status === 'running'}
      />

      {state.status === 'running' && (
        <ProgressDisplay progress={state.progress} />
      )}

      {state.status === 'completed' && (
        <ResultsDisplay result={state.result} />
      )}

      {state.status === 'error' && (
        <div className="error">
          <p>Error: {state.message}</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceTest;