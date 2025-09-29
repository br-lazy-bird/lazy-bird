import React from 'react';

interface TestControlsProps {
  onStart: () => void;
  isRunning: boolean;
}

const TestControls: React.FC<TestControlsProps> = ({ onStart, isRunning }) => {
  return (
    <div className="controls">
      <button
        className="button"
        onClick={onStart}
        disabled={isRunning}
      >
        {isRunning ? 'Test Running...' : 'Run Performance Test'}
      </button>
    </div>
  );
};

export default TestControls;