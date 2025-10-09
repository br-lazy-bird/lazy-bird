# DETONADO: Employee Directory Optimization Guide

This guide will help you diagnose and fix the performance problem in the Employee Directory system.

---

## Learning Objective

**Primary Skill:** Database query performance optimization with indexes

By completing this exercise, you will:
- Learn to identify database performance bottlenecks
- Understand how database indexes improve query performance
- Practice using database diagnostic tools
- Implement indexes and measure their impact

---

## Problem Identification

### Symptoms

When you run the Performance Test in the frontend:
- The test takes a significant amount of time to complete
- Each individual query execution is slower than expected
- The system would be unusable in a real-world scenario with actual users

### Establishing the Baseline

Before investigating, establish your baseline performance:

1. Open http://localhost:3000
2. Click "Run Performance Test"
3. Wait for completion and note the metrics:
   - Total execution time
   - P50 (median) query time
   - P95 query time
   - P99 query time

Write these numbers down - you'll compare against them after optimization.

---

## Understanding the Problem: Database Indexes

### What Are Database Indexes?

A database index is a data structure that improves the speed of data retrieval operations on a table. Think of it like an index in a book - instead of reading every page to find a topic, you look it up in the index and jump directly to the relevant page.

**Without an index:**
- The database performs a **sequential scan** (or table scan)
- Every row in the table must be examined
- Query time grows linearly with table size
- With 1 million rows, this becomes very slow

**With an index:**
- The database performs an **index scan**
- Only relevant rows are accessed using the index structure
- Query time grows logarithmically (much slower growth)
- Even with millions of rows, queries remain fast

### Why This System Is Slow

The Employee Directory searches employees by `first_name` and `last_name`:

```sql
SELECT * FROM employees 
WHERE first_name = 'John' AND last_name = 'Smith';
```

Without indexes on these columns, PostgreSQL must:
1. Read every single row in the table (1 million rows)
2. Check if `first_name` = 'John' for each row
3. Check if `last_name` = 'Smith' for each row
4. Return matching results

This is why each query takes significant time - the database is doing unnecessary work.

### How Indexes Solve This

With indexes on `first_name` and `last_name`:
1. PostgreSQL looks up 'John' in the `first_name` index (very fast)
2. Looks up 'Smith' in the `last_name` index (very fast)
3. Returns only the matching rows
4. Avoids reading the other 999,000+ irrelevant rows

**Result:** Queries that took hundreds of milliseconds now take just a few milliseconds.

### Further Reading

If you want to learn more about database indexes:

- **PostgreSQL Official Documentation - Indexes:** https://www.postgresql.org/docs/current/indexes.html
- **Use The Index, Luke (e-book):** https://use-the-index-luke.com/ - Excellent free resource on database indexing

---

## Diagnosis and Root Cause Analysis

### Step 1: Connect to the Database

```bash
make db-shell
```

### Step 2: Examine the Table Structure

```sql
\d employees
```

This shows you the columns in the `employees` table. Note the `first_name` and `last_name` columns - these are what the application searches.

### Step 3: Check for Existing Indexes

```sql
\di
```

This lists all indexes in the database. You'll notice there's only a primary key index on `id`, but **no indexes on `first_name` or `last_name`**.

### Step 4: Analyze Query Execution

Run this command to see how PostgreSQL executes a search query:

```sql
EXPLAIN ANALYZE 
SELECT * FROM employees 
WHERE first_name = 'John' AND last_name = 'Smith';
```

### Understanding EXPLAIN ANALYZE Output

You'll see output similar to this:

```
Gather  (cost=1000.00..18763.00 rows=300 width=60) (actual time=1.332..277.749 rows=346 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Parallel Seq Scan on employees  (cost=0.00..17733.00 rows=125 width=60) (actual time=0.550..184.383 rows=115 loops=3)
        Filter: (((first_name)::text = 'John'::text) AND ((last_name)::text = 'Smith'::text))
        Rows Removed by Filter: 333218
Planning Time: 0.191 ms
Execution Time: 277.820 ms
```

The query performed a **parallel sequential scan** on the `employees` table (≈1M rows).

Two parallel workers were launched, and the leader also participated (`loops=3`).

Each process scanned about one-third of the table (~333k rows), applying the filter:

```sql
first_name = 'John' AND last_name = 'Smith'
```

In total, **346 rows matched** while the rest were discarded.

The planner's estimate (300 rows) was close to the actual result (346).

Execution took ~278 ms, with most time spent scanning.

