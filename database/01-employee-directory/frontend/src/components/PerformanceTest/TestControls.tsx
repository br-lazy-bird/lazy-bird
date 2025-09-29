import React from 'react';
import styles from './PerformanceTest.module.css';

interface TestControlsProps {
  onStart: () => void;
  isRunning: boolean;
}

const TestControls: React.FC<TestControlsProps> = ({ onStart, isRunning }) => {
  return (
    <div className={styles.controls}>
      <button
        className={styles.button}
        onClick={onStart}
        disabled={isRunning}
      >
        {isRunning ? 'Test Running...' : 'Run Performance Test'}
      </button>
    </div>
  );
};

export default TestControls;