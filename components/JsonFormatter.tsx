
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError('Invalid JSON: ' + e.message);
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
      <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">JSON Formatter</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase">Input JSON</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-96 p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={formatJson} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Format JSON</button>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase">Output</label>
            {output && (
              <button onClick={copyToClipboard} className="flex items-center gap-1 text-xs font-bold text-blue-600">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className={`w-full h-96 p-4 bg-slate-900 border rounded-2xl font-mono text-sm text-blue-400 overflow-auto whitespace-pre ${error ? 'border-red-500 text-red-400' : ''}`}>
            {error || output || '// Formatted JSON will appear here'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
