
import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return (
    <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
      {error}
    </div>
  );
};

export default ErrorDisplay;
