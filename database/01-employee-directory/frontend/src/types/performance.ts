/**
 * Progress data sent during test execution
 */
export interface ProgressData {
  progress: number;                // Current query number (1, 2, 3...)
  total: number;                   // Total queries to execute
  percentage: number;              // Progress percentage (0-100)
  current_query_time: number;      // Time for current query in ms
  average_time: number;            // Average time per query in ms
  total_time: number;              // Cumulative time in ms
  results_count: number;           // Number of results found
  status: 'running' | 'completed'; // Execution status
}

/**
 * Final result data sent when test completes
 */
export interface FinalResult {
  status: 'completed';
  total_execution_time_ms: number;  // Total time for all queries
  p50_ms: number;              // NEW: Median
  p95_ms: number;              // NEW: 95th percentile
  p99_ms: number;              // NEW: 99th percentile
  queries_executed: number;         // Number of queries executed
  results_count: number;            // Number of results found
}

/**
 * Overall state of the performance test
 */
export type PerformanceTestState =
  | { status: 'idle' }                              // Not started yet
  | { status: 'running'; progress: ProgressData }   // Test in progress
  | { status: 'completed'; result: FinalResult }    // Test completed
  | { status: 'error'; message: string };           // Error occurred