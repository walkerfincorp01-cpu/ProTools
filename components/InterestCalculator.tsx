
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calculator, RefreshCcw, Calendar, ArrowRight, IndianRupee, Info } from 'lucide-react';

const InterestCalculator: React.FC = () => {
  const [type, setType] = useState<'SI' | 'CI' | 'DESI'>('SI');
  const [rateType, setRateType] = useState<'yearly' | 'monthly'>('yearly');
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(12);
  const [time, setTime] = useState<number>(1);
  const [compounding, setCompounding] = useState<number>(1);

  // For Desi/Village Interest
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [desiRate, setDesiRate] = useState(2); // ₹2 per month per 100
  const [isDesiCompound, setIsDesiCompound] = useState(false);
  const [desiCompoundingCycle, setDesiCompoundingCycle] = useState(12); // months

  const calculatedData = useMemo(() => {
    let totalInterest = 0;
    let totalAmount = 0;
    let breakdown: any[] = [];
    let durationLabel = "";

    if (type === 'DESI') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (totalDays < 0) totalDays = 0;

      const totalMonths = totalDays / 30.44;
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = totalDays % 30;
      durationLabel = `${years} Saal, ${months} Mahine, ${days} Din`;

      if (!isDesiCompound) {
        totalInterest = (principal * desiRate * totalMonths) / 100;
        totalAmount = principal + totalInterest;
        // Mock breakdown for desi SI
        for (let y = 1; y <= Math.max(1, years); y++) {
          const yInt = (principal * desiRate * Math.min(y * 12, totalMonths)) / 100;
          breakdown.push({ year: y, opening: principal, interest: yInt, closing: principal + yInt });
        }
      } else {
        const fullCycles = Math.floor(totalMonths / desiCompoundingCycle);
        const remainingMonths = totalMonths % desiCompoundingCycle;
        const cycleRate = (desiRate * desiCompoundingCycle) / 100;
        totalAmount = principal * Math.pow(1 + cycleRate, fullCycles);
        const remainingInterest = (totalAmount * desiRate * remainingMonths) / 100;
        totalAmount += remainingInterest;
        totalInterest = totalAmount - principal;
        
        let tempPrincipal = principal;
        for (let c = 1; c <= Math.max(1, fullCycles); c++) {
          const cInt = tempPrincipal * cycleRate;
          breakdown.push({ year: `Cycle ${c}`, opening: tempPrincipal, interest: cInt, closing: tempPrincipal + cInt });
          tempPrincipal += cInt;
        }
      }
    } else {
      const annualRate = rateType === 'monthly' ? rate * 12 : rate;
      durationLabel = `${time} Saal`;
      if (type === 'SI') {
        totalInterest = (principal * annualRate * time) / 100;
        totalAmount = principal + totalInterest;
        const yearlyInterest = totalInterest / time;
        for (let y = 1; y <= time; y++) {
          breakdown.push({ year: y, opening: principal + (yearlyInterest * (y - 1)), interest: yearlyInterest, closing: principal + (yearlyInterest * y) });
        }
      } else {
        totalAmount = principal * Math.pow(1 + (annualRate / 100) / compounding, compounding * time);
        totalInterest = totalAmount - principal;
        let currentPrincipal = principal;
        for (let y = 1; y <= time; y++) {
          const yearEndAmount = principal * Math.pow(1 + (annualRate / 100) / compounding, compounding * y);
          breakdown.push({ year: y, opening: currentPrincipal, interest: yearEndAmount - currentPrincipal, closing: yearEndAmount });
          currentPrincipal = yearEndAmount;
        }
      }
    }

    return { principal, totalInterest, totalAmount, durationLabel, breakdown };
  }, [type, principal, rate, time, compounding, rateType, startDate, endDate, desiRate, isDesiCompound, desiCompoundingCycle]);

  const chartData = [
    { name: 'Mool Dhan', value: calculatedData.principal, color: '#1E293B' },
    { name: 'Kul Byaj', value: calculatedData.totalInterest, color: '#FBBF24' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-16">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.02] text-[180px] font-black text-slate-900 leading-none -mt-10 -mr-10 pointer-events-none select-none uppercase">
          {type}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#FBBF24] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                <Calculator className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1E293B] dark:text-white leading-none tracking-tight uppercase">Interest Hub</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">SI / CI / Desi Village Style</p>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700">
              {(['SI', 'CI', 'DESI'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    type === t ? 'bg-[#1E293B] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t === 'SI' ? 'Simple' : t === 'CI' ? 'Compound' : 'Gaon / Desi'}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-[#F8FAFC] dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-200 dark:border-slate-700">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4 text-center">Mool Dhan (Principal Amount)</label>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-3xl font-black text-slate-300">₹</span>
                  <input 
                    type="number" 
                    value={principal} 
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full max-w-[280px] bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-center text-4xl border-b-4 border-amber-400 focus:border-amber-500 transition-colors"
                  />
                </div>
                <input type="range" min="1000" max="5000000" step="1000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>

              {type === 'DESI' ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Kab Diye (Start Date)</label>
                       <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-xs" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Kab Tak (End Date)</label>
                       <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-xs" />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-blue-50 dark:bg-slate-800/60 rounded-3xl border border-blue-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-[9px] font-black uppercase tracking-widest text-blue-600">Rate (₹ per 100/mo)</label>
                          <span className="text-sm font-black text-blue-600">₹{desiRate}</span>
                        </div>
                        <input type="range" min="0.5" max="10" step="0.25" value={desiRate} onChange={e => setDesiRate(Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      </div>

                      <div className="p-6 bg-purple-50 dark:bg-slate-800/60 rounded-3xl border border-purple-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                          <label className="text-[9px] font-black uppercase tracking-widest text-purple-600">Desi CI (Byaj Par Byaj)</label>
                          <button 
                            onClick={() => setIsDesiCompound(!isDesiCompound)}
                            className={`w-12 h-6 rounded-full transition-all relative ${isDesiCompound ? 'bg-purple-600' : 'bg-slate-300'}`}
                          >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDesiCompound ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                        {isDesiCompound && (
                          <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-purple-100 dark:border-slate-700">
                            <button onClick={() => setDesiCompoundingCycle(6)} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded ${desiCompoundingCycle === 6 ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>6 Months</button>
                            <button onClick={() => setDesiCompoundingCycle(12)} className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded ${desiCompoundingCycle === 12 ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>12 Months</button>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Rate Type</label>
                      <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border dark:border-slate-700">
                        <button onClick={() => setRateType('yearly')} className={`px-3 py-1 text-[8px] font-black uppercase rounded ${rateType === 'yearly' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Saalana</button>
                        <button onClick={() => setRateType('monthly')} className={`px-3 py-1 text-[8px] font-black uppercase rounded ${rateType === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Monthly</button>
                      </div>
                    </div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interest Rate (%)</label>
                      <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-xs outline-none" />
                    </div>
                    <input type="range" min="0.1" max={rateType === 'yearly' ? 50 : 10} step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-[#1E293B]" />
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700">
                    <div className="flex justify-between mb-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tenure (Years)</label>
                      <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-xs outline-none" />
                    </div>
                    <input type="range" min="1" max="30" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-[#1E293B]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            {/* Unified Summary Cards */}
            <div className="w-full space-y-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl">
                    <p className="text-[9px] font-black uppercase opacity-50 mb-1">Mool Dhan (Principal)</p>
                    <p className="text-2xl font-black">₹{calculatedData.principal.toLocaleString()}</p>
                 </div>
                 <div className="bg-amber-500 p-6 rounded-[2rem] text-white shadow-xl shadow-amber-500/10">
                    <p className="text-[9px] font-black uppercase opacity-70 mb-1">Kul Byaj (Interest)</p>
                    <p className="text-2xl font-black">₹{Math.round(calculatedData.totalInterest).toLocaleString()}</p>
                 </div>
              </div>
              <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-600/20 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-[0.2em]">Kul Rashi (Total Amount)</p>
                 <p className="text-4xl font-black">₹{Math.round(calculatedData.totalAmount).toLocaleString()}</p>
                 <p className="text-[9px] font-bold mt-2 opacity-60 uppercase">{calculatedData.durationLabel}</p>
              </div>
            </div>

            <div className="w-full flex-grow min-h-[250px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    formatter={(val: number) => `₹${Math.round(val).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] font-black uppercase text-slate-300 tracking-[0.4em] mb-1">Breakdown</span>
                <span className="text-xl font-black text-[#1E293B] dark:text-white">
                  {Math.round((calculatedData.totalInterest / calculatedData.totalAmount) * 100)}% Byaj
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Summary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-10">
           <div>
             <h3 className="text-xl font-black uppercase tracking-tight text-[#1E293B] dark:text-white">Detailed Report</h3>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Year-wise Growth Statement</p>
           </div>
           <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-slate-400" />
           </div>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="py-4 px-6">Kaal (Year/Cycle)</th>
                <th className="py-4 px-6">Shuruat (Opening)</th>
                <th className="py-4 px-6">Byaj (Interest)</th>
                <th className="py-4 px-6 text-right">Antim (Closing)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {calculatedData.breakdown.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-6 px-6 font-black text-slate-400 text-xs">
                    {typeof row.year === 'number' ? `Saal ${row.year}` : row.year}
                  </td>
                  <td className="py-6 px-6 text-sm font-bold text-slate-600 dark:text-slate-300">
                    ₹{Math.round(row.opening).toLocaleString()}
                  </td>
                  <td className="py-6 px-6 font-black text-amber-500">
                    + ₹{Math.round(row.interest).toLocaleString()}
                  </td>
                  <td className="py-6 px-6 text-right font-black text-[#1E293B] dark:text-white">
                    ₹{Math.round(row.closing).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-amber-500">
             <Info className="w-4 h-4" />
           </div>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
             Disclaimer: Ye calculations mathematical formula pe based hain. Local bazaar mein niyam thode alag ho sakte hain.
           </p>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;
