import React from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullPage = false, message = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div id="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    );
  }

  return (
    <div className="loading-indicator">
      <i className="fas fa-spinner fa-spin fa-3x"></i>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
