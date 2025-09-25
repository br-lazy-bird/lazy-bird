import React, { useState } from "react";
import SearchResults from "./SearchResults.tsx";
import { SearchResponse } from "../types/employee";

const EmployeeSearch: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/search/john-smith");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      console.log("Backend response:", data);

      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-search">
      <div className="search-header">
        <h1>Employee Directory</h1>
        <p>Click the button below to search for employees named "John Smith"</p>
      </div>

      <div className="search-controls">
        <button
          className="search-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search for John Smith"}
        </button>
      </div>

      {error && <div className="error-message">Error: {error}</div>}

      {loading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <span>Searching employees...</span>
        </div>
      )}

      {searchResults && !loading && (
        <SearchResults
          totalCount={searchResults.results_count}
          executionTime={searchResults.execution_time_ms}
        />
      )}
    </div>
  );
};

export default EmployeeSearch;
