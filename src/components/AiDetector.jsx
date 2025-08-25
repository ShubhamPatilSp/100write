'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';

// Mock data for random content
const randomContent = "Fantasy Football is a game played by millions of football fans around the world. It's a game of skill, strategy and luck that's become increasingly popular over the years. In fantasy football, you create a team of real-life NFL players and compete against other teams in your league. Your team earns points based on the performance of your players in real-life NFL games.";

const AiDetector = () => {
  const [status, setStatus] = useState('idle'); // idle, loading, result
  const [text, setText] = useState('');
  const [resultScore, setResultScore] = useState(0);
  const [thirdPartyScores, setThirdPartyScores] = useState([]);
  const [keyFindings, setKeyFindings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isLoading = status === 'loading';
  const { subscription, checkUsage, refreshSubscription } = useSubscription();

  const prevTextRef = useRef(text);

  useEffect(() => {
    setCharCount(text.length);
    // Reset status to idle if user types after a result is shown
    if (status === 'result' && text !== prevTextRef.current) {
      setStatus('idle');
    }
    prevTextRef.current = text;
  }, [text, status]);

  useEffect(() => {
    if (status === 'idle' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [status]);

  const handleDetect = useCallback(async () => {
    const trimmedText = text.trim();
    const usageCheck = checkUsage('detections');
    if (usageCheck.hasReachedLimit) {
      setErrorMessage(`You have reached your monthly limit of ${usageCheck.limit} AI detections. Please upgrade for unlimited access.`);
      return;
    }

    if (!trimmedText) {
      alert('Please enter some text to analyze');
      return;
    }
    setStatus('loading');
    try {
      setErrorMessage('');
      const res = await fetch('/api/ai/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmedText }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        let errorMessage = `API request failed with status ${res.status}`;
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json().catch(async (e) => {
        // If JSON parsing fails, try to get raw text for debugging
        const raw = await res.text().catch(() => '');
        throw new Error(`Invalid JSON from API: ${e.message}. Raw response: ${raw}`);
      });

      // Defensive normalization of the response
      const score = typeof data.score === 'number' ? data.score : Number(data.score) || 0;
      const third = Array.isArray(data.thirdParty) ? data.thirdParty : (Array.isArray(data.thirdParty ?? data.third) ? (data.thirdParty ?? data.third) : []);
      const findings = Array.isArray(data.keyFindings) ? data.keyFindings : [];

      setResultScore(score);
      setThirdPartyScores(third);
      setKeyFindings(findings);
      setStatus('result');
      refreshSubscription(); // Refresh subscription to get updated usage
    } catch (error) {
      console.error('Detection error:', error);
      setErrorMessage(error.message || 'Detection failed — please try again.');
      setStatus('idle');
    }
  }, [text]);

  const handleReset = useCallback(() => {
    setStatus('idle');
    setText('');
    setResultScore(0);
    setThirdPartyScores([]);
    setKeyFindings([]);
  }, []);

  const handleTryRandom = useCallback(() => setText(randomContent), []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(file);
    }
  }, []);

  const headerStatus = () => {
    if (status === 'loading') return 'Scanning text…';
    if (status === 'result') return 'Analysis Complete';
    return 'Waiting for your input…';
  };

  const DetectorSkeleton = () => (
    <div className="mt-8 border rounded-2xl bg-white animate-pulse">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <div className="flex items-center w-full">
          <div className="w-9 h-9 bg-gray-200 rounded-lg mr-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="w-28 h-9 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="px-6 py-8 text-center">
        <div className="h-10 w-24 bg-gray-200 rounded-lg mx-auto"></div>
        <div className="h-3 w-48 bg-gray-200 rounded mx-auto mt-3"></div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg mx-auto mt-4"></div>
  
        <div className="relative w-full max-w-lg mx-auto my-8 flex gap-1">
          <div className="w-1/3 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-1/3 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-1/3 h-8 bg-gray-200 rounded-full"></div>
        </div>
  
        <div className="border rounded-xl p-5 mt-8">
          <div className="h-5 w-40 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ResultCard = () => {
    const getResultDetails = (score) => {
      if (score < 35) return { label: 'HUMAN WRITTEN', colorClass: 'bg-green-600', pillClass: 'bg-green-600', textClass: 'text-green-700', segment: 'low' };
      if (score < 75) return { label: 'Likely AI', colorClass: 'bg-orange-500', pillClass: 'bg-orange-500', textClass: 'text-orange-500', segment: 'medium' };
      return { label: 'AI USED', colorClass: 'bg-red-500', pillClass: 'bg-red-500', textClass: 'text-red-500', segment: 'ai' };
    };

    const details = getResultDetails(resultScore);

    const getThirdPartyIcon = (result) => {
      switch (result.result) {
        case 'human':
          return <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />;
        case 'likely AI':
          return <div className="w-3 h-3 rounded-full bg-orange-500 mr-2" />;
        case 'ai':
          return <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />;
        default:
          return null;
      }
    };

    const Segment = ({ active, children, color }) => (
      <div className={`w-1/3 flex items-center justify-center rounded-full h-8 text-xs font-semibold ${active ? `${color} text-white` : 'bg-gray-200 text-gray-600'}`}>{children}</div>
    );

    return (
      <div className="mt-8 border rounded-2xl bg-white">
        <div className="px-4 sm:px-5 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center text-gray-700">
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center mr-3">📄</div>
            <span className="text-sm font-medium">Make your writing sound More human. Bypass AI detectors with our Humanizer too</span>
          </div>
          <a href="/dashboard/ai-humanizer" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium text-sm font-body w-full sm:w-auto text-center">Humanize Text ✨</a>
        </div>
        <div className="px-4 sm:px-6 py-8 text-center">
          <div className={`text-4xl font-bold ${details.textClass}`}>{resultScore}%</div>
          <p className="text-[11px] uppercase tracking-widest text-gray-500 mt-2">Your text is likely be written by a</p>
          <div className={`inline-block px-6 py-2 mt-3 text-white font-bold rounded-lg ${details.pillClass}`}>{details.label}</div>

          <div className="relative w-full max-w-lg mx-auto my-8 flex gap-1">
            <Segment active={details.segment === 'low'} color="bg-green-600">Low AI</Segment>
            <Segment active={details.segment === 'medium'} color="bg-orange-500">Medium AI</Segment>
            <Segment active={details.segment === 'ai'} color="bg-red-500">AI used</Segment>
          </div>

          <div className="flex items-center justify-center text-gray-500 text-xs mb-8 text-center"><span className="mr-2">ⓘ</span>AI-generated content is evolving fast. These results should support—not replace—human judgement. Use them as one piece of a broader, holistic evaluation.</div>

          <div className="border rounded-xl p-5 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div className="text-sm font-semibold text-gray-800">Third-Party AI Scores</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-1" /><span className="text-gray-600">human</span></div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-1" /><span className="text-gray-600">Likely AI</span></div>
                <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-1" /><span className="text-gray-600">AI</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4">
              {thirdPartyScores.map((item, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  {getThirdPartyIcon(item)}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="p-4 md:p-10">
      <header className="mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">AI content detector tool</h2>
      </header>

      <div className="relative bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-orange-400/60" />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-gray-800 flex items-center">
              <span className={`mr-2 inline-block w-2 h-2 rounded-full ${status === 'loading' ? 'bg-primary animate-pulse' : 'bg-primary'}`}></span>
              {headerStatus()}
            </p>
            <span className="text-orange-500">✻</span>
          </div>

          <div className="relative border rounded-xl bg-white">
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="text-sm text-gray-700 font-medium">Your Content:</div>
              <div className="flex items-center space-x-2">
                <button onClick={() => fileInputRef.current?.click()} className="text-xs border rounded-md px-3 py-1 text-gray-700 bg-white hover:bg-gray-50">Upload File</button>
                <input ref={fileInputRef} type="file" className="hidden" accept=".txt,.md" onChange={handleFileChange} />
                <button onClick={() => setText('')} className="text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-md px-2 py-1">🗑</button>
              </div>
            </div>

            <div className="px-4">
              <p className="text-[11px] text-gray-400 mt-2">Paste or write text here</p>
              <div className="mt-2">
                {status === 'idle' && (
                  <button onClick={handleTryRandom} className="text-[11px] border rounded px-2 py-1 text-gray-600 hover:bg-gray-50">Try with random ChatGPT content</button>
                )}
              </div>
            </div>

            <div className="relative mt-2">
              <textarea
                ref={textareaRef}
                className={`w-full h-[240px] sm:h-[320px] p-4 border-t border-gray-200 rounded-b-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-200 ${
                  isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                }`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleDetect();
                  }
                }}
                readOnly={isLoading}
                maxLength={5000}
                placeholder={isLoading ? 'Analyzing your text...' : 'Paste or type your text here...'}
                aria-label="Text input for AI detection"
                autoFocus
              />
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-xs text-gray-500">{charCount}/5000 Characters</p>
              <button 
                onClick={handleDetect} 
                disabled={!text || isLoading} 
                className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:bg-gray-400 flex items-center space-x-2 font-body"
              >
                <span>Detect AI Content</span>
                <span>→</span>
              </button>
            </div>
            {errorMessage && (
              <div className="px-4 pb-3">
                <div className="text-sm text-rose-600">{errorMessage}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'loading' && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DetectorSkeleton />
          </motion.div>
        )}
        {status === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResultCard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default AiDetector;
