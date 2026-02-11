
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { IndianRupee, Scale, TrendingUp, Info, ReceiptText, Landmark } from 'lucide-react';

const EmiCalculator: React.FC = () => {
  const [loan, setLoan] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [method, setMethod] = useState<'reducing' | 'flat'>('reducing');

  const results = useMemo(() => {
    const r_reducing = rate / 12 / 100;
    const n = tenure * 12;
    const emi_reducing = (loan * r_reducing * Math.pow(1 + r_reducing, n)) / (Math.pow(1 + r_reducing, n) - 1);
    const totalPayment_reducing = emi_reducing * n;
    const totalInterest_reducing = totalPayment_reducing - loan;

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
    { name: 'Principal', value: loan, color: '#0F172A' },
    { name: 'Interest', value: results.totalInterest, color: '#FBBF24' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-[0.03] text-[150px] font-black text-slate-900 leading-none -mt-8 -mr-8 pointer-events-none select-none">
          EMI
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-[#FBBF24] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                <Landmark className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-[#1E293B] dark:text-white leading-none tracking-tight uppercase">Loan Statement</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Repayment Analysis Statement</p>
              </div>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700">
              <button
                onClick={() => setMethod('reducing')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  method === 'reducing' 
                  ? 'bg-[#1E293B] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Reducing Bal.
              </button>
              <button
                onClick={() => setMethod('flat')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  method === 'flat' 
                  ? 'bg-[#1E293B] text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Flat Interest
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-[#FFF7ED] dark:bg-slate-800/40 rounded-[2.5rem] border border-[#FFEDD5] dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#9A3412] opacity-70">Total Loan Principal</label>
                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-[#FFEDD5] dark:border-slate-700 shadow-sm">
                    <span className="text-[#9A3412] font-black">₹</span>
                    <input 
                      type="number" 
                      value={loan} 
                      onChange={(e) => setLoan(Number(e.target.value))}
                      className="w-40 bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-right text-xl"
                    />
                  </div>
                </div>
                <input type="range" min="100000" max="10000000" step="50000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FBBF24]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700">
                  <div className="flex justify-between mb-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Interest Rate (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-xs" />
                  </div>
                  <input type="range" min="1" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E293B]" />
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border dark:border-slate-700">
                  <div className="flex justify-between mb-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tenure (Years)</label>
                    <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-12 text-right bg-transparent font-black text-[#1E293B] dark:text-white outline-none text-xs" />
                  </div>
                  <input type="range" min="1" max="40" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E293B]" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="w-full flex rounded-3xl overflow-hidden mb-12 shadow-xl shadow-amber-500/10 border border-slate-100 dark:border-slate-800">
              <div className="flex-1 bg-[#FBBF24] p-6 text-white">
                 <p className="text-[9px] font-black uppercase opacity-60 mb-1">Total Interest</p>
                 <p className="text-3xl font-black uppercase">₹{Math.round(results.totalInterest).toLocaleString()}</p>
              </div>
              <div className="w-[140px] bg-[#0F172A] p-6 text-white text-right">
                 <p className="text-[9px] font-black uppercase opacity-60 mb-1">Net Payable</p>
                 <p className="text-xl font-black uppercase">₹{Math.round(results.totalPayment).toLocaleString()}</p>
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
                <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-1">Monthly EMI</span>
                <span className="text-3xl font-black text-[#1E293B] dark:text-white">₹{Math.round(results.emi).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 w-full bg-[#FBBF24] p-8 rounded-[2.5rem] shadow-2xl shadow-amber-500/30 text-white flex justify-between items-center transform scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">Total Due</span>
                </div>
                <span className="text-4xl font-black">₹{Math.round(results.totalPayment).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
