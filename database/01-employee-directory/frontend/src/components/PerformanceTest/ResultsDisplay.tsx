import React from 'react';
import { FinalResult } from '../../types/performance';
import styles from './PerformanceTest.module.css';

interface ResultsDisplayProps {
  result: FinalResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className={styles.resultsContainer}>
      <h2 className={styles.resultsTitle}>Test Completed</h2>
      
      <div className={styles.resultsGrid}>
        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Total Execution Time:</span>
          <span className={styles.resultValue}>
            {result.total_execution_time_ms.toFixed(2)} ms
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Average Query Time:</span>
          <span className={styles.resultValue}>
            {result.average_time_ms.toFixed(2)} ms
          </span>
        </div>

        <div className={styles.resultItem}>
          <span className={styles.resultLabel}>Queries Executed:</span>
          <span className={styles.resultValue}>
            {result.queries_executed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;