"""
End-to-end test for performance search endpoint.
Tests the complete flow: API -> Service -> Repository -> Database
"""

import json


def test_performance_search_e2e(client):
    """
    E2E test for /performance/search endpoint.

    Validates:
    - SSE stream returns exactly 100 progress updates + 1 final result
    - Each progress update has correct structure
    - Final result contains percentile metrics
    - Results count matches expected John Smith employees (at least 10)
    """

    # Make request to performance endpoint
    with client.stream("GET", "performance/search") as response:
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/event-stream; charset=utf-8"

        progress_updates = []
        final_result = None

        # Parse SSE stream
        for line in response.iter_lines():
            line = line.strip()

            # SSE format: "data: {json}\n\n"
            if line.startswith("data: "):
                json_str = line[6:]  # Remove "data: " prefix
                data = json.loads(json_str)

                if data.get("status") == "running":
                    progress_updates.append(data)
                elif data.get("status") == "completed":
                    final_result = data

        assert (
            len(progress_updates) == 100
        ), f"Expected 100 progress updates, got {len(progress_updates)}"
        print(f"\nSUCCESS: Received all 100 progress updates")

        # Validate progress update structure
        for i, update in enumerate(progress_updates, start=1):
            assert (
                update["progress"] == i
            ), f"Progress {i}: expected progress={i}, got {update['progress']}"
            assert update["total"] == 100
            assert update["percentage"] == round((i / 100) * 100, 1)
            assert "current_query_time" in update
            assert "total_time" in update
            assert "results_count" in update
            assert update["status"] == "running"

        print("SUCCESS: All progress updates have correct structure")

        # Validate final result exists
        assert final_result is not None, "Final result not received"
        print("SUCCESS: Final result received")

        # Validate final result structure
        assert final_result["status"] == "completed"
        assert final_result["queries_executed"] == 100
        assert (
            final_result["results_count"] >= 10
        ), f"Expected at least 10 John Smiths, got {final_result['results_count']}"

        # Validate percentile metrics exist and are reasonable
        assert "p50_ms" in final_result
        assert "p95_ms" in final_result
        assert "p99_ms" in final_result
        assert "total_execution_time_ms" in final_result

        # Validate percentile ordering (p50 <= p95 <= p99)
        assert final_result["p50_ms"] <= final_result["p95_ms"], "p50 should be <= p95"
        assert final_result["p95_ms"] <= final_result["p99_ms"], "p95 should be <= p99"

        print(f"\nSUCCESS: Final result validation passed")
        print(f"  - Queries executed: {final_result['queries_executed']}")
        print(f"  - Results count: {final_result['results_count']}")
        print(f"  - Total time: {final_result['total_execution_time_ms']}ms")
        print(f"  - p50: {final_result['p50_ms']}ms")
        print(f"  - p95: {final_result['p95_ms']}ms")
        print(f"  - p99: {final_result['p99_ms']}ms")

        print("\nE2E TEST PASSED: Performance search endpoint working correctly!")
