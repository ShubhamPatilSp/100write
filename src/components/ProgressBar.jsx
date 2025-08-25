'use client';

import React from 'react';

const ProgressBar = ({ value, max, label }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && <p className="text-sm text-gray-500 mt-2">{label}</p>}
    </div>
  );
};

export default ProgressBar;
