import React, { useState } from 'react';
import { PerformanceTestState, ProgressData, FinalResult } from '../../types/performance';
import TestDescription from './TestDescription.tsx';
import TestControls from './TestControls.tsx';
import ProgressDisplay from './ProgressDisplay.tsx';
import ResultsDisplay from './ResultsDisplay.tsx';
import styles from './PerformanceTest.module.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const PerformanceTest: React.FC = () => {
  const [state, setState] = useState<PerformanceTestState>({ status: 'idle' });

  const startPerformanceTest = () => {
    setState({ status: 'running', progress: {
      progress: 0,
      total: 10,
      percentage: 0,
      current_query_time: 0,
      average_time: 0,
      total_time: 0,
      results_count: 0,
      status: 'running'
    }});

    // Create EventSource connection for Server-Sent Events
    // Connect directly to backend to bypass React dev server proxy buffering
    const eventSource = new EventSource(`${BACKEND_URL}/performance/search`);

    console.log('EventSource created, readyState:', eventSource.readyState);

    eventSource.onopen = () => {
     console.log('EventSource connection opened');
    };

    eventSource.onmessage = (event) => {

      console.log('Raw event data:', event.data);
      
      try {
        const data = JSON.parse(event.data);

        // Check if this is the final result or progress update
        if (data.status === 'completed' && data.queries_executed !== undefined) {
          // Final result
          const finalResult: FinalResult = {
            status: 'completed',
            total_execution_time_ms: data.total_execution_time_ms,
            average_time_ms: data.average_time_ms,
            queries_executed: data.queries_executed,
            results_count: data.results_count
          };
          setState({ status: 'completed', result: finalResult });
          eventSource.close();
        } else {
          // Progress update
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
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
          <div className={styles.error}>
            <p>Error: {state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTest;