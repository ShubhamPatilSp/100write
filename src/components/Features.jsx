import React from 'react';
import Reveal from './Reveal';

const FeatureCard = ({ featureNumber, title, description, userCount, imageUrl, reverse }) => {
  const flexDirection = reverse ? 'md:flex-row-reverse' : 'md:flex-row';

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm`}>
      <div className={`flex flex-col ${flexDirection} items-center justify-between gap-12`}>
        <div className="max-w-md text-center md:text-left">
          <p className="text-orange-500 font-semibold">FEATURE {featureNumber}</p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">{title}</h3>
          <p className="mt-4 text-gray-600 leading-relaxed">
            {description}
          </p>
          <div className="mt-6">
            <a href="#" className="text-orange-500 font-semibold hover:text-orange-600 border border-orange-500 rounded-md px-5 py-2 inline-block">
              Try Now →
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500 flex items-center justify-center md:justify-start">
            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
            {userCount} Currently using
          </p>
        </div>
        <div className="flex-shrink-0 w-full max-w-lg">
          <img src={imageUrl} alt={title} className="rounded-lg shadow-lg w-full" />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const featuresData = [
    {
      featureNumber: 1,
      title: 'AI Content Detector',
      description: 'Worried your assignment might get flagged as AI? Our AI checker helps you make sure your work passes AI detection with up to 99.8% accuracy. It’s free to check, fast, and super reliable—just what you need before hitting submit.',
      userCount: '8,905+',
      imageUrl: '/input-text.png',
      reverse: false,
    },
    {
      featureNumber: 2,
      title: 'AI Humanizer & Paraphraser',
      description: 'Make your AI writing sound 100% human. Avoid getting flagged by tools like GPTZero or Turnitin—your content will read naturally and pass as fully human-written.',
      userCount: '12,606+',
      imageUrl: '/ai-generation-text.png',
      reverse: true,
    },
    {
      featureNumber: 3,
      title: 'AI Content Writer',
      description: 'Stuck on what to write? Quickly generate your next essay, article, outline, or project in seconds. Get human-like content in any tone—casual, formal, or anything in between—with easy in-text editing built right in.',
      userCount: '3,220+',
      imageUrl: '/aI-generated-topics.png',
      reverse: false,
    },
  ];

  return (
    <div className="bg-[#FFF7F2] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
          <p className="text-orange-500 font-semibold">FEATURES</p>
          <h2 className="mt-2 text-4xl sm:text-5xl font-bold text-gray-900">
            Your <span className="bg-primary-light px-2 py-1 rounded font-body">All-in-One</span> Smart Writing Assistant
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            A powerful set of tools to help you write faster, better, and smarter—so you can spend less time stuck and more time getting things done.
          </p>
          <div className="mt-8">
            <a href="#" className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-hover shadow-md font-body">
              Start Now - For Free
            </a>
          </div>
        </div>
        </Reveal>

        <div className="mt-16 space-y-12">
          {featuresData.map((feature) => (
            <Reveal key={feature.featureNumber}>
              <FeatureCard {...feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
