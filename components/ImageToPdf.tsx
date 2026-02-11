
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileImage, Download, Trash2, Plus, Loader2, CheckCircle2 } from 'lucide-react';

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<{ id: string; name: string; data: string }[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImages(prev => [
              ...prev, 
              { id: Date.now().toString() + Math.random(), name: file.name, data: ev.target!.result as string }
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    
    // 100% Local processing - No server traffic
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    try {
      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        
        const img = new Image();
        img.src = images[i].data;
        await new Promise((resolve) => { img.onload = resolve; });

        const ratio = img.width / img.height;
        let finalWidth = pageWidth - 20; 
        let finalHeight = finalWidth / ratio;

        if (finalHeight > pageHeight - 20) {
          finalHeight = pageHeight - 20;
          finalWidth = finalHeight * ratio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;

        doc.addImage(images[i].data, 'JPEG', x, y, finalWidth, finalHeight);
      }

      doc.save(`ProTools_PDF_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Local conversion failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-red-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-red-500/20">
          <FileImage className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1E293B] dark:text-white uppercase tracking-tight">JPG to PDF</h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">100% Offline | No Data Leaves Your Device</p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="cursor-pointer w-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-red-100 dark:border-slate-700 rounded-[2.5rem] bg-red-50/30 dark:bg-slate-800/40 hover:bg-red-50 transition-all group">
          <Plus className="w-12 h-12 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <span className="font-black text-xs uppercase tracking-widest text-red-600">Choose Images</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        
        {images.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 custom-scrollbar">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg aspect-square">
                  <img src={img.data} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button 
                      onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                      className="p-3 bg-red-600 text-white rounded-xl transform hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={generatePdf} 
              disabled={processing} 
              className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 hover:bg-red-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              {processing ? 'Processing Locally...' : `Convert ${images.length} Images to PDF`}
            </button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest leading-relaxed">
          Traffic Savings: This tool runs purely in your browser memory. Your internet bandwidth is only used to load this page once.
        </p>
      </div>
    </div>
  );
};

export default ImageToPdf;
