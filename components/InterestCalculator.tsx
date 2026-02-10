
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Info } from 'lucide-react';

const InterestCalculator: React.FC = () => {
  const [type, setType] = useState<'SI' | 'CI'>('SI');
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(10);
  const [time, setTime] = useState<number>(5);
  const [compounding, setCompounding] = useState<number>(1); // yearly

  const results = useMemo(() => {
    let totalInterest = 0;
    if (type === 'SI') {
      totalInterest = (principal * rate * time) / 100;
    } else {
      // CI Formula: A = P(1 + r/n)^(nt)
      const amount = principal * Math.pow(1 + (rate / 100) / compounding, compounding * time);
      totalInterest = amount - principal;
    }
    const totalAmount = principal + totalInterest;

    return {
      principal,
      totalInterest,
      totalAmount
    };
  }, [type, principal, rate, time, compounding]);

  const chartData = [
    { name: 'Principal Amount', value: results.principal, color: '#3b82f6' },
    { name: 'Total Interest', value: results.totalInterest, color: '#10b981' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Inputs */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interest Calculator (Byaj)</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Calculate returns on your investment or cost of a loan.</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setType('SI')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                type === 'SI' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Simple Interest
            </button>
            <button
              onClick={() => setType('CI')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                type === 'CI' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              Compound Interest
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Principal Amount (₹)</label>
                <input 
                  type="number" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-24 text-right bg-transparent font-bold text-blue-600 outline-none"
                />
              </div>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Rate of Interest (%)</label>
                <input 
                  type="number" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-16 text-right bg-transparent font-bold text-blue-600 outline-none"
                />
              </div>
              <input
                type="range"
                min="0.1"
                max="30"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Time Period (Years)</label>
                <input 
                  type="number" 
                  value={time} 
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-16 text-right bg-transparent font-bold text-blue-600 outline-none"
                />
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {type === 'CI' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Compounding Frequency</label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Results Visual */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">Total Principal</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">₹{results.principal.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-l-4 border-emerald-500">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">Total Interest</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{Math.round(results.totalInterest).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex-grow min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#1e293b',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Amount</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{Math.round(results.totalAmount).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              {type === 'SI' 
                ? "Simple interest is calculated only on the principal amount." 
                : `Compound interest is calculated on the principal and accumulated interest over ${time} years.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;
