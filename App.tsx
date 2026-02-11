
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Wrench, 
  Search, 
  ArrowLeft,
  LogOut,
  UserCircle,
  X,
  Mail,
  User as UserIcon,
  Lock,
  LogIn,
  UserPlus,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronRight,
  Loader2
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
import ProfileSettings from './components/ProfileSettings';

// Types for Simulated Google Flow
type GoogleStep = 'picker' | 'input-email' | 'input-password' | 'loading';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Sabhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; photo: string } | null>(null);
  
  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleStep, setGoogleStep] = useState<GoogleStep>('picker');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Form States
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [tempGoogleEmail, setTempGoogleEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // PERSISTENCE: Restore session on load
  useEffect(() => {
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

  // Simulated Google Account List (Saved locally)
  const googleAccounts = useMemo(() => {
    const saved = localStorage.getItem('protools_google_list');
    return saved ? JSON.parse(saved) : [
      { name: 'Aditya Raj', email: 'aditya.raj@gmail.com', photo: 'https://ui-avatars.com/api/?name=Aditya+Raj&background=0D47A1&color=fff' }
    ];
  }, [showGooglePicker]);

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('protools_db_users') || '[]');
      if (authMode === 'signup') {
        if (users.find((u: any) => u.email === authForm.email)) {
          setError('Email already exists!');
          setIsLoading(false);
          return;
        }
        const newUser = { 
          ...authForm, 
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(authForm.name)}&background=2563eb&color=fff&bold=true` 
        };
        users.push(newUser);
        localStorage.setItem('protools_db_users', JSON.stringify(users));
        login(newUser);
      } else {
        const found = users.find((u: any) => u.email === authForm.email && u.password === authForm.password);
        if (found) login(found);
        else { setError('Invalid credentials'); setIsLoading(false); }
      }
    }, 1000);
  };

  const startGoogleLogin = () => {
    setShowLoginModal(false);
    setShowGooglePicker(true);
    setGoogleStep('picker');
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (googleStep === 'input-email') setGoogleStep('input-password');
    else if (googleStep === 'input-password') {
      setGoogleStep('loading');
      setTimeout(() => {
        const name = tempGoogleEmail.split('@')[0].toUpperCase();
        const newUser = {
          name,
          email: tempGoogleEmail,
          photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff`
        };
        // Add to Google Picker List for next time
        const list = [...googleAccounts.filter((a: any) => a.email !== newUser.email), newUser];
        localStorage.setItem('protools_google_list', JSON.stringify(list));
        login(newUser);
      }, 1500);
    }
  };

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('protools_user', JSON.stringify(userData));
    setShowLoginModal(false);
    setShowGooglePicker(false);
    setIsLoading(false);
    setTempGoogleEmail('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('protools_user');
    setSelectedToolId(null);
  };

  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      const matchesCategory = activeCategory === 'Sabhi' || tool.category === activeCategory;
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const renderToolContent = () => {
    if (selectedToolId === 'profile') return <ProfileSettings user={user} onUpdateUser={setUser} />;
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
      case 'invoice-generator': return <InvoiceGenerator user={user} onLoginRequest={() => setShowLoginModal(true)} />;
      case 'math-formulas': return <MathFormulas />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedToolId(null)}>
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <Wrench className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black tracking-tighter">ProTools</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!user ? (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all"
              >
                Login / Register
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedToolId('profile')}
                  className="flex items-center gap-2 pl-3 pr-1 py-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-all shadow-sm"
                >
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 leading-none">{user.name}</span>
                    <span className="text-[8px] font-black text-blue-500 uppercase leading-none mt-1 tracking-tighter">Verified</span>
                  </div>
                  <img src={user.photo} className="w-8 h-8 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm" alt="Avatar" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Logout"
                >
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

      {/* Realistic Google Auth Simulation */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-[110] bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Google Logo SVG (Fixed) */}
            <svg viewBox="0 0 24 24" className="w-12 h-12 mb-6" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>

            {googleStep === 'picker' && (
              <div className="w-full text-center">
                <h2 className="text-xl font-bold mb-1">Choose an account</h2>
                <p className="text-sm text-slate-500 mb-8">to continue to ProTools</p>
                <div className="border dark:border-slate-800 rounded-2xl overflow-hidden mb-8 text-left">
                  {googleAccounts.map((acc: any) => (
                    <button key={acc.email} onClick={() => login(acc)} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 border-b last:border-none dark:border-slate-800 transition-all">
                      <img src={acc.photo} className="w-8 h-8 rounded-full" alt="User" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate">{acc.name}</p>
                        <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setGoogleStep('input-email')} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900 text-blue-600 font-bold text-sm">
                    <UserCircle className="w-6 h-6" /> Use another account
                  </button>
                </div>
              </div>
            )}

            {(googleStep === 'input-email' || googleStep === 'input-password') && (
              <div className="w-full text-center">
                <h2 className="text-xl font-bold mb-1">Sign in with Google</h2>
                <p className="text-sm text-slate-500 mb-8">Use your Google Account</p>
                <form onSubmit={handleGoogleSubmit} className="space-y-4 text-left">
                  {googleStep === 'input-email' ? (
                    <div className="space-y-2">
                      <input 
                        required 
                        type="email" 
                        placeholder="Email or phone" 
                        value={tempGoogleEmail} 
                        onChange={e => setTempGoogleEmail(e.target.value)} 
                        className="w-full p-4 border dark:border-slate-700 dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <button type="button" className="text-blue-600 text-xs font-bold hover:underline">Forgot email?</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded-full border dark:border-slate-800 mb-6 mx-auto w-fit">
                        <UserCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold">{tempGoogleEmail}</span>
                      </div>
                      <input 
                        required 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="Enter your password" 
                        className="w-full p-4 border dark:border-slate-700 dark:bg-slate-900 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      />
                      <div className="flex items-center gap-2">
                         <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                         <span className="text-xs text-slate-500">Show password</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-8">
                     <button type="button" onClick={() => setGoogleStep('picker')} className="text-blue-600 text-sm font-bold">Back</button>
                     <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">Next</button>
                  </div>
                </form>
              </div>
            )}

            {googleStep === 'loading' && (
              <div className="text-center py-20">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying with Google...</p>
              </div>
            )}

            <div className="mt-12 text-[11px] text-slate-400 leading-relaxed px-4 text-center">
              To continue, Google will share your name, email address, and profile picture with ProTools. 
              Review <span className="text-blue-500 cursor-pointer">Privacy Policy</span>.
            </div>
            
            {googleStep !== 'loading' && (
              <button onClick={() => setShowGooglePicker(false)} className="mt-8 text-slate-400 hover:text-slate-600 font-bold text-xs">Cancel Login</button>
            )}
          </div>
        </div>
      )}

      {/* Manual Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
                <button onClick={() => setShowLoginModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-8">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>Login</button>
                <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400'}`}>Register</button>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold uppercase">{error}</div>}

              <form onSubmit={handleManualAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required placeholder="Your Name" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type="email" placeholder="Email ID" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input required type={showPassword ? 'text' : 'password'} placeholder="Password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none font-bold text-sm" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'login' ? 'Login' : 'Create Account')}
                </button>
              </form>

              <div className="relative my-8 text-center text-[10px] font-black uppercase text-slate-300">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-slate-800"></div></div>
                <span className="relative bg-white dark:bg-slate-900 px-4">Or Use</span>
              </div>

              <button 
                onClick={startGoogleLogin}
                className="w-full py-4 border dark:border-slate-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google Identity
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedToolId ? (
          <div className="animate-in fade-in duration-500">
            {/* Search Box */}
            <div className="mb-10 relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search Tools (Byaj, PDF, Invoice)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar justify-start sm:justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name as Category)}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeCategory === cat.name ? 'bg-slate-900 text-white shadow-xl' : 'bg-white dark:bg-slate-900 text-slate-400'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group"
                >
                  <div className="mb-6 w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {tool.icon}
                  </div>
                  <h3 className="font-black mb-2 text-sm uppercase tracking-tight">{tool.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed line-clamp-2 uppercase tracking-tighter">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4">
            <button onClick={() => setSelectedToolId(null)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] mb-8 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-sm border dark:border-slate-800">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <div className="max-w-5xl mx-auto">
              {renderToolContent()}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.5em] opacity-50">
        PROTOOLS • SMART SUITE • 2024
      </footer>
    </div>
  );
};

export default App;
