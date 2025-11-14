import React from 'react';
import './MetricsFooter.css';

export interface Metric {
  label: string;
  value: string | number;
  unit?: string;
}

interface MetricsFooterProps {
  metrics: Metric[];
  variant?: 'single' | 'multiple';
}

export const MetricsFooter: React.FC<MetricsFooterProps> = ({
  metrics,
  variant
}) => {
  // Auto-detect variant if not specified
  const displayVariant = variant || (metrics.length === 1 ? 'single' : 'multiple');

  if (displayVariant === 'single' && metrics.length === 1) {
    const metric = metrics[0];
    const displayValue = typeof metric.value === 'number'
      ? Math.round(metric.value).toString()
      : metric.value;

    return (
      <div className="lb-metrics-footer lb-metrics-single">
        <span className="lb-metric-label">{metric.label}:</span>
        <span className="lb-metric-value">
          {displayValue}{metric.unit || ''}
        </span>
      </div>
    );
  }

  return (
    <div className="lb-metrics-footer lb-metrics-multiple">
      {metrics.map((metric, index) => {
        const displayValue = typeof metric.value === 'number'
          ? Math.round(metric.value).toString()
          : metric.value;

        return (
          <div key={index} className="lb-metric-item">
            <span className="lb-metric-label">{metric.label}</span>
            <span className="lb-metric-value">
              {displayValue}{metric.unit || ''}
            </span>
          </div>
        );
      })}
    </div>
  );
};
