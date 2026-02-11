
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileImage, Download, Trash2, Plus, Upload } from 'lucide-react';

const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<{ id: string; name: string; data: string }[]>([]);
  const [processing, setProcessing] = useState(false);

  // Added explicit File type to fix TypeScript errors for unknown file properties
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
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        
        // Load image to get dimensions
        const img = new Image();
        img.src = images[i].data;
        await new Promise((resolve) => { img.onload = resolve; });

        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        let finalWidth = pageWidth - 20; // 10mm margin each side
        let finalHeight = finalWidth / ratio;

        if (finalHeight > pageHeight - 20) {
          finalHeight = pageHeight - 20;
          finalWidth = finalHeight * ratio;
        }

        const xOffset = (pageWidth - finalWidth) / 2;
        const yOffset = (pageHeight - finalHeight) / 2;

        pdf.addImage(images[i].data, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
      }

      pdf.save('images-to-pdf.pdf');
    } catch (err) {
      console.error(err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#1E3A8A] dark:text-white flex items-center gap-3">
          <FileImage className="w-6 h-6 text-red-500" />
          JPG to PDF Converter
        </h2>
        <p className="text-slate-400 text-sm">Apni images ko ek single PDF file mein convert karein.</p>
      </div>

      <div className="space-y-4">
        <label className="cursor-pointer w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-red-100 dark:border-slate-700 rounded-3xl bg-red-50/30 dark:bg-slate-900/40 hover:bg-red-50 transition-colors">
          <Plus className="w-10 h-10 text-red-500 mb-2" />
          <span className="font-bold text-red-600">Select Images (JPG/PNG)</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
        
        {images.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 aspect-square">
                  <img src={img.data} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                      className="p-2 bg-red-600 text-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={generatePdf} 
              disabled={processing} 
              className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-600/20 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {processing ? 'Processing PDF...' : `Convert ${images.length} Images to PDF`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToPdf;
