import React from 'react';
import Link from 'next/link';

const PassAiCheckers = () => {
  return (
    <div className="py-16 px-4">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pass AI detection checkers every time</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          Student safety comes first. Our cutting-edge tech makes sure your content feels truly human—passing AI detectors and plagiarism checks with ease.
        </p>
        <Link href="/dashboard" className="mt-8 inline-block bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors">
          Start Now - For Free
        </Link>
      </div>
      <div className="mt-12 max-w-5xl mx-auto p-4 border rounded-lg bg-white shadow-lg">
        <img src="/detection-checkers.png" alt="AI Detection Checkers" className="rounded-lg" />
      </div>
    </div>
  );
};

export default PassAiCheckers;
