
import React, { useState } from 'react';

const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(100);

  const res1 = (val1 / 100) * val2;

  const [a, setA] = useState(25);
  const [b, setB] = useState(100);
  const res2 = (a / b) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-12">
      <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">Percentage Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-600 mb-4">What is X% of Y?</h3>
          <div className="flex items-center gap-3">
            <input type="number" value={val1} onChange={(e) => setVal1(Number(e.target.value))} className="w-20 p-2 border rounded-xl dark:bg-slate-900" />
            <span>% of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(Number(e.target.value))} className="w-24 p-2 border rounded-xl dark:bg-slate-900" />
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl font-bold text-blue-600">Result: {res1}</div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-600 mb-4">X is what % of Y?</h3>
          <div className="flex items-center gap-3">
            <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-20 p-2 border rounded-xl dark:bg-slate-900" />
            <span>is what % of</span>
            <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-24 p-2 border rounded-xl dark:bg-slate-900" />
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl font-bold text-emerald-600">Result: {res2.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;
