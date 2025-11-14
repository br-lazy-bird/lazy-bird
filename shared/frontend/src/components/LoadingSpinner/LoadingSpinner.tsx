import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="lb-loading-container">
      <div className="lb-loading-spinner" />
      <p className="lb-loading-text">{message}</p>
    </div>
  );
};
