export interface SearchResponse {
  results_count: number;
  execution_time_ms: number;
}

export interface SearchResultsProps {
  totalCount: number;
  executionTime: number;
}
