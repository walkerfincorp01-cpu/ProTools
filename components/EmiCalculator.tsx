
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const EmiCalculator: React.FC = () => {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const results = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loan;

    return { emi, totalInterest, totalPayment };
  }, [loan, rate, tenure]);

  const data = [
    { name: 'Principal', value: loan, color: '#3b82f6' },
    { name: 'Interest', value: results.totalInterest, color: '#f43f5e' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl flex flex-col lg:flex-row gap-10">
      <div className="flex-1 space-y-8">
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">EMI Calculator</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Loan Amount (₹)</label>
            <input type="range" min="100000" max="10000000" step="50000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">₹{loan.toLocaleString()}</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Interest Rate (% p.a)</label>
            <input type="range" min="1" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">{rate}%</div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-2">Tenure (Years)</label>
            <input type="range" min="1" max="30" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="mt-2 text-lg font-bold text-blue-600">{tenure} yrs</div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 flex flex-col items-center">
        <div className="w-full text-center mb-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Monthly EMI</div>
          <div className="text-3xl font-black text-blue-600">₹{Math.round(results.emi).toLocaleString()}</div>
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
        </div>
        <div className="w-full grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Interest</div>
            <div className="text-lg font-bold text-rose-500">₹{Math.round(results.totalInterest).toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</div>
            <div className="text-lg font-bold">₹{Math.round(results.totalPayment).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
