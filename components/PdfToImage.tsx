
import React, { useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Download, FileText, Plus, Trash2, Image as ImageIcon, Loader2, Info } from 'lucide-react';

// Setting up the local worker for PDF processing
pdfjs.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

const PdfToImage: React.FC = () => {
  const [file, setFile] = useState<{ name: string; data: ArrayBuffer } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFile({ name: uploadedFile.name, data: ev.target!.result as ArrayBuffer });
          setPreviewUrls([]);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  };

  const convertToImages = async () => {
    if (!file) return;
    setProcessing(true);
    setPreviewUrls([]);

    try {
      // 100% Client-side rendering
      const loadingTask = pdfjs.getDocument({ data: file.data });
      const pdf = await loadingTask.promise;
      const urls: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); 
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          const url = canvas.toDataURL(outputFormat, 0.9);
          urls.push(url);
        }
      }
      setPreviewUrls(urls);
    } catch (err) {
      console.error(err);
      alert('Local extraction failed.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = () => {
    previewUrls.forEach((url, idx) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `Page-${idx + 1}.${outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`;
      link.click();
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-rose-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1E293B] dark:text-white uppercase tracking-tight">PDF to Image</h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Browser-Based Local Rendering</p>
        </div>
      </div>

      <div className="space-y-6">
        {!file ? (
          <label className="cursor-pointer w-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-rose-100 dark:border-slate-700 rounded-[2.5rem] bg-rose-50/30 dark:bg-slate-800/40 hover:bg-rose-50 transition-all group">
            <Plus className="w-12 h-12 text-rose-500 mb-4 group-hover:scale-110 transition-transform" />
            <span className="font-black text-xs uppercase tracking-widest text-rose-600">Select PDF File</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-4">
                <FileText className="w-10 h-10 text-rose-500" />
                <div>
                  <div className="text-sm font-black text-slate-800 dark:text-white uppercase truncate max-w-[250px]">{file.name}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Offline ready</div>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Export Quality</label>
                <select 
                  value={outputFormat} 
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full p-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl font-black text-xs uppercase outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="image/jpeg">JPG (Standard)</option>
                  <option value="image/png">PNG (High Detail)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={convertToImages} 
                  disabled={processing}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 hover:bg-rose-700 transition-all"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Extract Pages'}
                </button>
              </div>
            </div>
          </div>
        )}

        {previewUrls.length > 0 && (
          <div className="space-y-6 pt-6 border-t dark:border-slate-800">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Found {previewUrls.length} Pages</h3>
              <button onClick={downloadAll} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-600/20">
                <Download className="w-4 h-4" /> Download All
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar p-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg aspect-[3/4] bg-white">
                  <img src={url} className="w-full h-full object-contain p-2" alt={`Page ${idx + 1}`} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all gap-3">
                    <span className="text-white font-black text-[10px] uppercase">Page {idx + 1}</span>
                    <a 
                      href={url} 
                      download={`Page-${idx + 1}.${outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`}
                      className="p-3 bg-white text-rose-600 rounded-xl shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
        <Info className="w-6 h-6 text-blue-500 shrink-0" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
          Cost-Free Operation: This processing is done on your local hardware. No server-side PDF engine is used.
        </p>
      </div>
    </div>
  );
};

export default PdfToImage;
