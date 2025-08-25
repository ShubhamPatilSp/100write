import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const Footer = () => {
  return (
    <Reveal>
      <footer className="relative bg-[#1E1E1E] text-white">
      {/* Top orange CTA card (now contained, no overlap) */}
      <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-16">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl bg-primary text-white rounded-3xl shadow-xl px-6 py-10 md:px-16 md:py-14">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-center">
              AI detection? Not your
              <br className="hidden md:block" /> problem anymore.
            </h2>
            <p className="mt-4 text-center text-base md:text-lg text-orange-50">
              Join <span className="font-bold">500,000+ </span>students and writers using <span className="font-bold">100 Write</span>
              <br className="hidden md:block" /> to write faster and sound more human.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 md:px-7 py-3 md:py-3.5 text-sm md:text-base font-semibold rounded-full text-primary bg-white hover:bg-primary-light transition-colors font-body"
              >
                Try Now – For Free →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dark footer content */}
      <div className="max-w-7xl mx-auto pt-10 pb-14 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Left Section - Brand */}
          <div className="space-y-4">
            <Link href="/dashboard">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-sm">100</span>
                </div>
                <span className="font-normal text-xl text-white">Write</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              We make writing easier for students and writers—simple as that.
            </p>
          </div>

          {/* Middle Section - CTA Button */}
          <div className="flex justify-center md:justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold rounded-full text-white bg-primary hover:bg-primary-hover transition-colors font-body"
            >
              Start Now – For Free →
            </Link>
          </div>

          {/* Right Section - Social Links */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Social Links
            </h3>
            <div className="flex items-center space-x-3">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
                </svg>
              </a>
              <span className="text-gray-500 text-sm">Instagram</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 md:mt-14 border-t border-gray-700" />

        {/* Bottom Copyright */}
        <p className="text-center text-gray-500 text-xs md:text-sm mt-6">
          All rights reserved - 100 Write Limited 2025
        </p>
      </div>
      </footer>
    </Reveal>
  );
};

export default Footer;