
import React, { useState } from 'react';
import { Link as LinkIcon, Copy, Check, ArrowRight } from 'lucide-react';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shorten = () => {
    if (!url) return;
    setLoading(true);
    // Simulation
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://pt.link/${id}`);
      setLoading(false);
    }, 800);
  };

  const copy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">URL Shortener</h2>
        <p className="text-slate-400 text-sm">Long URLs ko chhota aur shareable banayein.</p>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Apna lamba URL yahan paste karein..."
            className="w-full p-5 bg-slate-50 dark:bg-slate-900 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 pr-32 transition-all"
          />
          <button
            onClick={shorten}
            disabled={loading || !url}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Shorten'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {shortUrl && (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 flex items-center justify-between animate-in zoom-in-95">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Success! Chhota URL:</div>
              <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{shortUrl}</div>
            </div>
            <button onClick={copy} className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-emerald-600 hover:scale-110 transition-transform">
              {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
