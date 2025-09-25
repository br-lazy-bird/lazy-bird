import React from "react";
import { SearchResultsProps } from "../types/employee";

const SearchResults: React.FC<SearchResultsProps> = ({
  totalCount,
  executionTime,
}) => {
  return (
    <div className="search-results">
      {/* Performance Display */}
      <div className="performance-display">
        <span className="execution-time">
          Query executed in <strong>{executionTime.toFixed(1)}ms</strong>
        </span>
        <span className="results-count">
          Found <strong>{totalCount}</strong> matching employees
        </span>
      </div>

      {/* Simplified Results Message */}
      <div className="results-summary">
        <h3>Search Complete</h3>
        <p>
          Successfully found <strong>{totalCount}</strong> employees named "John
          Smith" in <strong>{executionTime.toFixed(1)}ms</strong>
        </p>
        <div className="performance-note">
          <p>
            💡{" "}
            <em>
              This search took{" "}
              {executionTime > 100
                ? "quite a while"
                : "a reasonable amount of time"}
              . There might be room for optimization!
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
