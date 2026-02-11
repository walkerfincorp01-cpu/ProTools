
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Ruler, Maximize, Info } from 'lucide-react';

type UnitType = 'Length' | 'Area';

const LENGTH_UNITS: Record<string, number> = {
  'Meter (m)': 1,
  'Feet (ft)': 0.3048,
  'Inch (in)': 0.0254,
  'Yard / Gaj (yd)': 0.9144,
  'Kilometer (km)': 1000,
  'Mile (mi)': 1609.344,
  'Centimeter (cm)': 0.01,
  'Karam (5.5 ft)': 1.6764,
};

const AREA_UNITS: Record<string, { factor: number; desc?: string }> = {
  'Square Meter (sq m)': { factor: 1 },
  'Square Feet (sq ft)': { factor: 0.09290304 },
  'Square Yard / Gaj': { factor: 0.83612736 },
  'Acre': { factor: 4046.85642 },
  'Hectare': { factor: 10000 },
  'Bigha (Standard/Pucca)': { factor: 2529.285, desc: '1 Acre = 1.6 Bigha (Standard)' },
  'Bigha (Popular/Raj/MP)': { factor: 1618.74, desc: '1 Acre = 2.5 Bigha (Common Local)' },
  'Bigha (Kucha)': { factor: 843.09, desc: '1 Acre = 4.8 Bigha (Local Small)' },
  'Biswa': { factor: 126.464, desc: '1/20 of Standard Bigha' },
  'Kanal': { factor: 505.857, desc: '8 Kanal = 1 Acre' },
  'Marla': { factor: 25.2928, desc: '20 Marla = 1 Kanal' },
  'Guntha': { factor: 101.1714, desc: '40 Guntha = 1 Acre' },
  'Katha': { factor: 126.464, desc: 'Common in East India' },
};

const UnitConverter: React.FC = () => {
  const [mode, setMode] = useState<UnitType>('Area');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');

  useEffect(() => {
    const keys = mode === 'Length' ? Object.keys(LENGTH_UNITS) : Object.keys(AREA_UNITS);
    setFromUnit(keys[0]);
    setToUnit(keys[mode === 'Area' ? 3 : 1] || keys[0]);
  }, [mode]);

  useEffect(() => {
    convert(fromValue, fromUnit, toUnit);
  }, [fromUnit, toUnit, fromValue]);

  const convert = (value: string, from: string, to: string) => {
    const val = parseFloat(value);
    if (isNaN(val)) {
      setToValue('');
      return;
    }

    let fromFactor = 0;
    let toFactor = 0;

    if (mode === 'Length') {
      fromFactor = LENGTH_UNITS[from];
      toFactor = LENGTH_UNITS[to];
    } else {
      fromFactor = AREA_UNITS[from].factor;
      toFactor = AREA_UNITS[to].factor;
    }

    const fromInBase = val * fromFactor;
    const result = fromInBase / toFactor;
    
    if (result < 0.0001) {
      setToValue(result.toExponential(6));
    } else {
      setToValue(result.toLocaleString(undefined, { maximumFractionDigits: 6 }));
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white flex items-center gap-3 justify-center sm:justify-start">
            <Maximize className="w-6 h-6 text-blue-600" />
            Unit Converter (Land Measurement)
          </h2>
          <p className="text-slate-400 text-sm">Sahi jamin napne ke liye (Bigha, Acre, Gaj, Kanal etc.)</p>
        </div>
        
        <div className="flex bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setMode('Area')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'Area' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Maximize className="w-3.5 h-3.5" />
            Area (Jamin)
          </button>
          <button
            onClick={() => setMode('Length')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              mode === 'Length' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            Length
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative">
        
        {/* From Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Se (From)</label>
          <div className="space-y-2">
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {mode === 'Length' 
                ? Object.keys(LENGTH_UNITS).map(u => <option key={u} value={u}>{u}</option>)
                : Object.keys(AREA_UNITS).map(u => <option key={u} value={u}>{u}</option>)
              }
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0.00"
              className="w-full p-6 bg-white dark:bg-slate-800 border-none rounded-3xl shadow-sm text-3xl font-black text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {mode === 'Area' && AREA_UNITS[fromUnit]?.desc && (
              <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase italic">
                <Info className="w-3 h-3" /> {AREA_UNITS[fromUnit].desc}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center -my-4 md:my-0">
          <button 
            onClick={swapUnits}
            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/20 hover:scale-110 active:scale-95 transition-all z-10 border-4 border-slate-50 dark:border-slate-900"
          >
            <ArrowRightLeft className="w-6 h-6 rotate-90 md:rotate-0" />
          </button>
        </div>

        {/* To Section */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Me (To)</label>
          <div className="space-y-2">
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {mode === 'Length' 
                ? Object.keys(LENGTH_UNITS).map(u => <option key={u} value={u}>{u}</option>)
                : Object.keys(AREA_UNITS).map(u => <option key={u} value={u}>{u}</option>)
              }
            </select>
            <div className="w-full p-6 bg-blue-600 dark:bg-blue-600 rounded-3xl shadow-xl text-3xl font-black text-white overflow-hidden text-ellipsis whitespace-nowrap">
              {toValue || '0'}
            </div>
            {mode === 'Area' && AREA_UNITS[toUnit]?.desc && (
              <div className="flex items-center gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase italic">
                <Info className="w-3 h-3" /> {AREA_UNITS[toUnit].desc}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Common Conversions (1 {fromUnit})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(mode === 'Length' ? Object.keys(LENGTH_UNITS) : Object.keys(AREA_UNITS)).slice(0, 8).map((unit) => {
            if (unit === fromUnit) return null;
            
            let fVal = 0;
            let tVal = 0;

            if (mode === 'Length') {
              fVal = LENGTH_UNITS[fromUnit];
              tVal = LENGTH_UNITS[unit];
            } else {
              fVal = AREA_UNITS[fromUnit].factor;
              tVal = AREA_UNITS[unit].factor;
            }

            const converted = (parseFloat(fromValue) || 0) * (fVal / tVal);

            return (
              <div key={unit} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 truncate">{unit}</div>
                <div className="text-sm font-black text-slate-700 dark:text-slate-200">
                  {converted.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
