
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Wrench, 
  Search, 
  ArrowLeft,
  User,
  LogIn,
  LogOut
} from 'lucide-react';
import { TOOLS, CATEGORIES } from './constants';
import { Category } from './types';
import InterestCalculator from './components/InterestCalculator';
import SipCalculator from './components/SipCalculator';
import EmiCalculator from './components/EmiCalculator';
import PercentageCalculator from './components/PercentageCalculator';
import ImageResizer from './components/ImageResizer';
import PdfMerge from './components/PdfMerge';
import PdfToImage from './components/PdfToImage';
import ImageToPdf from './components/ImageToPdf';
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
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);

  useEffect(() => {
    // Load user session
    const savedUser = localStorage.getItem('protools_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleMockLogin = () => {
    const mockUser = {
      name: 'Google User',
      email: 'user@gmail.com',
      photo: 'https://ui-avatars.com/api/?name=G+U&background=4285F4&color=fff'
    };
    setUser(mockUser);
    localStorage.setItem('protools_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('protools_user');
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = activeCategory === 'Sabhi' || tool.category === activeCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getToolCount = (catName: string) => {
    if (catName === 'Sabhi') return TOOLS.length;
    return TOOLS.filter(t => t.category === catName).length;
  };

  const renderToolContent = () => {
    switch (selectedToolId) {
      case 'interest-calculator': return <InterestCalculator />;
      case 'sip-calculator': return <SipCalculator />;
      case 'emi-calculator': return <EmiCalculator />;
      case 'percentage-calculator': return <PercentageCalculator />;
      case 'image-resizer': return <ImageResizer />;
      case 'pdf-merge': return <PdfMerge />;
      case 'pdf-to-image': return <PdfToImage />;
      case 'image-to-pdf': return <ImageToPdf />;
      case 'text-counter': return <TextCounter />;
      case 'json-formatter': return <JsonFormatter />;
      case 'url-shortener': return <UrlShortener />;
      case 'unit-converter': return <UnitConverter />;
      case 'invoice-generator': return <InvoiceGenerator user={user} onLoginRequest={handleMockLogin} />;
      case 'math-formulas': return <MathFormulas />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedToolId(null)}>
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-blue-900 dark:text-white">ProTools</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!user ? (
              <button 
                onClick={handleMockLogin}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all group"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/gmail_512dp.png" className="w-4 h-4" alt="Google" />
                <span className="group-hover:text-blue-600">Login with Google</span>
              </button>
            ) : (
              <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[9px] font-black text-slate-400 uppercase leading-none">Account</span>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-none mt-1">{user.email}</span>
                </div>
                <img src={user.photo} className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-700" alt="Avatar" />
                <button onClick={handleLogout} className="p-2 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              {isDarkMode ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 py-8 ${selectedToolId === 'invoice-generator' ? 'print:p-0 print:m-0 print:max-w-none' : ''}`}>
        {!selectedToolId ? (
          <>
            <div className="mb-8 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Dhoondein (Byaj, Invoice, PDF)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 outline-none"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar justify-start sm:justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name as Category)}
                  className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase transition-all border-2 whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === cat.name
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-400 border-transparent hover:border-slate-200'
                  }`}
                >
                  {cat.label}
                  <span className="opacity-50 text-[9px]">{getToolCount(cat.name)}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="mb-4">{tool.icon}</div>
                  <h3 className="font-bold mb-1 group-hover:text-blue-600 transition-colors text-sm sm:text-base">{tool.title}</h3>
                  <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{tool.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={() => setSelectedToolId(null)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-bold print:hidden">
              <ArrowLeft className="w-4 h-4" /> Wapas Jayein
            </button>
            <div className="max-w-5xl mx-auto print:max-w-none">
              {renderToolContent()}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest print:hidden">
        DEVELOPMENT BY AR GROUP
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          header, footer, button, .print\\:hidden { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: none !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
