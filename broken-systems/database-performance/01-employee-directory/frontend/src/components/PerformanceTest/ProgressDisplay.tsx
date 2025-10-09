import React from 'react';
import { ProgressData } from '../../types/performance';

interface ProgressDisplayProps {
  progress: ProgressData;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => {
  return (
    <div className="progressContainer">
      <div className="progressHeader">
        <span className="progressText">
          Query {progress.progress} of {progress.total}
        </span>
        <span className="progressPercentage">
          {progress.percentage}%
        </span>
      </div>

      <div className="progressBarBackground">
        <div 
          className="progressBarFill"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="progressStats">
        <div className="stat">
          <span className="statLabel">Current Query:</span>
          <span className="statValue">{progress.current_query_time.toFixed(2)} ms</span>
        </div>
        <div className="stat">
          <span className="statLabel">Total Time:</span>
          <span className="statValue">{progress.total_time.toFixed(2)} ms</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;