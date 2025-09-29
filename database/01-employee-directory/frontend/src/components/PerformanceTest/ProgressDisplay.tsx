import React from 'react';
import { ProgressData } from '../../types/performance';
import styles from './PerformanceTest.module.css';

interface ProgressDisplayProps {
  progress: ProgressData;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ progress }) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressText}>
          Query {progress.progress} of {progress.total}
        </span>
        <span className={styles.progressPercentage}>
          {progress.percentage}%
        </span>
      </div>

      <div className={styles.progressBarBackground}>
        <div 
          className={styles.progressBarFill}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className={styles.progressStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Current Query:</span>
          <span className={styles.statValue}>{progress.current_query_time.toFixed(2)} ms</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Average Time:</span>
          <span className={styles.statValue}>{progress.average_time.toFixed(2)} ms</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Time:</span>
          <span className={styles.statValue}>{progress.total_time.toFixed(2)} ms</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressDisplay;