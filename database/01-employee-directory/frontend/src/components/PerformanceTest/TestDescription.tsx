import React from 'react';
import styles from './PerformanceTest.module.css';

const TestDescription: React.FC = () => {
  return (
    <div className={styles.description}>
      <p>
        This test executes multiple search queries for employees named "John Smith" 
        to measure database performance. Each query searches the employee table and 
        returns matching results.
      </p>
      <p>
        The test will run 10 queries sequentially and display real-time progress 
        along with performance metrics including total execution time and average 
        query time.
      </p>
    </div>
  );
};

export default TestDescription;