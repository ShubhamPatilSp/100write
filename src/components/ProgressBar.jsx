'use client';

import React from 'react';

const ProgressBar = ({ value, max, label }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-orange-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && (
        <div className="flex justify-between items-center mt-1.5">
            <p className="text-sm font-semibold text-gray-600">{label}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
