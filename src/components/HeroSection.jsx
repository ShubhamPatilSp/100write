import React from 'react';
import Link from 'next/link';
import Reveal from './Reveal';

const HeroSection = () => {
  return (
    <div className="bg-[#FFF7F2] text-center py-20 px-4 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight font-heading">
          Humanize AI Text & <br /> Outsmart AI Detectors
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 font-body">
          Bypass AI detection, humanize papers and transform essays in seconds, all while avoiding detectors like Turnitin and GPTZero.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-8 flex justify-center items-center space-x-2">
          <div className="flex -space-x-2">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?img=1" alt="User 1"/>
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?img=2" alt="User 2"/>
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://i.pravatar.cc/150?img=3" alt="User 3"/>
          </div>
          <div className="flex flex-col items-start">
              <div className="flex text-yellow-400">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <p className="text-sm text-gray-500">Trusted by 5.4 million+ writers</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mt-8">
          <Link href="/dashboard" className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-hover shadow-lg transition-transform duration-200 hover:scale-[1.02] font-body">
            Start Now - For Free →
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.4}>
        <div className="mt-12">
          <p className="text-sm text-gray-500">Bypass Popular AI Content detectors your professor uses</p>
          <div className="mt-4 flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
            <span>✓ GPTZero</span>
            <span>✓ OpenAI</span>
            <span>✓ Quillbot</span>
            <span>✓ Copelaks</span>
            <span>✓ Turnitin</span>
            <span>✓ Grammarly</span>
            <span>✓ ZeroGPT</span>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.5}>
        <p className="mt-12 text-sm text-gray-500">Trusted by 3,000+ Universities and businesses across the world</p>
      </Reveal>
    </div>
  );
};

export default HeroSection;
