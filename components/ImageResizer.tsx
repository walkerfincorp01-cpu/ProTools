
import React, { useState, useRef } from 'react';
import { Download, Upload, Maximize } from 'lucide-react';

const ImageResizer: React.FC = () => {
  const [img, setImg] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImg(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = img;
    image.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(image, 0, 0, width, height);
      const link = document.createElement('a');
      link.download = 'resized-image.png';
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8">
      <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">Image Resizer</h2>
      <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 dark:bg-slate-900 transition-colors">
        {!img ? (
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <span className="text-slate-500 font-bold">Click to upload image</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        ) : (
          <div className="w-full space-y-6">
            <img src={img} className="max-h-64 mx-auto rounded-lg shadow-md" alt="Preview" />
            <div className="flex justify-center gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Width (px)</label>
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="p-2 border rounded-xl w-32 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Height (px)</label>
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="p-2 border rounded-xl w-32 dark:bg-slate-800" />
              </div>
            </div>
            <div className="flex justify-center gap-4">
               <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20">
                 <Download className="w-4 h-4" /> Download Resized
               </button>
               <button onClick={() => setImg(null)} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 rounded-2xl font-bold">Remove</button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer;
