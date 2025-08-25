import React from 'react';
import Reveal from './Reveal';

const TrustSection = () => {
  const logos = [
    { src: '/georgia-tech-color.png.png', alt: 'Georgia Institute of Technology' },
    { src: '/syracuse-color.png.png', alt: 'Syracuse University' },
    { src: '/georgia-tech-color.png (1).png', alt: 'Georgia Institute of Technology' },
    { src: '/ucla-color.png.png', alt: 'UCLA' },
    { src: '/texas-austin-color.png.png', alt: 'The University of Texas at Austin' },
  ];

  return (
    <Reveal>
      <div className="bg-[#FFF7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Trusted by 3,000+ Universities and businesses across the world</p>
        </div>
        <div className="mt-8">
          <div className="flex flex-nowrap justify-center items-center gap-x-8 md:gap-x-12 overflow-hidden py-4">
            {logos.map((logo, index) => (
              <img key={index} className="h-10 md:h-12 object-contain flex-shrink-0" src={encodeURI(logo.src)} alt={logo.alt} />
            ))}
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-8 flex justify-center items-center space-x-6">
          {/* Trustpilot Review */}
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <img className="h-8 w-8" src="/star.png" alt="Trustpilot" />
            </div>
            <div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
                <span className="font-bold text-sm">4.6</span>
                <span className="text-sm text-gray-500">156</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Rating by Trustpilot</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-l border-gray-300 h-12"></div>

          {/* Google Review */}
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-3 rounded-lg">
              <img className="h-8 w-8" src="/goggle.png" alt="Google" />
            </div>
            <div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-2 py-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.25 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
                <span className="font-bold text-sm">4.8</span>
                <span className="text-sm text-gray-500">591</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">on Google Review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Reveal>
  );
};

export default TrustSection;
