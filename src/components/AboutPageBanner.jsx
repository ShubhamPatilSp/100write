import React from 'react';
import Link from 'next/link';

const AboutPageBanner = () => {
  return (
    <div className="bg-orange-500 text-white py-12 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Ready to Write Better, Faster?</h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg">
        Try 100Write for free and see how our AI-powered tools can transform your writing process. No credit card required.
      </p>
      <Link href="/dashboard" className="mt-8 inline-block bg-white text-orange-500 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
        Start for Free
      </Link>
    </div>
  );
};

export default AboutPageBanner;
