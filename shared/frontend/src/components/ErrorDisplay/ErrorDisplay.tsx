import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  message: string;
  title?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  title = 'Error'
}) => {
  return (
    <div className="lb-error">
      {title && <p className="lb-error-title">{title}</p>}
      <p className="lb-error-message">{message}</p>
    </div>
  );
};
