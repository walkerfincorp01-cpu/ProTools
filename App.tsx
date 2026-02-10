
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Wrench, 
  Search, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { TOOLS, CATEGORIES } from './constants';
import { Category, Tool } from './types';
import InterestCalculator from './components/InterestCalculator';
import SipCalculator from './components/SipCalculator';
import EmiCalculator from './components/EmiCalculator';
import PercentageCalculator from './components/PercentageCalculator';
import ImageResizer from './components/ImageResizer';
import PdfMerge from './components/PdfMerge';
import TextCounter from './components/TextCounter';
import JsonFormatter from './components/JsonFormatter';
import UrlShortener from './components/UrlShortener';
import UnitConverter from './components/UnitConverter';
import InvoiceGenerator from './components/InvoiceGenerator';
import MathFormulas from './components/MathFormulas';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Sabhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [isDarkMode]);

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = activeCategory === 'Sabhi' || tool.category === activeCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const renderToolContent = () => {
    switch (selectedToolId) {
      case 'interest-calculator': return <InterestCalculator />;
      case 'sip-calculator': return <SipCalculator />;
      case 'emi-calculator': return <EmiCalculator />;
      case 'percentage-calculator': return <PercentageCalculator />;
      case 'image-resizer': return <ImageResizer />;
      case 'pdf-merge': return <PdfMerge />;
      case 'text-counter': return <TextCounter />;
      case 'json-formatter': return <JsonFormatter />;
      case 'url-shortener': return <UrlShortener />;
      case 'unit-converter': return <UnitConverter />;
      case 'invoice-generator': return <InvoiceGenerator />;
      case 'math-formulas': return <MathFormulas />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Wrench className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Tool Coming Soon</h2>
            <button 
              onClick={() => setSelectedToolId(null)}
              className="mt-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              Go Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-[#F8FAFF]'}`}>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => { setSelectedToolId(null); setActiveCategory('Sabhi'); }}
            >
              <div className="bg-blue-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-black text-[#1E3A8A] dark:text-white tracking-tight leading-none">ProTools</h1>
                <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">Aapke Digital Kaaryon ka Saral Samadhan</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all active:scale-95 border border-slate-100 dark:border-slate-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 print:p-0 print:m-0 print:max-w-none">
        {!selectedToolId ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar custom-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name as Category)}
                  className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                    activeCategory === cat.name
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-2.5 bg-[#F5F8FF] dark:bg-slate-900 rounded-xl">
                        {tool.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        tool.category === 'Financial' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                        tool.category === 'Image' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/30' :
                        tool.category === 'PDF' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30' :
                        'bg-slate-50 text-slate-600 dark:bg-slate-900'
                      }`}>
                        {tool.category}
                      </span>
                    </div>
                    <div className="mb-6 relative z-10">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-[11px] sm:text-[13px] text-slate-400 dark:text-slate-500 leading-relaxed line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedToolId(tool.id)}
                      className="mt-auto w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/10 relative z-10"
                    >
                      Use Tool
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 dark:text-slate-500 text-lg font-medium">Tools nahi mile.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              onClick={() => setSelectedToolId(null)}
              className="group flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-8 font-bold transition-colors print:hidden"
            >
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:bg-blue-50">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Tool se wapas jayein
            </button>
            <div className="max-w-5xl mx-auto print:max-w-none print:m-0">
              {renderToolContent()}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center print:hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
           <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
           <Wrench className="w-4 h-4 text-slate-300" />
           <div className="w-6 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <p className="text-slate-300 dark:text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">
          &copy; {new Date().getFullYear()} PROTOOLS SUITE • BHARAT MEIN NIRMIT
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
          body { background: white !important; }
          header, footer { display: none !important; }
          .print-m-0 { margin: 0 !important; }
          main { padding: 0 !important; }
          #root { background: white !important; }
        }
      `}</style>
      <Analytics />
    </div>
  );
};

export default App;
