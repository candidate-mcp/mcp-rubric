
import React from 'react';

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
    <p className="text-lg text-slate-300">{message}</p>
  </div>
);

export default LoadingSpinner;