**Key insight:** Even though PostgreSQL uses parallel workers to speed up the sequential scan, it's still reading all 1 million rows. The database has no way to know which rows match without checking each one. With indexes, PostgreSQL can jump directly to the matching rows without scanning the rest of the table.

---

## Solution Implementation

### Creating the Missing Indexes

The solution is to create indexes on the columns being searched. There are two approaches you can take:

#### Approach 1: Composite Index (Recommended)

A composite index indexes multiple columns together. This is ideal when queries always search both columns simultaneously:

```bash
make db-shell
```

```sql
CREATE INDEX idx_employees_first_last_name ON employees (first_name, last_name);
```

**Why this approach is better for this use case:**
- The application always searches `first_name AND last_name` together
- Single index lookup is more efficient than combining two indexes
- Better performance for this specific query pattern
- More efficient use of disk space

#### Approach 2: Separate Single-Column Indexes

Alternatively, you can create individual indexes on each column:

```sql
CREATE INDEX idx_employees_first_name ON employees (first_name);
CREATE INDEX idx_employees_last_name ON employees (last_name);
```

**When to use this approach:**
- When queries search columns independently (e.g., sometimes only `first_name`, sometimes only `last_name`)
- When you need flexibility for different query patterns
- PostgreSQL can combine these using "Bitmap Index Scan" for queries with both columns

**For this exercise, either approach will dramatically improve performance.** However, the composite index is more optimal since the application only searches both columns together.

### Understanding the Commands

**What these commands do:**
- `CREATE INDEX` - Creates a new index
- `idx_employees_first_last_name` - The name of the index (you can choose any name)
- `ON employees` - The table to create the index on
- `(first_name, last_name)` - The columns to index (order matters for composite indexes)

### Verify Indexes Were Created

```sql
\di
```

**If you used Approach 1 (composite index), you should see:**
- `idx_employees_first_last_name`

**If you used Approach 2 (separate indexes), you should see:**
- `idx_employees_first_name`
- `idx_employees_last_name`

---

## Verification

### Step 1: Verify Query Execution Changed

Run the same query analysis again:

```sql
EXPLAIN ANALYZE 
SELECT * FROM employees 
WHERE first_name = 'John' AND last_name = 'Smith';
```

You should now see output similar to this:

```
Bitmap Heap Scan on employees  (cost=7.50..1056.71 rows=300 width=60) (actual time=0.244..4.380 rows=346 loops=1)
  Recheck Cond: (((first_name)::text = 'John'::text) AND ((last_name)::text = 'Smith'::text))
  Heap Blocks: exact=342
  ->  Bitmap Index Scan on idx_employees_first_last_name  (cost=0.00..7.42 rows=300 width=0) (actual time=0.167..0.167 rows=346 loops=1)
        Index Cond: (((first_name)::text = 'John'::text) AND ((last_name)::text = 'Smith'::text))
Planning Time: 0.481 ms
Execution Time: 4.454 ms
```

**The key differences:**
- **Bitmap Index Scan** instead of Parallel Seq Scan - Using your newly created index
- **Execution Time: ~4.5 ms** instead of ~278 ms - Over 60× faster!
- **Index Cond** - Shows the index is being used to find matching rows
- **No "Rows Removed by Filter"** - The database jumps directly to matching rows without scanning the entire table

Compare this to your earlier `EXPLAIN ANALYZE` output - the difference is dramatic.

### Step 2: Run the Performance Test

1. Open http://localhost:3000
2. Click "Run Performance Test"
3. Compare the new metrics against your baseline

### Step 3: Calculate Improvement

Compare your before and after metrics:

**Total execution time improvement:**
```
(baseline_time - new_time) / baseline_time × 100 = improvement %
```

---

## Expected Results

### Performance Metrics

After creating the indexes:

- **Total execution time:** Dramatically reduced (90-99% faster)
- **P50 (median):** Should drop to single-digit or low double-digit milliseconds
- **P95 and P99:** Consistently fast, showing the optimization is reliable

### Query Behavior

- `EXPLAIN ANALYZE` shows index scans instead of sequential scans
- Execution times are an order of magnitude faster
- The database efficiently locates matching rows without scanning the entire table

### Success Criteria

You've successfully completed the optimization when:
- Performance Test shows 90%+ improvement in total execution time
- All percentile metrics (P50, P95, P99) are significantly reduced
- `EXPLAIN ANALYZE` confirms the database is using your indexes
- The improvement is consistent across multiple test runs

---

**Congratulations!** You've successfully optimized the Employee Directory by adding database indexes. This same technique applies to any database-backed application where search performance is critical.