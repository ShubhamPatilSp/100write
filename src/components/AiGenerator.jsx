'use client';

import React, { useState } from 'react';

const AiGenerator = () => {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [writingPurpose, setWritingPurpose] = useState('Essay');
  const [writingLevel, setWritingLevel] = useState('Middle School');
  const [wordCount, setWordCount] = useState(430);
  const [addThesis, setAddThesis] = useState(false);
  const [thesisDraft, setThesisDraft] = useState('');

  const [aiTopics, setAiTopics] = useState([
    'The impact of online learning on assessment policies',
    'The difference between low carb and low fat diets',
    'How is Google search affecting our intelligence',
    'Should there be laws preventing cyber bullying',
    'How and why have divorce rates changed over time',
  ]);
  const [selectedTopics, setSelectedTopics] = useState([
    { id: 1, text: 'The impact of online learning on assessment policies' },
    { id: 2, text: 'How is Google search affecting our intelligence' },
  ]);

  const [generatedOutline, setGeneratedOutline] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(1);
  const [totalDrafts, setTotalDrafts] = useState(5);

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => 
      prev.find(t => t.text === topic) 
        ? prev.filter(t => t.text !== topic)
        : [...prev, { id: Date.now(), text: topic }]
    );
  };

  const handleRemoveSelected = (id) => {
    setSelectedTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCustomTopic = () => {
    setSelectedTopics(prev => [...prev, { id: Date.now(), text: 'Type Topic Name' }]);
  };

  const handleUpdateCustomTopic = (id, newText) => {
    setSelectedTopics(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleProceedToStep2 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleProceedToStep3 = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          purpose: writingPurpose,
          level: writingLevel,
          words: wordCount,
          topics: selectedTopics.map(t => t.text),
        }),
      });
      const data = await res.json();
      setGeneratedOutline(data.outline || []);
      setStep(3);
    } catch {
      alert('Failed to generate outline');
    }
  };

  const fetchMoreTopics = async () => {
    try {
      const res = await fetch('/api/ai/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (Array.isArray(data.topics)) setAiTopics(data.topics);
    } catch (e) {
      // silent fail; keep previous topics
    }
  };

  const handleExport = () => {
    if (!generatedOutline) {
      alert('No outline to export.');
      return;
    }

    const outlineText = generatedOutline
      .map(item => `${item.title} (${item.words} Words)\n${item.content}`)
      .join('\n\n');

    const blob = new Blob([outlineText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.trim() || 'outline'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (generatedOutline) {
      const outlineText = generatedOutline.map(item => `${item.title} (${item.words} Words)\n${item.content}`).join('\n\n');
      navigator.clipboard.writeText(outlineText)
        .then(() => alert('Outline copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  const handleHumanizeAll = () => {
    alert('Humanize All functionality is not yet implemented.');
  };

  const handlePrevDraft = () => {
    setCurrentDraft(prev => Math.max(1, prev - 1));
  };

  const handleNextDraft = () => {
    setCurrentDraft(prev => Math.min(totalDrafts, prev + 1));
  };

  const promptWordCount = prompt.split(/\s+/).filter(Boolean).length;

  const StepHeader = () => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <div className="bg-white border rounded-lg flex items-center px-3 h-10 w-full max-w-md">
          <span className="text-gray-400 mr-2">⬜</span>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Untitled File Name"
            className="w-full bg-transparent focus:outline-none text-gray-800"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3 text-sm text-gray-700">
        <span className="inline-flex items-center"><span className={`w-2 h-2 rounded-full mr-2 ${step >= 1 ? 'bg-orange-500' : 'bg-gray-300'}`}></span>Step 1</span>
        <span className="inline-flex items-center"><span className={`w-2 h-2 rounded-full mr-2 ${step >= 2 ? 'bg-orange-500' : 'bg-gray-300'}`}></span>Step 2</span>
        <span className="inline-flex items-center"><span className={`w-2 h-2 rounded-full mr-2 ${step >= 3 ? 'bg-orange-500' : 'bg-gray-300'}`}></span>Step 3</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleProceedToStep2}>
      <div className="space-y-6">
        <div>
          <label className="block font-semibold text-gray-800 mb-2">Please Briefly describe your prompt:</label>
          <div className="border rounded-xl p-4 bg-gray-50 text-gray-700">
            <p className="font-semibold mb-2">Objective:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Write a research paper about how lifestyle choices affect the health of people as they grow up</li>
              <li>Please mention multiple types of choices, such as good/bad habits, the effect of different relationships, where someone chooses to live, the type of career they choose, and more.</li>
              <li>Please write a 5 paragraph essay for this, including a clear thesis statement at the end of the first paragraph</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold text-gray-800 mb-2">Select your writing purpose</label>
            <select value={writingPurpose} onChange={(e) => setWritingPurpose(e.target.value)} className="w-full h-11 px-3 border rounded-lg bg-white text-gray-900">
              <option>Essay</option>
              <option>Blog Post</option>
              <option>Report</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-2">Select writing level</label>
            <select value={writingLevel} onChange={(e) => setWritingLevel(e.target.value)} className="w-full h-11 px-3 border rounded-lg bg-white text-gray-900">
              <option>High School</option>
              <option>Middle School</option>
              <option>University</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-gray-800 mb-2">Word count</label>
            <input type="number" value={wordCount} onChange={(e) => setWordCount(parseInt(e.target.value || '0'))} className="w-full h-11 px-3 border rounded-lg text-gray-900" />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900 font-body">Thesis Statement</h3>
              <p className="text-sm text-gray-600 font-body">Add a clear, focused thesis statement to guide your essay. If left empty, we'll use your prompt as the main idea.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={addThesis} onChange={() => setAddThesis(!addThesis)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          {addThesis && (
            <div className="space-y-3">
              <label className="block font-semibold text-gray-800">Thesis Statement Draft *</label>
              <textarea 
                value={thesisDraft}
                onChange={(e) => setThesisDraft(e.target.value)}
                className="w-full p-3 border rounded-lg resize-vertical text-gray-900 placeholder-gray-400"
                rows="3"
                placeholder="The lifestyle choices that a person makes..."
              />
              <div className="text-right">
                <button type="button" className="px-4 py-2 rounded-full border border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100">Generate Thesis ++</button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <button type="submit" className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 text-lg">Generate Outline →</button>
        </div>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleProceedToStep3}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 md:p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900 text-lg">Suggested Topics</h3>
          </div>
          <div className="space-y-3">
            {aiTopics.map((topic, index) => (
              <label key={index} className="flex items-center">
                <input 
                  type="checkbox"
                  checked={selectedTopics.some(t => t.text === topic)}
                  onChange={() => handleTopicToggle(topic)}
                  className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span className="ml-3 text-gray-800 cursor-pointer text-sm">{topic}</span>
              </label>
            ))}
          </div>
          <div className="text-center mt-6">
            <button type="button" className="text-orange-600 font-semibold border border-orange-300 rounded-full px-4 py-2 hover:bg-orange-50" onClick={fetchMoreTopics}>Generate More topics ++</button>
          </div>
        </div>
        <div className="border rounded-xl p-4 md:p-6 bg-orange-50 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900 text-lg">Your Selected Topics</h3>
          </div>
          <div className="space-y-3">
            {selectedTopics.map((topic, index) => (
              <div key={topic.id} className="flex items-center bg-white p-3 rounded-lg border">
                <span className="text-gray-500 mr-3">{index + 1}.</span>
                <input 
                  type="text"
                  value={topic.text}
                  onChange={(e) => handleUpdateCustomTopic(topic.id, e.target.value)}
                  className="flex-grow bg-transparent focus:outline-none text-gray-800 text-sm"
                />
                <button type="button" onClick={() => handleRemoveSelected(topic.id)} className="text-gray-400 hover:text-red-500 ml-2">✕</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button type="button" onClick={handleAddCustomTopic} className="text-orange-600 font-semibold border border-orange-300 rounded-full px-4 py-2 hover:bg-orange-50">
              Add Custom Topic +
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <button type="submit" className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 text-lg">Generate Outline →</button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center flex-wrap gap-3">
          <span className="inline-flex items-center text-sm font-semibold text-gray-800"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Generated Outline</span>
          <label className="inline-flex items-center text-sm text-gray-700 gap-2">
            <input type="checkbox" className="rounded" /> Combined View
          </label>
          <span className="inline-flex items-center text-sm text-gray-700">Total Words : {generatedOutline.reduce((acc, item) => acc + item.words, 0)}</span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <button onClick={handleExport} className="px-3 h-9 flex items-center border rounded-full hover:bg-gray-100 text-gray-800 text-sm font-medium">Export</button>
          <button onClick={handleCopy} className="px-3 h-9 flex items-center border rounded-full hover:bg-gray-100 text-gray-800 text-sm font-medium">Copy</button>
          <button onClick={handleHumanizeAll} className="px-3 h-9 flex items-center border rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 text-sm font-medium">Humanize All ++</button>
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevDraft} className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 text-gray-800">{'<'}</button>
            <span className="text-gray-800 px-2 text-sm font-medium flex items-center h-9 border rounded-full">Draft {currentDraft}/{totalDrafts}</span>
            <button onClick={handleNextDraft} className="w-9 h-9 flex items-center justify-center border rounded-full hover:bg-gray-100 text-gray-800">{'>'}</button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {generatedOutline.map((item, index) => (
          <div key={index} className="p-4 border rounded-xl bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
              <h4 className="font-bold text-md text-gray-800">{item.title} <span className="text-gray-600 font-normal">{item.words} Words</span></h4>
              <div className="flex items-center space-x-2">
                {item.aiDetected ? (
                  <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">AI Detected</span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">No AI Detected</span>
                )}
                <button className="text-orange-500 font-semibold text-sm border border-orange-300 rounded-full px-3 py-1 bg-orange-50 hover:bg-orange-100">Bypass AI ++</button>
              </div>
            </div>
            <p className="text-gray-800 bg-orange-50/60 border border-orange-100 rounded-lg p-3 text-sm">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="p-4 md:p-10">
      <header className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">AI Essay Writer & Generator</h2>
      </header>
      <div className="relative bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-orange-400/60" />

        <div className="relative">
          <StepHeader />
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && generatedOutline && renderStep3()}
        </div>
      </div>
    </main>
  );
};

export default AiGenerator;
