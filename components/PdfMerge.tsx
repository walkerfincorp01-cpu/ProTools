
import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Files, Download, Trash2, Plus } from 'lucide-react';

const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<{ name: string; data: ArrayBuffer }[]>([]);
  const [merging, setMerging] = useState(false);

  // Added explicit File type to prevent 'unknown' errors during PDF processing
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setFiles(prev => [...prev, { name: file.name, data: ev.target!.result as ArrayBuffer }]);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setMerging(true);
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
    link.download = 'merged.pdf';
    link.click();
    setMerging(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8">
      <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white">PDF Merge</h2>
      <div className="space-y-4">
        <label className="cursor-pointer w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-blue-200 rounded-3xl bg-blue-50/30 hover:bg-blue-50 transition-colors">
          <Plus className="w-10 h-10 text-blue-500 mb-2" />
          <span className="font-bold text-blue-600">Select PDF Files</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleUpload} />
        </label>
        
        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((f, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Files className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">{f.name}</span>
                </div>
                <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={mergePdfs} disabled={files.length < 2 || merging} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50">
              {merging ? 'Merging...' : 'Merge and Download PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfMerge;