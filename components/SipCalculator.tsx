
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
    { name: 'Invested', value: results.totalInvested, color: '#3b82f6' },
    { name: 'Returns', value: results.estReturns, color: '#10b981' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-10">
      <div className="flex-1 space-y-8">
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">SIP Calculator</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Monthly Investment (₹)</label>
            <input type="range" min="500" max="100000" step="500" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">₹{investment.toLocaleString()}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Expected Return Rate (p.a %)</label>
            <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">{rate}%</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Time Period (Years)</label>
            <input type="range" min="1" max="40" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">{time} yrs</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 flex flex-col items-center">
        <div className="w-full grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Invested</div>
            <div className="text-xl font-bold">₹{Math.round(results.totalInvested).toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border-l-4 border-emerald-500">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Returns</div>
            <div className="text-xl font-bold text-emerald-600">₹{Math.round(results.estReturns).toLocaleString()}</div>
          </div>
        </div>
        <div className="h-64 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-400">Total Value</span>
            <span className="text-xl font-black">₹{Math.round(results.futureValue).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;
