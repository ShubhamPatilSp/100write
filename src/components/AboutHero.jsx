import React from 'react';
import Link from 'next/link';

const StatCard = ({ icon, value, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-4xl text-orange-500">{icon}</div>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    <p className="text-gray-600">{label}</p>
  </div>
);

const AboutHero = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-block bg-gray-800 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
        About Us
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
        At 100 Write, we make your writing <br /> hit <span role="img" aria-label="100">💯</span>—every time.
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
        We're driven to push the limits of AI technology—transforming how you write, communicate, and accomplish your work. We believe your productivity should thrive, unhindered by the rise of AI detectors.
      </p>
      <Link href="/dashboard" className="mt-8 inline-block bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors">
        Get Started
      </Link>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <StatCard icon="👥" value="500k+" label="Writer Trust us" />
        <StatCard icon="⭐" value="4.9/5" label="Rated by User" />
        <StatCard icon="🕒" value="900,00+" label="Hours of Time Saved" />
      </div>
    </div>
  );
};

export default AboutHero;
