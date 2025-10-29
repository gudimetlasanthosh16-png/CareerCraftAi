
import React from 'react';

interface SpinnerProps {
  message: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-accent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300 font-semibold">{message}</p>
    </div>
  );
};

export default Spinner;
