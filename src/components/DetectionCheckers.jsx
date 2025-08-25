import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const DetectionCheckers = () => {
  const checkers = ['GPTZero', 'Originality.ai', 'Copyleaks', 'Turnitin', 'Scribbr'];

  return (
    <Reveal>
      <div className="bg-[#FFF7F2] py-16 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pass AI detection checkers every time</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Our humanizer gets your text past even the most advanced AI detection tools on the market.
        </p>
        <div className="mt-8">
          <Link href="/dashboard" className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 shadow-md">
            Humanize Text Now
          </Link>
        </div>
        <div className="mt-12">
          {/* Placeholder for the diagram */}
          <img src="/detection-checkers.png" alt="Diagram showing AI detection checkers being bypassed" className="mx-auto" />
        </div>
        </div>
      </div>
    </Reveal>
  );
};

export default DetectionCheckers;
