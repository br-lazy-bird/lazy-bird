import React from 'react';

const TestDescription: React.FC = () => {
  return (
    <div className="description">
      <p>
        Our employee directory has been receiving complaints about slow search performance. 
        Users report that searching for employees takes longer than expected, impacting 
        their daily productivity.
      </p>
      <p>
        Run this performance test to measure how the system is actually performing under 
        typical search workloads. The test will help us understand the extent of the 
        performance issue and establish a baseline for improvement.
      </p>
    </div>
  );
};

export default TestDescription;