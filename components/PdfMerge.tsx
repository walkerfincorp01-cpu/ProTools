
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Files, Download, Trash2, Plus, Loader2, GripVertical, ShieldCheck } from 'lucide-react';

const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<{ id: string; name: string; data: ArrayBuffer }[]>([]);
  const [merging, setMerging] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setFiles(prev => [...prev, { 
              id: Date.now().toString() + Math.random(),
              name: file.name, 
              data: ev.target!.result as ArrayBuffer 
            }]);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setMerging(true);
    
    try {
      // 100% Browser-based merging
      const mergedPdf = await PDFDocument.create();
      for (const f of files) {
        const pdf = await PDFDocument.load(f.data);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Merged_By_ProTools_${Date.now()}.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Merging failed locally.');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
          <Files className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-[#1E293B] dark:text-white uppercase tracking-tight">PDF Merger</h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-1">Combine Locally | Private & Fast</p>
        </div>
      </div>

      <div className="space-y-6">
        <label className="cursor-pointer w-full flex flex-col items-center justify-center p-16 border-2 border-dashed border-blue-100 dark:border-slate-700 rounded-[2.5rem] bg-blue-50/30 dark:bg-slate-800/40 hover:bg-blue-50 transition-all group">
          <Plus className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
          <span className="font-black text-xs uppercase tracking-widest text-blue-600">Add PDF Files</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleUpload} />
        </label>
        
        {files.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-3">
              {files.map((f, i) => (
                <div key={f.id} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700 hover:border-blue-300 transition-all group">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-4 h-4 text-slate-300" />
                    <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center text-red-500 font-black text-[10px]">PDF</div>
                    <div>
                      <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-200 truncate max-w-[200px] block">{f.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Index: {i + 1}</span>
                    </div>
                  </div>
                  <button onClick={() => setFiles(prev => prev.filter(file => file.id !== f.id))} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button 
              onClick={mergePdfs} 
              disabled={files.length < 2 || merging} 
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {merging ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
              {merging ? 'Merging in Browser...' : `Merge and Download PDF`}
            </button>
            
            {files.length < 2 && !merging && (
              <p className="text-center text-[9px] font-black uppercase text-slate-400 tracking-widest">Add at least 2 files to combine</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
        <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
        <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest leading-relaxed">
          Zero Server Load: PDF merging happens entirely on your machine. No documents are uploaded to any server.
        </p>
      </div>
    </div>
  );
};

export default PdfMerge;
