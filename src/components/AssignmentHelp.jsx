import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const AssignmentHelp = () => {
  return (
    <Reveal>
      <div className="bg-gray-800 text-white rounded-2xl py-12 px-8 sm:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-lg text-center md:text-left">
            <div className="text-orange-500 font-bold text-2xl mb-2">//</div>
            <h2 className="text-4xl font-bold leading-tight">Used ChatGPT to write your assignment?</h2>
            <p className="mt-4 text-gray-300">
              Your professor might catch it—unless you humanize it first. Use our tool to make it sound real and pass AI checks. Get full marks without stress.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <Link href="/dashboard" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover w-full sm:w-auto font-body">
                Start Now - For Free →
              </Link>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {/* Avatar images removed as they were missing from the project */}
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                  <span className="text-sm text-gray-400">Trusted by 5.4 million+ writers</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 mt-8 md:mt-0">
            <img src="/assignment-help-diagram.png" alt="Diagram showing AI content being humanized" className="w-full max-w-md" />
          </div>
        </div>
        </div>
      </div>
    </Reveal>
  );
};

export default AssignmentHelp;
