
import React, { useState, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { Download, FileText, Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';

// Configure pdfjs worker
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
      const loadingTask = pdfjs.getDocument({ data: file.data });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const urls: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for quality
        
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
      alert('Error converting PDF. Ensure it is not password protected.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadAll = () => {
    previewUrls.forEach((url, idx) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `page-${idx + 1}.${outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`;
      link.click();
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-rose-600" />
          PDF to JPG Converter
        </h2>
        <p className="text-slate-400 text-sm">PDF ke har page ko high-quality images mein convert karein.</p>
      </div>

      <div className="space-y-6">
        {!file ? (
          <label className="cursor-pointer w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-rose-100 dark:border-slate-700 rounded-3xl bg-rose-50/30 dark:bg-slate-900/40 hover:bg-rose-50 transition-colors">
            <Plus className="w-12 h-12 text-rose-500 mb-3" />
            <span className="font-bold text-rose-600">Select PDF Document</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-rose-500" />
                <div>
                  <div className="text-sm font-black text-slate-800 dark:text-white">{file.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Conversion</div>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1">Output Format</label>
                <select 
                  value={outputFormat} 
                  onChange={(e) => setOutputFormat(e.target.value as any)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl font-bold text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="image/jpeg">JPG (Small File)</option>
                  <option value="image/png">PNG (High Quality)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={convertToImages} 
                  disabled={processing}
                  className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Conversion'}
                </button>
              </div>
            </div>
          </div>
        )}

        {previewUrls.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Generated Images ({previewUrls.length})</h3>
              <button onClick={downloadAll} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase">
                <Download className="w-4 h-4" /> Download All
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto custom-scrollbar p-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 aspect-[3/4] bg-white">
                  <img src={url} className="w-full h-full object-contain p-2" alt={`Page ${idx + 1}`} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                    <span className="text-white font-black text-[10px] uppercase">Page {idx + 1}</span>
                    <a 
                      href={url} 
                      download={`page-${idx + 1}.${outputFormat === 'image/jpeg' ? 'jpg' : 'png'}`}
                      className="p-2 bg-white text-rose-600 rounded-lg shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfToImage;
