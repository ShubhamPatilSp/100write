'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';

const randomContent = "Fantasy Football is a game played by millions of football fans around the world. It's a game of skill, strategy and luck that's become increasingly popular over the years. In fantasy football, you create a team of real-life NFL players and compete against other teams in your league. Your team earns points based on the performance of your players in real-life NFL games.";

export default function AiHumanizer() {
  const [status, setStatus] = useState('idle'); // idle, loading, result
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [strength, setStrength] = useState('Strong');
  const [inputCharCount, setInputCharCount] = useState(0);
  const [outputCharCount, setOutputCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { subscription, checkUsage, refreshSubscription } = useSubscription();

  useEffect(() => { setInputCharCount(inputText.length); }, [inputText]);
  useEffect(() => { setOutputCharCount(outputText.length); }, [outputText]);

  const handleHumanize = async () => {
    if (!inputText) return;

    const usageCheck = checkUsage('humanizations');
    if (usageCheck.hasReachedLimit) {
      setErrorMessage(`You have reached your monthly limit of ${usageCheck.limit} humanizations. Please upgrade for unlimited access.`);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/ai/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, strength }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to humanize text.');
      }
      const data = await res.json();
      setOutputText(data.output || '');
      setStatus('result');
      refreshSubscription();
    } catch (error) {
      setOutputText('');
      setStatus('idle');
      setErrorMessage(error.message);
    }
  };

  const handleReset = () => { setStatus('idle'); setInputText(''); setOutputText(''); };

  const handleSave = async () => {
    if (!outputText) return;
    setIsSaving(true);
    const lines = outputText.split('\n\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n\n');
    try {
      const res = await fetch('/api/documents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
      if (res.ok) router.push('/dashboard/documents');
    } catch {}
    setIsSaving(false);
  };

  const headerStatus = () => (status === 'loading' ? 'Humanizing text…' : status === 'result' ? 'Try with new text' : 'Waiting for your input…');

  const StrengthSelector = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className='flex items-center'>
        <span className="text-xs text-gray-500 mr-1">Choose Humanization Strength</span>
        <span className="text-gray-400" title="Higher strength makes text more informal">ⓘ</span>
      </div>
      <div className="inline-flex rounded-full overflow-hidden border border-gray-200">
        {['Light', 'Moderate', 'Strong'].map((level) => (
          <button key={level} onClick={() => setStrength(level)} className={`${strength === level ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'} px-3 sm:px-5 py-2 text-xs sm:text-sm`}>{level}</button>
        ))}
      </div>
    </div>
  );

  const renderLeftPanel = () => {
    const isIdle = status === 'idle';
    const isLoading = status === 'loading';

    return (
      <div className="flex flex-col h-full">
        <p className="font-semibold text-gray-800 flex items-center mb-3 font-body"><span className={`mr-2 inline-block w-2 h-2 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-primary'}`}></span>{headerStatus()}</p>

        <div className="relative border rounded-xl bg-white flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="text-sm text-gray-700 font-medium">Your Content:</div>
            <div className="flex items-center space-x-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-xs border rounded-md px-3 py-1 text-gray-700 bg-white hover:bg-gray-50">Upload File</button>
              <input ref={fileInputRef} type="file" className="hidden" accept=".txt,.md" onChange={(e) => { const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload = ev => setInputText(String(ev.target?.result||'')); r.readAsText(f); }} />
              <button onClick={() => setInputText('')} className="text-xs bg-rose-50 text-rose-600 border border-rose-200 rounded-md px-2 py-1">🗑</button>
            </div>
          </div>

          <div className="px-4">
            <p className="text-[11px] text-gray-400 mt-2">Paste or write text here</p>
            <div className="mt-2">{isIdle && (<button onClick={() => setInputText(randomContent)} className="text-[11px] border rounded px-2 py-1 text-gray-600 hover:bg-gray-50">Try with random ChatGPT content</button>)}</div>
          </div>

          <div className="relative mt-2 flex-grow">
            <textarea className="w-full h-full min-h-[300px] md:min-h-[460px] p-4 border-t border-gray-200 rounded-b-xl resize-none focus:outline-none focus:ring-0" value={inputText} onChange={(e) => setInputText(e.target.value)} readOnly={isLoading} maxLength={5000} />
          </div>
          {errorMessage && (
            <div className="px-4 py-2 text-sm text-red-700 bg-red-50 border-t border-red-200 flex items-center justify-between">
              <span>{errorMessage}</span>
              {errorMessage.includes('upgrade your plan') && (
                <Link href="/pricing" className="font-bold underline ml-2 whitespace-nowrap px-3 py-1 rounded-md border border-red-300 hover:bg-red-100">
                  Upgrade Plan
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3"><p className="text-xs text-gray-500 font-body">{inputCharCount}/5000 Characters</p><div className="flex items-center flex-wrap justify-end gap-2"><Link href="/dashboard/ai-detector" className="px-4 py-2 rounded-full border text-sm font-semibold text-gray-700 hover:bg-gray-50 font-body">Detect AI Content</Link><button onClick={status === 'result' ? handleReset : handleHumanize} disabled={isLoading || !inputText} className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:bg-gray-400 font-body">{status === 'result' ? 'Humanize Text ++' : 'Humanize Text ++'}</button></div></div>
        </div>
      </div>
    );
  };

  const HumanizerSkeleton = () => (
    <div className="flex flex-col h-full rounded-xl border overflow-hidden bg-white animate-pulse">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="h-5 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="flex items-center space-x-2">
          <div className="h-9 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-9 w-32 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const renderRightPanel = () => {
    if (status === 'loading') {
      return <HumanizerSkeleton />;
    }

    if (status === 'idle') {
      return (
        <div className="h-full rounded-xl border bg-gradient-to-b from-orange-50 to-white flex items-center justify-center"><div className="text-center text-gray-500 px-4"><div className="text-2xl mb-2">✻</div><p>Your humanised text will be displayed here.</p></div></div>
      );
    }

    const resultTitle = outputText.split('\n\n')[0];
    const resultContent = outputText.split('\n\n').slice(1).join('\n\n');

    return (
      <div className="flex flex-col h-full rounded-xl border overflow-hidden bg-white">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Result</h3>
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          {resultTitle && <h3 className="font-bold text-lg mb-4 text-gray-900">{resultTitle}</h3>}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">
              {resultContent}
            </pre>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white border-t gap-3"><p className="text-xs text-gray-500 font-body">{outputCharCount}/5000 Characters</p><div className="flex items-center space-x-2"><button onClick={() => navigator.clipboard.writeText(outputText)} className="px-4 py-2 rounded-full border text-sm font-semibold text-gray-700 hover:bg-gray-50 font-body">Copy</button><button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover disabled:bg-gray-400 font-body">{isSaving ? 'Saving…' : 'Save Document'}</button></div></div>
      </div>
    );
  };

  return (
    <main className="p-4 md:p-10">
      <header className="mb-6"><h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI Humanizer & Paraphraser Tool</h2></header>
      <div className="relative bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm"><div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-orange-400/60" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>{renderLeftPanel()}</div>
          <div className="flex flex-col h-full">
            <div className="flex justify-end mb-3">
              <StrengthSelector />
            </div>
            <div className="flex-1 relative min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {renderRightPanel()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
