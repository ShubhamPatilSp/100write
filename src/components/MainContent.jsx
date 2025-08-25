'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Reveal from './Reveal';

const ToolCard = ({ icon, title, description, href, delay = '' }) => (
  <Reveal className={`reveal reveal-scale ${delay}`}>
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-start">
      <div className="text-2xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-orange-500">{title}</h3>
      <p className="text-gray-600 mt-2 mb-4 flex-1">{description}</p>
      <Link href={href} className="mt-auto border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">Start Using &rarr;</Link>
    </div>
  </Reveal>
);

const MainContent = () => {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (session) {
        try {
          const res = await fetch('/api/documents');
          if (res.ok) {
            const data = await res.json();
            setDocuments(data);
          }
        } catch (error) {
          console.error('Failed to fetch documents:', error);
        }
      }
    };

    fetchDocuments();
  }, [session]);

  return (
    <React.Fragment>
      <header className="mb-10">
        <p className="text-sm text-gray-500"><span>&#x2728;</span> AI Writing Tool</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Hey {session?.user?.name?.split(' ')[0] || 'there'},</h2>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Start using 100 Write AI tools</p>
      </header>

      <Reveal className="reveal">
        <div className="bg-orange-100 border border-orange-200 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6"><span>&#x1F4E0;</span> Your AI Writing Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard icon="&#x1F50E;" title="AI Content Detector" description="Check your text for free with our super accurate detector." href="/dashboard/ai-detector" />
            <ToolCard delay="reveal-delay-1" icon="&#x1F9D1;&#x200D;&#x1F3A8;" title="AI Humanizer & Paraphraser" description="Humanize AI content and bypass detectors like GPTZero." href="/dashboard/ai-humanizer" />
            <ToolCard delay="reveal-delay-2" icon="&#x1F4DD;" title="AI Content Writer" description="Quickly generate your next essay, article, outline, or project in seconds." href="/dashboard/ai-generator" />
          </div>
        </div>
      </Reveal>

      <section className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Recent Documents</h3>
          <Link href="/dashboard/documents" className="text-orange-500 font-semibold">View all &gt;</Link>
        </div>
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, i) => (
              <Reveal key={doc._id} className={`reveal reveal-scale ${i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : ''}`}>
                <Link href={`/dashboard/documents/${doc._id}`} className="block h-full">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 h-full flex flex-col hover:shadow-md transition-shadow duration-200">
                    <h4 className="font-bold text-lg">{doc.title}</h4>
                    <p className="text-gray-600 mt-2 text-sm truncate flex-grow">{doc.content}</p>
                    <p className="text-xs text-gray-400 mt-4">Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="reveal reveal-scale">
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
              <div className="text-5xl text-gray-300">&#x1F4C1;</div>
              <h4 className="mt-4 text-lg font-semibold text-gray-800">No Files Found</h4>
              <p className="text-gray-500 mt-1">Get started by rewriting your first file</p>
            </div>
          </Reveal>
        )}
      </section>
    </React.Fragment>
  );
};

export default MainContent;
