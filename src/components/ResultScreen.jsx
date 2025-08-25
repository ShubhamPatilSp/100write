'use client';

import React from 'react';

const ResultScreen = ({ 
  generatedOutline, 
  handleExport, 
  handleCopy, 
  handleHumanizeAll, 
  handlePrevDraft, 
  handleNextDraft, 
  currentDraft, 
  totalDrafts 
}) => {
  if (!generatedOutline) return null;

  return (
    <div>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center flex-wrap gap-3">
          <span className="inline-flex items-center text-sm font-semibold text-gray-800"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Generated Outline</span>
          <label className="inline-flex items-center text-sm text-gray-700 gap-2">
            <input type="checkbox" className="rounded" /> Combined View
          </label>
          <span className="inline-flex items-center text-sm text-gray-700">Total Words : {generatedOutline.reduce((acc, item) => acc + item.words, 0)}</span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <button onClick={handleExport} className="px-3 h-9 flex items-center border rounded-full hover:bg-gray-100 text-gray-800 text-sm font-medium">Export</button>
          <button onClick={handleCopy} className="px-3 h-9 flex items-center border rounded-full hover:bg-gray-100 text-gray-800 text-sm font-medium">Copy</button>
          <button onClick={handleHumanizeAll} className="px-3 h-9 flex items-center border rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm font-medium">Humanize All ++</button>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevDraft} className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 text-gray-800">{'<'}</button>
            <span className="text-gray-800 px-2 text-sm font-medium flex items-center h-9 border rounded-full">Draft {currentDraft}/{totalDrafts}</span>
            <button onClick={handleNextDraft} className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 text-gray-800">{'>'}</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {generatedOutline.map((item, index) => (
          <div key={index} className="p-4 border rounded-xl bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
              <h4 className="font-bold text-md text-gray-800">{item.title} <span className="text-gray-600 font-normal">{item.words} Words</span></h4>
              <div className="flex items-center space-x-2">
                {item.aiDetected ? (
                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">AI Detected</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">No AI Detected</span>
                )}
                <button className="text-orange-500 font-semibold text-sm border border-orange-300 rounded-full px-3 py-1 bg-orange-50 hover:bg-orange-100">Bypass AI ++</button>
              </div>
            </div>
            <p className="text-gray-800 bg-orange-50/60 border border-orange-100 rounded-lg p-3 text-sm">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultScreen;
