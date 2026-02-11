
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndianRupee, Scale, TrendingUp, Info } from 'lucide-react';

const EmiCalculator: React.FC = () => {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');

  const results = useMemo(() => {
    // Standard Reducing Method (Amortized)
    const r_reducing = rate / 12 / 100;
    const n = tenure * 12;
    const emi_reducing = (loan * r_reducing * Math.pow(1 + r_reducing, n)) / (Math.pow(1 + r_reducing, n) - 1);
    const totalPayment_reducing = emi_reducing * n;
    const totalInterest_reducing = totalPayment_reducing - loan;

    // Flat Rate Method
    const totalInterest_flat = (loan * (rate / 100) * tenure);
    const totalPayment_flat = loan + totalInterest_flat;
    const emi_flat = totalPayment_flat / n;

    const currentEmi = method === 'reducing' ? emi_reducing : emi_flat;
    const currentInterest = method === 'reducing' ? totalInterest_reducing : totalInterest_flat;
    const currentTotal = method === 'reducing' ? totalPayment_reducing : totalPayment_flat;

    return { 
      emi: currentEmi, 
      totalInterest: currentInterest, 
      totalPayment: currentTotal,
      diff: totalPayment_flat - totalPayment_reducing,
      flatEmi: emi_flat,
      reducingEmi: emi_reducing
    };
  }, [loan, rate, tenure, method]);

  const data = [
    { name: 'Principal', value: loan, color: '#3b82f6' },
    { name: 'Interest', value: results.totalInterest, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-6 sm:p-10 border border-slate-100 dark:border-slate-700 shadow-xl flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white uppercase tracking-tight">EMI Calculator</h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Reducing vs Flat Rate Analysis</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border dark:border-slate-700">
            <button
              onClick={() => setMethod('reducing')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                method === 'reducing' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Reducing Bal.
            </button>
            <button
              onClick={() => setMethod('flat')}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                method === 'flat' 
                ? 'bg-white dark:bg-slate-800 text-rose-600 shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Flat Interest
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="p-8 bg-blue-50/30 dark:bg-slate-900/40 rounded-[2.5rem] border border-blue-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Loan</label>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-blue-100 dark:border-slate-700">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <input 
                    type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))}
                    className="w-32 bg-transparent text-xl font-black text-blue-600 outline-none text-right"
                  />
                </div>
              </div>
              <input type="range" min="100000" max="10000000" step="50000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border dark:border-slate-800">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rate (%)</label>
                <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-transparent font-black text-blue-600 outline-none mb-2" />
                <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border dark:border-slate-800">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Tenure (Yrs)</label>
                <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full bg-transparent font-black text-blue-600 outline-none mb-2" />
                <input type="range" min="1" max="40" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] p-8 flex flex-col items-center">
          <div className="w-full text-center mb-8">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2">Monthly EMI ({method})</div>
            <div className={`text-5xl font-black ${method === 'reducing' ? 'text-blue-600' : 'text-rose-600'}`}>₹{Math.round(results.emi).toLocaleString()}</div>
          </div>
          
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={85} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border dark:border-slate-700">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Interest</div>
              <div className={`text-lg font-black ${method === 'reducing' ? 'text-blue-600' : 'text-rose-600'}`}>₹{Math.round(results.totalInterest).toLocaleString()}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border dark:border-slate-700">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Payment</div>
              <div className="text-lg font-black text-slate-800 dark:text-white">₹{Math.round(results.totalPayment).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Insights */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <Scale className="w-5 h-5 text-indigo-600" />
             <h3 className="text-sm font-black uppercase tracking-widest">Method Comparison</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-400">Reducing EMI</span>
              <span className="font-black text-blue-600">₹{Math.round(results.reducingEmi).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl">
              <span className="text-[10px] font-black uppercase text-slate-400">Flat Rate EMI</span>
              <span className="font-black text-rose-600">₹{Math.round(results.flatEmi).toLocaleString()}</span>
            </div>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl">
            <p className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase leading-relaxed flex items-center gap-2">
              <TrendingUp className="w-4 h-4 shrink-0" />
              Flat rate is costing ₹{Math.round(results.diff).toLocaleString()} extra in total interest!
            </p>
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-slate-900/40 p-6 rounded-3xl border border-blue-50 dark:border-slate-700 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Financial Tip</span>
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">
            "Reducing Balance" (Ghat-ta Byaj) is the method used by Banks. Interest is only charged on the outstanding loan amount.
            "Flat Rate" is often used to make a loan look cheaper than it actually is. Always compare the Effective Rate!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
