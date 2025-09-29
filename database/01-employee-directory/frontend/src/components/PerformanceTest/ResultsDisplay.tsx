import React from 'react';
import { FinalResult } from '../../types/performance';

interface ResultsDisplayProps {
  result: FinalResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="resultsContainer">
      <h2 className="resultsTitle">Test Completed</h2>
      
      <div className="resultsGrid">
        <div className="resultItem">
          <span className="resultLabel">Total Execution Time:</span>
          <span className="resultValue">
            {result.total_execution_time_ms.toFixed(2)} ms
          </span>
        </div>

        <div className="resultItem">
          <span className="resultLabel">P50 (Median):</span>
          <span className="resultValue">
            {result.p50_ms.toFixed(2)} ms
          </span>
        </div>

        <div className="resultItem">
          <span className="resultLabel">P95:</span>
          <span className="resultValue">
            {result.p95_ms.toFixed(2)} ms
          </span>
        </div>

        <div className="resultItem">
          <span className="resultLabel">P99:</span>
          <span className="resultValue">
            {result.p99_ms.toFixed(2)} ms
          </span>
        </div>

        <div className="resultItem">
          <span className="resultLabel">Queries Executed:</span>
          <span className="resultValue">
            {result.queries_executed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;