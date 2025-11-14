import React from 'react';
import { Card } from '../Card';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorDisplay } from '../ErrorDisplay';
import './SystemLayout.css';

interface SystemLayoutProps {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  metrics?: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  error?: string | null;
  errorTitle?: string;
}

/**
 * SystemLayout - Enforces the standardized pattern for all Lazy Bird systems:
 * Title → Description → Content → Metrics
 *
 * This component ensures consistency across all educational systems.
 */
export const SystemLayout: React.FC<SystemLayoutProps> = ({
  title,
  description,
  children,
  metrics,
  loading = false,
  loadingMessage,
  error = null,
  errorTitle
}) => {
  return (
    <Card>
      {/* Title Section */}
      <h2 className="lb-system-title">{title}</h2>

      {/* Description Section */}
      <div className="lb-description-section">
        {description}
      </div>

      {/* Content Section */}
      <div className="lb-content-section">
        {loading ? (
          <LoadingSpinner message={loadingMessage} />
        ) : error ? (
          <ErrorDisplay message={error} title={errorTitle} />
        ) : (
          children
        )}
      </div>

      {/* Metrics Section */}
      {metrics && !loading && !error && (
        <div className="lb-metrics-section">
          {metrics}
        </div>
      )}
    </Card>
  );
};
