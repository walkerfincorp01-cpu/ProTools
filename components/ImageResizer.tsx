
import React, { useState, useRef } from 'react';
import { Download, Upload, Maximize, FileType } from 'lucide-react';

const ImageResizer: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [format, setFormat] = useState('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const image = new Image();
        image.src = ev.target?.result as string;
        image.onload = () => {
          setImg(image.src);
          setWidth(image.width);
          setHeight(image.height);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!img || !canvasRef.current) return;
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = img;
    image.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(image, 0, 0, width, height);
      
      const extension = format.split('/')[1];
      const link = document.createElement('a');
      link.download = `converted-image.${extension}`;
      link.href = canvas.toDataURL(format, 0.9);
      link.click();
      setIsProcessing(false);
    };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white flex items-center gap-3">
          <Maximize className="w-6 h-6 text-orange-500" />
          Image Converter & Resizer
        </h2>
        <p className="text-slate-400 text-sm">Resize karein aur format change karein (JPG, PNG, WebP).</p>
      </div>

      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl bg-slate-50 dark:bg-slate-900 transition-colors">
        {!img ? (
          <label className="cursor-pointer flex flex-col items-center group">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-orange-500" />
            </div>
            <span className="text-slate-500 font-bold">Image Select Karein</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        ) : (
          <div className="w-full space-y-8">
            <div className="relative group max-w-md mx-auto">
              <img src={img} className="max-h-64 mx-auto rounded-2xl shadow-xl border-4 border-white dark:border-slate-800" alt="Preview" />
              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-black text-xs uppercase tracking-widest">Original: {width}x{height}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Width (px)</label>
                <input 
                  type="number" 
                  value={width} 
                  onChange={(e) => setWidth(Number(e.target.value))} 
                  className="w-full p-4 bg-white dark:bg-slate-800 border rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Height (px)</label>
                <input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))} 
                  className="w-full p-4 bg-white dark:bg-slate-800 border rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Convert To</label>
                <select 
                  value={format} 
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-slate-800 border rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="image/png">PNG Format</option>
                  <option value="image/jpeg">JPG Format</option>
                  <option value="image/webp">WebP Format</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button 
                onClick={handleDownload} 
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
               >
                 <Download className="w-4 h-4" /> {isProcessing ? 'Processing...' : 'Download & Convert'}
               </button>
               <button 
                onClick={() => setImg(null)} 
                className="px-10 py-4 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase hover:bg-red-50 hover:text-red-500 transition-all"
               >
                 Remove
               </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer;
