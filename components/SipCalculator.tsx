
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, IndianRupee, Landmark, ReceiptText, Info, ArrowRight } from 'lucide-react';

const SipCalculator: React.FC = () => {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [time, setTime] = useState(10);

  const results = useMemo(() => {
    const i = rate / 100 / 12;
    const n = time * 12;
    const futureValue = investment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = investment * n;
    const estReturns = futureValue - totalInvested;

    return { totalInvested, estReturns, futureValue };
  }, [investment, rate, time]);

  const data = [
    { name: 'Invested', value: results.totalInvested, color: '#0F172A' },
    { name: 'Returns', value: results.estReturns, color: '#FBBF24' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] text-[150px] font-black text-slate-900 leading-none -mt-8 -mr-8 pointer-events-none select-none">
          SIP
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#FBBF24] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1E293B] dark:text-white leading-none tracking-tight uppercase">SIP Wealth Plan</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Investment Audit Statement</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-[#FFF7ED] dark:bg-slate-800/40 rounded-[2.5rem] border border-[#FFEDD5] dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#9A3412] opacity-70">Monthly Investment</label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-[#FFEDD5] dark:border-slate-700 shadow-sm">
                    <span className="text-[#9A3412] font-black">₹</span>
                    <input 
                      type="number" 
                      value={investment} 
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      className="w-40 bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-right text-xl"
                    />
                  </div>
                </div>
                <input type="range" min="500" max="100000" step="500" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FBBF24]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700">
                  <div className="flex justify-between mb-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Return Rate (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-xs" />
                  </div>
                  <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E293B]" />
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700">
                  <div className="flex justify-between mb-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Duration (Yrs)</label>
                    <input type="number" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-xs" />
                  </div>
                  <input type="range" min="1" max="40" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E293B]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex rounded-3xl overflow-hidden mb-12 shadow-xl shadow-amber-500/10 border border-slate-100 dark:border-slate-800">
              <div className="flex-1 bg-[#FBBF24] p-6 text-white">
                 <p className="text-[9px] font-black uppercase opacity-60 mb-1">Est. Returns</p>
                 <p className="text-3xl font-black uppercase">₹{Math.round(results.estReturns).toLocaleString()}</p>
              </div>
              <div className="w-[140px] bg-[#0F172A] p-6 text-white text-right">
                 <p className="text-[9px] font-black uppercase opacity-60 mb-1">Invested</p>
                 <p className="text-xl font-black uppercase">₹{Math.round(results.totalInvested).toLocaleString()}</p>
              </div>
            </div>

            <div className="w-full flex-grow min-h-[300px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={85} outerRadius={105} paddingAngle={10} dataKey="value">
                    {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-1">Net Wealth</span>
                <span className="text-3xl font-black text-[#1E293B] dark:text-white">₹{Math.round(results.futureValue).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 w-full bg-[#FBBF24] p-8 rounded-[2.5rem] shadow-2xl shadow-amber-500/30 text-white flex justify-between items-center transform scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Wealth Total</span>
                </div>
                <span className="text-4xl font-black">₹{Math.round(results.futureValue).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;
