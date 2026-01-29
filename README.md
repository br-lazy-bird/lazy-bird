# Lazy Bird Project

A repository of intentionally broken systems designed for learning performance optimization through hands-on practice.

## About

Many software engineers face interview rejections due to lack of hands-on experience with specific problems they understand only theoretically. Lazy Bird addresses this by providing complete, realistic systems with intentional performance issues across the full technology stack.

## Available Broken Systems

### Data Integrity

- [01-flash-sales](https://github.com/br-lazy-bird/data-integrity-01-flash-sales)

### Database Performance

- [01-employee-directory](https://github.com/br-lazy-bird/database-performance-01-employee-directory)

- [02-orders-report](https://github.com/br-lazy-bird/database-performance-02-orders-reports)

### Asynchronous Patterns

- [01-product-catalog](https://github.com/br-lazy-bird/asynchronous-patterns-01-product-catalog)

### Response Time Optimization

- [01-content-delivery](https://github.com/br-lazy-bird/response-time-optimization-01-content-delivery)

More systems coming soon!

## Getting Started

### Option 1: Clone a specific exercise directly

```bash
git clone git@github.com:br-lazy-bird/database-01-employee-directory.git
```

### Option 2: Clone via main repository

```bash
# Clone main repo
git clone git@github.com:br-lazy-bird/lazy-bird.git
cd lazy-bird
# Clone specific exercise
git submodule update --init database/01-employee-directory
```

### Option 3: Clone all exercises

```bash
git clone --recurse-submodules git@github.com:br-lazy-bird/lazy-bird.git
```

## Learning Approach

Each broken system follows a consistent pattern:

- Single issue focus - One specific performance problem per system
- Complete stack - Frontend, Backend, Database showing real-world impact
- Hands-on practice - No solution code provided; learn by doing
- Standardized guide - DETONADO.md provides diagnosis, verification and solution steps
- Docker environment - Consistent, reproducible setup

## For Hiring Managers

Lazy Bird systems make excellent technical assessments. Share specific exercises with candidates for standardized evaluation.

## Blog

The development is being documented here: https://lazybird.com.br/blog/

## License

GPL-3.0 License