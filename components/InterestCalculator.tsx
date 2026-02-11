
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Info, IndianRupee, Calendar } from 'lucide-react';

const InterestCalculator: React.FC = () => {
  const [type, setType] = useState<'SI' | 'CI'>('SI');
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [time, setTime] = useState<number>(5);
  const [compounding, setCompounding] = useState<number>(1); // yearly

  const results = useMemo(() => {
    let totalInterest = 0;
    const breakdown = [];
    let runningBalance = principal;

    if (type === 'SI') {
      const yearlyInterest = (principal * rate) / 100;
      totalInterest = yearlyInterest * time;
      
      for (let y = 1; y <= time; y++) {
        breakdown.push({
          year: y,
          opening: principal + (yearlyInterest * (y - 1)),
          interest: yearlyInterest,
          closing: principal + (yearlyInterest * y)
        });
      }
    } else {
      // CI Formula: A = P(1 + r/n)^(nt)
      const amount = principal * Math.pow(1 + (rate / 100) / compounding, compounding * time);
      totalInterest = amount - principal;

      // Yearly breakdown for CI
      let currentPrincipal = principal;
      for (let y = 1; y <= time; y++) {
        const yearEndAmount = principal * Math.pow(1 + (rate / 100) / compounding, compounding * y);
        const yearInterest = yearEndAmount - currentPrincipal;
        breakdown.push({
          year: y,
          opening: currentPrincipal,
          interest: yearInterest,
          closing: yearEndAmount
        });
        currentPrincipal = yearEndAmount;
      }
    }

    return {
      principal,
      totalInterest,
      totalAmount: principal + totalInterest,
      breakdown
    };
  }, [type, principal, rate, time, compounding]);

  const chartData = [
    { name: 'Principal Amount', value: results.principal, color: '#3b82f6' },
    { name: 'Total Interest', value: results.totalInterest, color: '#10b981' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Inputs */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Interest Calculator</h2>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">SI/CI calculations with yearly growth breakdown</p>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border dark:border-slate-700">
              <button
                onClick={() => setType('SI')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === 'SI' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Simple Interest
              </button>
              <button
                onClick={() => setType('CI')}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === 'CI' 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Compound Interest
              </button>
            </div>

            <div className="space-y-6">
              {/* Refined Principal Input */}
              <div className="p-6 bg-blue-50/30 dark:bg-slate-900/40 rounded-3xl border border-blue-100 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Principal Amount</label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue-200 dark:border-slate-700">
                    <span className="text-blue-600 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={principal} 
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                      className="w-32 bg-transparent font-black text-blue-600 outline-none text-right text-lg"
                    />
                  </div>
                </div>
                <input
                  type="range" min="1000" max="10000000" step="1000" value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rate (%)</label>
                    <input 
                      type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))}
                      className="w-10 text-right bg-transparent font-bold text-blue-600 outline-none text-xs"
                    />
                  </div>
                  <input type="range" min="0.1" max="50" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Years</label>
                    <input 
                      type="number" value={time} onChange={(e) => setTime(Math.min(50, Number(e.target.value)))}
                      className="w-10 text-right bg-transparent font-bold text-blue-600 outline-none text-xs"
                    />
                  </div>
                  <input type="range" min="1" max="50" step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              </div>

              {type === 'CI' && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Compounding</label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-3 text-xs font-bold outline-none"
                  >
                    <option value={1}>Yearly</option>
                    <option value={2}>Half-Yearly</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Visualization */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border dark:border-slate-700/50 flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border dark:border-slate-700">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Principal</p>
                <p className="text-lg font-black">₹{results.principal.toLocaleString()}</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-l-4 border-emerald-500">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Interest</p>
                <p className="text-lg font-black text-emerald-600">₹{Math.round(results.totalInterest).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex-grow min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={85} paddingAngle={8} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest">Maturity</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">₹{Math.round(results.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Growth Table (Misrdhan Yearly Breakdown) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-black uppercase tracking-widest">Yearly Growth Breakdown (Misrdhan)</h3>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="py-4 px-2">Year</th>
                <th className="py-4 px-2">Opening Bal.</th>
                <th className="py-4 px-2">Interest Earned</th>
                <th className="py-4 px-2 text-right">Closing (Maturity)</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {results.breakdown.map((row) => (
                <tr key={row.year} className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-2 font-black text-blue-600">{row.year}</td>
                  <td className="py-4 px-2">₹{Math.round(row.opening).toLocaleString()}</td>
                  <td className="py-4 px-2 text-emerald-600">+ ₹{Math.round(row.interest).toLocaleString()}</td>
                  <td className="py-4 px-2 text-right font-black text-slate-900 dark:text-white">₹{Math.round(row.closing).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;
