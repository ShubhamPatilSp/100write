import React from 'react';

const OurTeam = () => {
  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-orange-100 text-orange-500 text-sm font-semibold px-3 py-1 rounded-full mb-4">OUR TEAM</div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">We're a passionate team of builders, thinkers, and problem-solvers.</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          We're on a mission to make writing smarter, faster, and more accessible for everyone. We believe in the power of great tools to unlock creativity and productivity—and we're just getting started.
        </p>
        <div className="mt-8 p-8 border-2 border-orange-200 rounded-2xl bg-orange-50">
          <h3 className="text-2xl font-bold text-gray-900">We're hiring!</h3>
          <p className="mt-2 text-gray-600">Want to help us build the future of writing? We're looking for talented people to join our team.</p>
          <a href="#" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors">
            See Open Positions
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
