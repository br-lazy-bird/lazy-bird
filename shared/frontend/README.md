# Lazy Bird Shared Frontend Components

Shared UI components and styles for Lazy Bird educational projects.

This directory serves as a **template/source** for reusable components that ensure consistency across all broken systems.

---

## Architecture Decision

These components are **copied into each system** rather than installed as a package, ensuring:
- Each system is **self-contained** and can be cloned independently
- Systems work as **standalone submodules**
- No external dependencies between systems
- Consistent styling and behavior across all systems

---

## How to Use in New Systems

### 1. Copy Components into Your System

```bash
# From the system's frontend directory
cp -r ../../../../../shared/frontend/src/components ./src/shared-components
cp -r ../../../../../shared/frontend/src/styles ./src/shared-styles
```

### 2. Import Shared Styles

In your `src/index.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared-styles/base.css';  // ← Import shared styles first
import './index.css';
import App from './App';
```

### 3. Use Components

```tsx
import { SystemLayout, MetricsFooter } from './shared-components/SystemLayout';
import { LoadingSpinner } from './shared-components/LoadingSpinner';

function MySystem() {
  return (
    <SystemLayout
      title="My System Title"
      description={<p>Problem description here</p>}
      loading={isLoading}
      loadingMessage="Loading data..."
      error={error}
      metrics={
        <MetricsFooter
          metrics={[
            { label: 'Load Time', value: 2.5, unit: 's' }
          ]}
        />
      }
    >
      {/* Your system content here */}
    </SystemLayout>
  );
}
```

---

## Available Components

### SystemLayout
Main layout component that enforces the standardized pattern:
**Title → Description → Content → Metrics**

**Props:**
- `title: string` - System title
- `description: React.ReactNode` - Problem description section
- `children: React.ReactNode` - Main content area
- `metrics?: React.ReactNode` - Optional metrics footer (shown only when not loading/error)
- `loading?: boolean` - Loading state
- `loadingMessage?: string` - Custom loading message
- `error?: string | null` - Error message
- `errorTitle?: string` - Custom error title

### MetricsFooter
Standardized metrics display component.

**Props:**
- `metrics: Metric[]` - Array of metrics
- `variant?: 'single' | 'multiple'` - Display variant (auto-detected by default)

**Metric Type:**
```tsx
interface Metric {
  label: string;
  value: string | number;
  unit?: string;
}
```

**Examples:**
```tsx
// Single metric (large display)
<MetricsFooter
  metrics={[
    { label: 'Load Time', value: 2.34, unit: 's' }
  ]}
/>

// Multiple metrics (grid layout)
<MetricsFooter
  metrics={[
    { label: 'Total Time', value: 3.1, unit: 's' },
    { label: 'P50', value: 150, unit: 'ms' },
    { label: 'P95', value: 450, unit: 'ms' },
    { label: 'P99', value: 680, unit: 'ms' }
  ]}
/>
```

### LoadingSpinner
Loading indicator with spinner animation.

**Props:**
- `message?: string` - Loading message (default: "Loading...")

### ErrorDisplay
Error message display component.

**Props:**
- `message: string` - Error message
- `title?: string` - Error title (default: "Error")

### Card
Basic card container component.

**Props:**
- `children: React.ReactNode` - Card content
- `className?: string` - Additional CSS classes

---

## Shared Styles

`shared-styles/base.css` includes:
- CSS reset
- Container and layout styles
- Page title styles
- Button styles
- Dropdown/form styles
- Progress bar styles
- Responsive design utilities

**Note:** System-specific styles should go in the system's own `App.css` file.

---

## Updating Shared Components

When you make improvements to shared components:

1. **Update this directory first** (`shared/frontend/src/`)
2. **Copy to existing systems** that need the update
3. **Test each system** to ensure compatibility
4. **Document breaking changes** if any

---

## File Structure

```
shared/frontend/
├── README.md                 # This file
├── package.json              # Package metadata (for builds)
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── components/
│   │   ├── Card/
│   │   ├── ErrorDisplay/
│   │   ├── LoadingSpinner/
│   │   ├── MetricsFooter/
│   │   └── SystemLayout/
│   ├── styles/
│   │   ├── base.css          # Shared base styles
│   │   └── index.ts
│   └── index.ts              # Main exports
└── dist/                     # Built files (TypeScript output)
```

---

## Example: Refactoring an Existing System

**Before:**
```tsx
<div className="card">
  <h2 className="title">My System</h2>
  <div className="description">...</div>

  {loading && (
    <div className="loadingContainer">
      <div className="loadingSpinner" />
      <p className="loadingText">Loading...</p>
    </div>
  )}

  {error && <div className="error"><p>{error}</p></div>}

  <div>{/* content */}</div>

  <div className="loadTimeFooter">
    <span>Load time: {time}s</span>
  </div>
</div>
```

**After:**
```tsx
<SystemLayout
  title="My System"
  description={<ProblemDescription />}
  loading={loading}
  error={error}
  metrics={
    <MetricsFooter
      metrics={[{ label: 'Load Time', value: time, unit: 's' }]}
    />
  }
>
  {/* content */}
</SystemLayout>
```

---

## Development

```bash
# Build TypeScript (optional, for type checking)
npm run build

# Clean build artifacts
npm run clean
```

---

## References

See working examples in:
- `broken-systems/response-time-optimization/01-content-delivery/frontend/`
- `broken-systems/asynchronous-patterns/01-product-catalog/frontend/`
- `broken-systems/database-performance/01-employee-directory/frontend/`
