
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Trash2, 
  Printer, 
  Plus, 
  History, 
  X, 
  ReceiptText,
  Building2,
  MapPin,
  Truck,
  Landmark,
  Download,
  Edit3,
  Search,
  CheckCircle2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gst: number;
}

interface SavedInvoice {
  id: string;
  timestamp: number;
  invoiceNo: string;
  partyName: string;
  total: number;
  design: InvoiceDesign;
  data: {
    partyName: string;
    partyGST: string;
    partyPermAddr: string;
    partyShipAddr: string;
    items: InvoiceItem[];
    invoiceDate: string;
    paymentMode: string;
    lateInterest: number;
    invoiceNo: string;
  };
}

type InvoiceDesign = 'premium' | 'classic_bw';

const InvoiceGenerator: React.FC<{ user: any; onLoginRequest: () => void }> = ({ user, onLoginRequest }) => {
  const [design, setDesign] = useState<InvoiceDesign>('premium');
  
  // Seller Data
  const [bizProfile, setBizProfile] = useState({
    name: 'PROTOOLS SOLUTIONS',
    addr: '123 Industrial Area, Bangalore, Karnataka',
    gst: '29AAAAA0000A1Z5',
    mobile: '+91 9876543210',
    bankName: '',
    accountNo: '',
    ifsc: '',
    branch: '',
    logo: '',
    signature: ''
  });

  // Invoice Form State
  const [partyName, setPartyName] = useState('RETAIL CLIENT PRIVATE LTD');
  const [partyGST, setPartyGST] = useState('27BBBBB1111B2Z2');
  const [partyPermAddr, setPartyPermAddr] = useState('123 INDUSTRIAL AREA, BANGALORE, KARNATAKA');
  const [partyShipAddr, setPartyShipAddr] = useState('WAREHOUSE DEPT, SECTOR 5, INDUSTRIAL ESTATE, BANGALORE');
  const [invoiceNo, setInvoiceNo] = useState('INV-101');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMode, setPaymentMode] = useState('UPI / BANK TRANSFER');
  const [lateInterest, setLateInterest] = useState(24);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Development Services', hsn: '9983', qty: 1, rate: 25000, gst: 18 },
  ]);

  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    const savedProfile = localStorage.getItem('protools_biz_profile');
    if (savedProfile) setBizProfile(JSON.parse(savedProfile));

    const savedHistory = localStorage.getItem('invoice_history');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      
      // Auto-increment logic for new session
      if (parsedHistory.length > 0) {
        const lastInv = parsedHistory[0].invoiceNo;
        const match = lastInv.match(/(\d+)$/);
        if (match) {
          const nextNum = parseInt(match[0]) + 1;
          const prefix = lastInv.replace(match[0], '');
          setInvoiceNo(`${prefix}${nextNum}`);
        }
      }
    }

    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const a4WidthPx = 794; 
        const newScale = Math.min(1, (containerWidth - 40) / a4WidthPx);
        setScale(newScale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalGst = 0;
    items.forEach(item => {
      const lineTotal = item.qty * item.rate;
      subtotal += lineTotal;
      totalGst += (lineTotal * item.gst) / 100;
    });
    return { subtotal, totalGst, grandTotal: subtotal + totalGst };
  }, [items]);

  const saveToHistory = (customData?: any) => {
    const dataToSave = customData || {
      partyName, partyGST, partyPermAddr, partyShipAddr, items, invoiceDate, paymentMode, lateInterest, invoiceNo
    };
    
    const newRecord: SavedInvoice = {
      id: editingId || Date.now().toString(),
      timestamp: Date.now(),
      invoiceNo: dataToSave.invoiceNo,
      partyName: dataToSave.partyName,
      total: totals.grandTotal,
      design,
      data: dataToSave
    };

    let updatedHistory;
    if (editingId) {
      updatedHistory = history.map(h => h.id === editingId ? newRecord : h);
    } else {
      updatedHistory = [newRecord, ...history];
    }

    setHistory(updatedHistory);
    localStorage.setItem('invoice_history', JSON.stringify(updatedHistory));
  };

  const captureAndDownload = async () => {
    setIsProcessing(true);
    if (!previewRef.current) return;
    
    // Slight delay to ensure DOM is ready
    await new Promise(r => setTimeout(r, 100));

    const element = previewRef.current;
    const originalTransform = element.style.transform;
    element.style.transform = 'none';
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });
      element.style.transform = originalTransform;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      pdf.save(`${invoiceNo}.pdf`);
      
      saveToHistory();
      
      // If creating new (not editing), suggest next number
      if (!editingId) {
        const match = invoiceNo.match(/(\d+)$/);
        if (match) {
          const nextNum = parseInt(match[0]) + 1;
          const prefix = invoiceNo.replace(match[0], '');
          setInvoiceNo(`${prefix}${nextNum}`);
        }
      }
    } catch (err) {
      console.error("PDF Generation Error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (record: SavedInvoice) => {
    const { data } = record;
    setPartyName(data.partyName);
    setPartyGST(data.partyGST);
    setPartyPermAddr(data.partyPermAddr);
    setPartyShipAddr(data.partyShipAddr);
    setItems(data.items);
    setInvoiceDate(data.invoiceDate);
    setPaymentMode(data.paymentMode);
    setLateInterest(data.lateInterest);
    setInvoiceNo(data.invoiceNo);
    setEditingId(record.id);
    setIsHistoryOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Kya aap is record ko delete karna chahte hain?")) {
      const updated = history.filter(h => h.id !== id);
      setHistory(updated);
      localStorage.setItem('invoice_history', JSON.stringify(updated));
    }
  };

  const startNew = () => {
    setEditingId(null);
    setPartyName('');
    setPartyPermAddr('');
    setPartyShipAddr('');
    setPartyGST('');
    setItems([{ id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0, gst: 18 }]);
    
    // Auto increment from the highest number in history
    if (history.length > 0) {
      const lastInv = history[0].invoiceNo;
      const match = lastInv.match(/(\d+)$/);
      if (match) {
        const nextNum = parseInt(match[0]) + 1;
        const prefix = lastInv.replace(match[0], '');
        setInvoiceNo(`${prefix}${nextNum}`);
      }
    } else {
      setInvoiceNo('INV-101');
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 relative">
      <div className="flex-grow space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <button 
            onClick={() => setIsHistoryOpen(true)} 
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all"
          >
            <History className="w-4 h-4 text-indigo-500" /> Records History
          </button>
          <div className="flex gap-2">
            {editingId && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl text-[9px] font-black uppercase">
                Editing Mode
              </div>
            )}
            <button 
              onClick={startNew} 
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Create New
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 print:hidden space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Party Details (Buyer)</label>
              <input placeholder="Party / Client Name" value={partyName} onChange={e => setPartyName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="GSTIN (Optional)" value={partyGST} onChange={e => setPartyGST(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-sm outline-none" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea placeholder="Billing Address" value={partyPermAddr} onChange={e => setPartyPermAddr(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none h-24 resize-none text-xs font-bold" />
                <textarea placeholder="Shipping Address (Optional)" value={partyShipAddr} onChange={e => setPartyShipAddr(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none h-24 resize-none text-xs font-bold" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Invoice Settings</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Invoice #</span>
                  <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-black text-sm text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Date</span>
                  <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Payment Mode</span>
                  <input value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Late Int %</span>
                  <input type="number" value={lateInterest} onChange={e => setLateInterest(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-bold text-rose-500 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Products / Services</h4>
               <button onClick={() => setItems([...items, { id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0, gst: 18 }])} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">+ Add Item</button>
             </div>
             
             <div className="space-y-3">
               {items.map(item => (
                 <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-slate-50 dark:bg-slate-900/40 p-2 rounded-2xl border dark:border-slate-800">
                   <div className="col-span-5">
                      <input placeholder="Item Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-bold border-none" />
                   </div>
                   <div className="col-span-1">
                     <input placeholder="HSN" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-[10px] text-center border-none font-bold" />
                   </div>
                   <div className="col-span-1">
                     <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs text-center border-none font-bold" />
                   </div>
                   <div className="col-span-2">
                     <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-black text-right border-none" />
                   </div>
                   <div className="col-span-1">
                     <select value={item.gst} onChange={e => updateItem(item.id, 'gst', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-[9px] font-black border-none">
                       {[0, 5, 12, 18, 28].map(g => <option key={g} value={g}>{g}%</option>)}
                     </select>
                   </div>
                   <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="col-span-2 text-rose-500 flex justify-center hover:bg-rose-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                 </div>
               ))}
             </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex gap-10">
               <div>
                 <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Total Taxable</p>
                 <p className="text-sm font-black">₹{totals.subtotal.toLocaleString()}</p>
               </div>
               <div>
                 <p className="text-[8px] font-black uppercase text-indigo-400 mb-1">Kul GST</p>
                 <p className="text-sm font-black text-indigo-600">₹{totals.totalGst.toLocaleString()}</p>
               </div>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
               <button onClick={captureAndDownload} disabled={isProcessing} className="flex-1 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
                 {isProcessing ? 'Saving...' : (editingId ? 'Update & Download' : 'Generate & Save')}
               </button>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-2 mb-8 print:hidden">
          {['premium', 'classic_bw'].map(d => (
            <button key={d} onClick={() => setDesign(d as any)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${design === d ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border dark:border-slate-800'}`}>
              {d === 'classic_bw' ? 'Classic' : 'Premium'}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="w-full flex justify-center print:block">
          <div style={{ width: `${794 * scale}px`, height: `${1123 * scale}px`, overflow: 'hidden', position: 'relative' }} className="print:w-full print:h-auto shadow-2xl rounded-2xl bg-white border dark:border-slate-800">
            <div 
              ref={previewRef}
              className="bg-white text-slate-900 origin-top-left print:transform-none"
              style={{ width: '794px', height: '1123px', transform: `scale(${scale})`, padding: '60px 70px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'absolute', top: 0, left: 0 }}
            >
              {/* Premium Design Section */}
              {design === 'premium' ? (
                <>
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                          <ReceiptText className="w-8 h-8" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-black text-slate-900 leading-none uppercase">{bizProfile.name}</h1>
                          <p className="text-[10px] font-black uppercase text-indigo-500 mt-1 tracking-widest">Digital Solutions</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-[11px] font-bold text-slate-500 uppercase leading-relaxed max-w-[320px]">
                        <p>{bizProfile.addr}</p>
                        <p className="text-slate-900 font-black">GSTIN: {bizProfile.gst}</p>
                        <p>MOB: {bizProfile.mobile}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-5xl font-black text-slate-900 leading-none mb-2">INVOICE</h1>
                      <div className="space-y-1 text-[11px] font-black uppercase">
                        <div className="flex justify-end gap-10"><span className="text-slate-300">Invoice No:</span> {invoiceNo}</div>
                        <div className="flex justify-end gap-10"><span className="text-slate-300">Date:</span> {new Date(invoiceDate).toLocaleDateString('en-GB')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 mb-12">
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 h-full">
                      <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest mb-3">BILL TO / CLIENT:</p>
                      <p className="text-lg font-black text-slate-900 uppercase mb-1 leading-tight">{partyName || 'RETAIL CLIENT'}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">{partyPermAddr}</p>
                      {partyGST && <p className="text-[10px] font-black text-slate-900 mt-3 border-t pt-2">GSTIN: {partyGST}</p>}
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 h-full">
                      <p className="text-[9px] font-black uppercase text-amber-600 tracking-widest mb-3">SHIP TO ADDRESS:</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">{partyShipAddr || partyPermAddr || 'SAME AS BILLING'}</p>
                      <div className="mt-4 pt-3 border-t border-slate-200">
                         <p className="text-[9px] font-black text-slate-400 uppercase">Payment Mode:</p>
                         <p className="text-[11px] font-black text-slate-900 uppercase">{paymentMode}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-b-4 border-slate-900 pb-10 mb-12 flex justify-between items-end">
                  <div>
                    <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900">TAX INVOICE</h1>
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500 mt-2">Professional Billing Statement</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black uppercase text-indigo-600">{invoiceNo}</p>
                    <p className="text-sm font-bold text-slate-400">{new Date(invoiceDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              )}

              <div className="flex-grow">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className={`${design === 'premium' ? 'bg-[#1E293B] text-white' : 'bg-slate-100 text-slate-900 border-y-2 border-slate-900'} text-[10px] font-black uppercase tracking-widest`}>
                      <th className="p-4 w-12 text-center">#</th>
                      <th className="p-4 text-left">Description of Goods/Services</th>
                      <th className="p-4 w-16 text-center">HSN</th>
                      <th className="p-4 w-16 text-center">QTY</th>
                      <th className="p-4 w-28 text-right">Rate</th>
                      <th className="p-4 w-16 text-center">GST</th>
                      <th className="p-4 w-32 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${design === 'premium' ? 'divide-slate-100' : 'divide-slate-200'}`}>
                    {items.map((item, idx) => (
                      <tr key={item.id} className="text-[11px] font-bold">
                        <td className="p-4 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-4 text-slate-900 font-black uppercase leading-tight">{item.description || '---'}</td>
                        <td className="p-4 text-center text-slate-500">{item.hsn || '---'}</td>
                        <td className="p-4 text-center">{item.qty}</td>
                        <td className="p-4 text-right">₹{item.rate.toLocaleString()}</td>
                        <td className="p-4 text-center text-indigo-500 font-black">{item.gst}%</td>
                        <td className="p-4 text-right font-black">₹{Math.round((item.qty * item.rate) * (1 + item.gst/100)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-12 grid grid-cols-12 gap-10">
                <div className="col-span-7 space-y-6">
                  {bizProfile.bankName && (
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-3 flex items-center gap-2"><Landmark className="w-3 h-3" /> BANK SETTLEMENT INFO:</p>
                      <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-black uppercase">
                        <span className="text-slate-400">Bank:</span> <span>{bizProfile.bankName}</span>
                        <span className="text-slate-400">A/C:</span> <span className="text-indigo-600">{bizProfile.accountNo}</span>
                        <span className="text-slate-400">IFSC:</span> <span>{bizProfile.ifsc}</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed italic">
                    Terms: 1. Interest @{lateInterest}% will be charged if not paid within 15 days. 
                    2. Goods once sold will not be taken back.
                  </p>
                </div>

                <div className="col-span-5">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase px-2">
                        <span className="text-slate-400">Subtotal</span>
                        <span>₹{totals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-black uppercase text-indigo-600 px-2">
                        <span className="text-slate-400">GST Amt</span>
                        <span>₹{totals.totalGst.toLocaleString()}</span>
                      </div>
                      <div className={`mt-4 p-5 ${design === 'premium' ? 'bg-slate-900 text-white rounded-3xl' : 'bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-xl'} flex justify-between items-center shadow-xl`}>
                        <span className="text-[10px] font-black uppercase opacity-60">Grand Total</span>
                        <span className="text-3xl font-black">₹{Math.round(totals.grandTotal).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-10 flex justify-between items-end border-t border-slate-100">
                <div className="text-center opacity-40">
                  <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center mb-2">
                    <span className="text-[8px] font-black uppercase">Receivers<br/>Stamp</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase mb-10">FOR {bizProfile.name}</p>
                  <div className="w-48 h-[1px] bg-slate-900"></div>
                  <p className="text-[9px] font-black uppercase mt-2 tracking-widest">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
           <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border dark:border-slate-800">
              <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><History className="w-5 h-5" /></div>
                  <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">Past Records</h3>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 font-black uppercase tracking-[0.2em]">No Saved Invoices</div>
                ) : (
                  history.map(record => (
                    <div key={record.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm hover:border-indigo-400 transition-all group">
                      <div className="flex items-center gap-4 flex-1 overflow-hidden">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                          <ReceiptText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{record.partyName || 'CASH CLIENT'}</p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-[9px] font-black uppercase text-indigo-600">#{record.invoiceNo}</span>
                            <span className="text-[9px] font-black uppercase text-slate-400">Total: ₹{Math.round(record.total).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(record)}
                          title="Edit"
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            // Temporary load and trigger download
                            const prevEditId = editingId;
                            handleEdit(record);
                            setTimeout(() => {
                              captureAndDownload();
                              if (prevEditId) setEditingId(prevEditId);
                            }, 500);
                          }}
                          title="Quick Download"
                          className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(record.id)}
                          title="Delete"
                          className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-900/80 border-t dark:border-slate-800 flex justify-between items-center">
                 <p className="text-[10px] font-black uppercase text-slate-400">Total Records: {history.length}</p>
                 <button onClick={() => setIsHistoryOpen(false)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Close</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceGenerator;
