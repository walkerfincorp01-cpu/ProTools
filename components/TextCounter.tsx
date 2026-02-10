
import React, { useState } from 'react';

const TextCounter: React.FC = () => {
  const [text, setText] = useState('');

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
      <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">Text Counter</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
          <div className="text-2xl font-black text-blue-600">{wordCount}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Words</div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center">
          <div className="text-2xl font-black text-emerald-600">{charCount}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Chars</div>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-center">
          <div className="text-2xl font-black text-orange-600">{sentenceCount}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sentences</div>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Apna text yahan type karein..."
        className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
      />
      <button onClick={() => setText('')} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Clear Text</button>
    </div>
  );
};

export default TextCounter;
