import React from 'react';

const SmartWritingAssistant = () => {
  const features = [
    {
      badge: 'FEATURE 1',
      title: 'AI Content Detector',
      description: 'Worried your assistant might get flagged as AI? Our AI content detector helps you check your work before you submit. It\'s free to check, fast, and super reliable—just what you need before hitting submit.',
      link: '#',
      userCount: '8,926+ Currently using',
      image: '/ai-generation-text.png'
    },
    {
      badge: 'FEATURE 2',
      title: 'AI Humanizer & Paraphraser',
      description: 'Make your AI writing sound 100% human. Avoid getting flagged by tools like GPTZero or Turnitin—your content will read naturally and pass as fully human-written.',
      link: '#',
      userCount: '12,006+ Currently using',
      image: '/assignment-help-diagram.png'
    },
    {
      badge: 'FEATURE 3',
      title: 'AI Content Writer',
      description: 'Stuck on what to write? Quickly generate your next essay, article, outline, or project in seconds. Get human-like content in any tone—casual, formal, or anything in between—with easy in-text editing built right in.',
      link: '#',
      userCount: '3,220+ Currently using',
      image: '/aI-generated-topics.png'
    },
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="text-center">
        <div className="inline-block bg-orange-100 text-orange-500 text-sm font-semibold px-3 py-1 rounded-full mb-4">FEATURES</div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your <span className="text-orange-500">All-in-One</span> Smart Writing Assistant</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
          A powerful set of tools to help you write faster, better, and smarter—so you can spend less time stuck and more time getting things done.
        </p>
        <button className="mt-8 bg-orange-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors">
          Start Now - For Free
        </button>
      </div>
      <div className="mt-16 space-y-16 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
            <div className="md:w-1/2">
              <div className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">{feature.badge}</div>
              <h3 className="text-3xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-4 text-gray-600">{feature.description}</p>
              <a href={feature.link} className="mt-6 inline-block text-orange-500 font-semibold border border-orange-500 rounded-lg px-4 py-2 hover:bg-orange-500 hover:text-white transition-colors">
                Try Now →
              </a>
              <p className="mt-4 text-sm text-red-500 font-semibold">{feature.userCount}</p>
            </div>
            <div className="md:w-1/2 p-4 border rounded-lg bg-gray-50">
              <img src={feature.image} alt={feature.title} className="rounded-lg shadow-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartWritingAssistant;
