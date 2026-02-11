import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Trash2, 
  Printer, 
  Plus, 
  History, 
  X, 
  ReceiptText,
  PackageSearch
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

interface Party {
  id: string;
  name: string;
  gstin: string;
  permAddr: string;
  shipAddr: string;
}

interface InventoryItem {
  id: string;
  name: string;
  hsn: string;
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
    dueDate: string;
    paymentMode: string;
    lateInterest: number;
  };
}

// Restricted to Premium and Classic B&W only as requested
type InvoiceDesign = 'premium' | 'classic_bw';

const InvoiceGenerator: React.FC<{ user: any; onLoginRequest: () => void }> = ({ user, onLoginRequest }) => {
  const [design, setDesign] = useState<InvoiceDesign>('premium');
  
  // Company Profile
  const [bizName, setBizName] = useState('PROTOOLS SOLUTIONS');
  const [bizAddr, setBizAddr] = useState('123 Industrial Area, Bangalore, Karnataka');
  const [bizGST, setBizGST] = useState('29AAAAA0000A1Z5');
  const [bizMobile, setBizMobile] = useState('+91 9876543210');

  // Database
  const [savedParties, setSavedParties] = useState<Party[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showPartyList, setShowPartyList] = useState(false);
  const [activeItemPicker, setActiveItemPicker] = useState<string | null>(null);

  // Current Invoice State
  const [partyName, setPartyName] = useState('RETAIL CLIENT PRIVATE LTD');
  const [partyGST, setPartyGST] = useState('27BBBBB1111B2Z2');
  const [partyPermAddr, setPartyPermAddr] = useState('123 INDUSTRIAL AREA, BANGALORE, KARNATAKA');
  const [invoiceNo, setInvoiceNo] = useState('INV-2022435');
  const [invoiceDate, setInvoiceDate] = useState('2026-02-11');
  const [paymentMode, setPaymentMode] = useState('UPI / BANK TRANSFER');
  const [lateInterest, setLateInterest] = useState(24);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Professional Web Development Services', hsn: '9983', qty: 1, rate: 25000, gst: 18 },
  ]);

  // History State
  const [history, setHistory] = useState<SavedInvoice[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(1);

  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('protools_biz_profile');
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setBizName(p.name || ''); setBizAddr(p.addr || ''); setBizGST(p.gst || ''); setBizMobile(p.mobile || '');
    }
    const parties = localStorage.getItem('protools_parties');
    if (parties) setSavedParties(JSON.parse(parties));
    const inv = localStorage.getItem('protools_inventory');
    if (inv) setInventory(JSON.parse(inv));
    const savedHistory = localStorage.getItem('invoice_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

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

  const loadFromHistory = (record: SavedInvoice) => {
    // Gracefully handle older records with removed designs
    const designToSet = (record.design === 'premium' || record.design === 'classic_bw') 
      ? record.design 
      : 'premium';
    
    setDesign(designToSet);
    setPartyName(record.data.partyName);
    setPartyGST(record.data.partyGST);
    setPartyPermAddr(record.data.partyPermAddr);
    setInvoiceNo(record.invoiceNo);
    setInvoiceDate(record.data.invoiceDate);
    setPaymentMode(record.data.paymentMode);
    setLateInterest(record.data.lateInterest);
    setItems(record.data.items);
    setIsHistoryOpen(false);
  };

  const captureAndDownload = async () => {
    setIsProcessing(true);
    if (!previewRef.current) return;
    const element = previewRef.current;
    const originalTransform = element.style.transform;
    element.style.transform = 'none';
    const canvas = await html2canvas(element, { scale: 3, useCORS: true, backgroundColor: '#ffffff', width: 794, height: 1123 });
    element.style.transform = originalTransform;
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`${invoiceNo}.pdf`);
    setIsProcessing(false);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const quickSelectItem = (rowId: string, item: InventoryItem) => {
    setItems(items.map(i => i.id === rowId ? { ...i, description: item.name, hsn: item.hsn } : i));
    setActiveItemPicker(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-20 relative font-sans">
      <div className="flex-grow space-y-6">
        
        {/* TOP ACTION BAR */}
        <div className="flex justify-between items-center print:hidden">
          <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
            <History className="w-4 h-4 text-indigo-500" /> All Records
          </button>
          <div className="flex gap-2">
            <button onClick={() => { setPartyName(''); setItems([{ id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0, gst: 18 }]); }} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
              <Plus className="w-4 h-4" /> New Invoice
            </button>
          </div>
        </div>

        {/* DATA ENTRY FORM */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 print:hidden space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Bill To (Client)</label>
                <button onClick={() => setShowPartyList(!showPartyList)} className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 uppercase underline">Saved Clients</button>
              </div>
              <input placeholder="Client / Company Name" value={partyName} onChange={e => setPartyName(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="GSTIN (Optional)" value={partyGST} onChange={e => setPartyGST(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-sm" />
              <textarea placeholder="Client Address" value={partyPermAddr} onChange={e => setPartyPermAddr(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none h-20 resize-none text-sm" />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Statement Details</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Invoice Number</span>
                  <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-black text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Issue Date</span>
                  <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Payment Mode</span>
                  <input value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm font-bold" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase ml-1 opacity-40">Late Fee Interest (%)</span>
                  <input type="number" value={lateInterest} onChange={e => setLateInterest(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none font-bold text-rose-500 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Line Items & Services</h4>
               <button onClick={() => setItems([...items, { id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0, gst: 18 }])} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">+ Add Item</button>
             </div>
             
             <div className="space-y-4">
               {items.map(item => (
                 <div key={item.id} className="relative">
                   <div className="grid grid-cols-12 gap-3 items-center bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border dark:border-slate-800 hover:border-indigo-300 transition-all">
                     <div className="col-span-4 relative flex items-center gap-2 bg-white dark:bg-slate-800 rounded-xl px-2">
                        <button onClick={() => setActiveItemPicker(activeItemPicker === item.id ? null : item.id)} title="Inventory Search" className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                          <PackageSearch className="w-4 h-4" />
                        </button>
                        <input placeholder="Service Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="w-full p-3 bg-transparent text-xs font-bold outline-none" />
                        
                        {activeItemPicker === item.id && (
                          <div className="absolute top-full left-0 mt-3 w-full z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-slate-700 p-2 max-h-48 overflow-y-auto animate-in zoom-in-95">
                            {inventory.length === 0 ? (
                              <p className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">No inventory items found</p>
                            ) : (
                              inventory.map(inv => (
                                <button key={inv.id} onClick={() => quickSelectItem(item.id, inv)} className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-[10px] font-black uppercase flex justify-between border-b last:border-0 dark:border-slate-800">
                                  <span>{inv.name}</span>
                                  <span className="text-indigo-400">HSN: {inv.hsn}</span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                     </div>
                     <div className="col-span-1">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center mb-1">HSN</p>
                       <input placeholder="HSN" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs text-center font-bold" />
                     </div>
                     <div className="col-span-1">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center mb-1">QTY</p>
                       <input type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs text-center font-black" />
                     </div>
                     <div className="col-span-2">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center mb-1">Rate (₹)</p>
                       <input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-black text-right" />
                     </div>
                     <div className="col-span-1">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center mb-1">GST %</p>
                       <select value={item.gst} onChange={e => updateItem(item.id, 'gst', Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-black text-center outline-none">
                         <option value={0}>0%</option>
                         <option value={5}>5%</option>
                         <option value={12}>12%</option>
                         <option value={18}>18%</option>
                         <option value={28}>28%</option>
                       </select>
                     </div>
                     <div className="col-span-2 text-right">
                       <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Line Total</p>
                       <p className="text-xs font-black text-slate-900 dark:text-white px-2">₹{((item.qty * item.rate) * (1 + item.gst/100)).toLocaleString()}</p>
                     </div>
                     <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="col-span-1 text-rose-500 flex justify-center hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex gap-4">
               <div className="text-center">
                 <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Subtotal</p>
                 <p className="text-sm font-black">₹{totals.subtotal.toLocaleString()}</p>
               </div>
               <div className="text-center">
                 <p className="text-[8px] font-black uppercase text-indigo-400 mb-1">Tax Total</p>
                 <p className="text-sm font-black text-indigo-600">₹{totals.totalGst.toLocaleString()}</p>
               </div>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
               <button onClick={captureAndDownload} disabled={isProcessing} className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                 {isProcessing ? 'Saving...' : 'Download PDF'}
               </button>
               <button onClick={() => window.print()} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                 <Printer className="w-4 h-4" /> Print
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* PREVIEW PANEL */}
      <div className="flex flex-col items-center">
        <div className="flex gap-2 mb-8 print:hidden">
          {['premium', 'classic_bw'].map(d => (
            <button key={d} onClick={() => setDesign(d as any)} className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${design === d ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}>
              {d === 'classic_bw' ? 'C-BW' : d}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="w-full flex justify-center print:block">
          <div style={{ width: `${794 * scale}px`, height: `${1123 * scale}px`, overflow: 'hidden', position: 'relative' }} className="print:w-full print:h-auto shadow-2xl rounded-2xl">
            {/* ACTUAL INVOICE SHEET */}
            <div 
              ref={previewRef}
              id="invoice-actual-sheet"
              className="bg-white text-slate-900 origin-top-left print:transform-none"
              style={{ width: '794px', height: '1123px', transform: `scale(${scale})`, padding: '60px 70px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', position: 'absolute', top: 0, left: 0 }}
            >
              {design === 'premium' && (
                <>
                  {/* HEADER SECTION */}
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                          <ReceiptText className="w-7 h-7" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-black text-[#1E293B] leading-none tracking-tight">{bizName}</h1>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bill To:</p>
                        <p className="text-2xl font-black text-[#1E293B] uppercase">{partyName || 'Retail Client'}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed max-w-[320px]">{partyPermAddr}</p>
                      </div>
                    </div>
                    <div className="text-right relative">
                      <div className="absolute top-0 right-0 opacity-[0.05] text-[120px] font-black text-slate-900 leading-none -mt-4 -mr-4 pointer-events-none select-none">
                        {invoiceNo.replace(/\D/g,'')}
                      </div>
                      <h1 className="text-6xl font-black text-[#1E293B] leading-none mb-1">Invoice</h1>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8">Tax Statement</p>
                      <div className="space-y-1 text-[11px] font-black uppercase">
                        <div className="flex justify-end gap-10"><span className="text-slate-400">Issue Date</span>{new Date(invoiceDate).toLocaleDateString('en-GB')}</div>
                        <div className="flex justify-end gap-10"><span className="text-slate-400">Reference ID</span>{invoiceNo}</div>
                      </div>
                    </div>
                  </div>

                  {/* HIGHLIGHT BAR */}
                  <div className="flex rounded-3xl overflow-hidden mb-12 shadow-xl shadow-amber-500/10">
                    <div className="flex-1 bg-[#FBBF24] p-6 text-white grid grid-cols-3 gap-8">
                       <div>
                         <p className="text-[9px] font-black uppercase opacity-60 mb-1">Inv No.</p>
                         <p className="text-2xl font-black uppercase">{invoiceNo}</p>
                       </div>
                       <div>
                         <p className="text-[9px] font-black uppercase opacity-60 mb-1">Date</p>
                         <p className="text-2xl font-black uppercase">{new Date(invoiceDate).toLocaleDateString('en-GB')}</p>
                       </div>
                       <div>
                         <p className="text-[9px] font-black uppercase opacity-60 mb-1">Method</p>
                         <p className="text-2xl font-black uppercase truncate">{paymentMode}</p>
                       </div>
                    </div>
                    <div className="w-[200px] bg-[#0F172A] p-6 text-white text-right">
                       <p className="text-[9px] font-black uppercase opacity-60 mb-1">Amount Due</p>
                       <p className="text-2xl font-black uppercase">₹{Math.round(totals.grandTotal).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* TABLE */}
                  <div className="flex-grow">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#1E293B] text-white text-[10px] font-black uppercase tracking-widest">
                          <th className="p-4 rounded-tl-2xl w-12 text-center">SN</th>
                          <th className="p-4 text-left">Description</th>
                          <th className="p-4 w-16 text-center">HSN</th>
                          <th className="p-4 w-16 text-center">QTY</th>
                          <th className="p-4 w-24 text-right">Rate</th>
                          <th className="p-4 w-16 text-center">GST</th>
                          <th className="p-4 rounded-tr-2xl w-28 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.map((item, idx) => (
                          <tr key={item.id} className="text-[#1E293B]">
                            <td className="p-4 text-center text-sm font-bold opacity-30">{idx + 1}</td>
                            <td className="p-4">
                               <p className="text-lg font-black uppercase leading-tight">{item.description}</p>
                            </td>
                            <td className="p-4 text-center text-sm font-bold text-slate-400">{item.hsn}</td>
                            <td className="p-4 text-center text-xl font-black">{item.qty}</td>
                            <td className="p-4 text-right text-sm font-bold text-slate-400">{item.rate.toLocaleString('en-IN')}</td>
                            <td className="p-4 text-center text-sm font-black text-indigo-500">{item.gst}%</td>
                            <td className="p-4 text-right text-xl font-black">₹{ ((item.qty * item.rate) * (1 + item.gst/100)).toLocaleString() }</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER AREA */}
                  <div className="mt-20 flex justify-between items-end">
                    <div className="w-6/12 bg-[#FFF7ED] p-8 rounded-[2.5rem] border border-[#FFEDD5]">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A3412] mb-4">Declaration:</h4>
                       <ul className="space-y-2 text-[9px] font-black text-[#9A3412] uppercase opacity-70">
                          <li className="flex items-center gap-2">• BYAJ @ {lateInterest}% APPLIED FOR DELAYED PAYMENTS.</li>
                          <li className="flex items-center gap-2">• TRANSACTION VIA {paymentMode}.</li>
                          <li className="flex items-center gap-2">• GST REGISTERED FIRM: {bizGST}.</li>
                       </ul>
                    </div>

                    <div className="w-5/12 space-y-4">
                       <div className="flex justify-between items-center px-4">
                          <span className="text-sm font-black text-slate-400 uppercase">Sub-Total</span>
                          <span className="text-lg font-black text-[#1E293B]">₹{totals.subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center px-4">
                          <span className="text-sm font-black text-slate-400 uppercase">Total Tax</span>
                          <span className="text-lg font-black text-[#1E293B]">₹{totals.totalGst.toLocaleString()}</span>
                       </div>
                       <div className="bg-[#FBBF24] p-8 rounded-[2.5rem] shadow-xl shadow-amber-500/20 text-white flex justify-between items-center transform scale-105">
                          <span className="text-xs font-black uppercase tracking-widest">Payable</span>
                          <span className="text-4xl font-black">₹{Math.round(totals.grandTotal).toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                </>
              )}

              {design === 'classic_bw' && (
                <div className="flex flex-col h-full text-black border-4 border-black p-4">
                  <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                    <div>
                      <h1 className="text-3xl font-black uppercase tracking-tighter">{bizName}</h1>
                      <p className="text-[11px] font-bold uppercase mt-2 max-w-xs">{bizAddr}</p>
                      <p className="text-[11px] font-black mt-1">GSTIN: {bizGST}</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-4xl font-black uppercase underline decoration-4 underline-offset-8">Tax Invoice</h2>
                      <div className="mt-6 space-y-1 text-[12px] font-black uppercase">
                        <p>Date: {new Date(invoiceDate).toLocaleDateString('en-GB')}</p>
                        <p>Invoice No: {invoiceNo}</p>
                        <p>Payment: {paymentMode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase mb-1 border-b border-black w-fit">Bill To:</p>
                      <p className="text-lg font-black uppercase">{partyName || 'Cash / Retail'}</p>
                      <p className="text-[11px] font-medium uppercase leading-tight mt-1">{partyPermAddr}</p>
                      <p className="text-[11px] font-black mt-2">GSTIN: {partyGST || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <table className="w-full border-2 border-black">
                      <thead>
                        <tr className="border-b-2 border-black text-[10px] font-black uppercase">
                          <th className="p-3 border-r-2 border-black w-10">SN</th>
                          <th className="p-3 border-r-2 border-black text-left">Description</th>
                          <th className="p-3 border-r-2 border-black w-16">HSN</th>
                          <th className="p-3 border-r-2 border-black w-12">QTY</th>
                          <th className="p-3 border-r-2 border-black w-24 text-right">Rate</th>
                          <th className="p-3 border-r-2 border-black w-12">GST</th>
                          <th className="p-3 w-28 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id} className="border-b border-black text-[12px] font-bold h-12">
                            <td className="p-3 border-r-2 border-black text-center">{idx + 1}</td>
                            <td className="p-3 border-r-2 border-black uppercase">{item.description}</td>
                            <td className="p-3 border-r-2 border-black text-center">{item.hsn}</td>
                            <td className="p-3 border-r-2 border-black text-center">{item.qty}</td>
                            <td className="p-3 border-r-2 border-black text-right">{item.rate.toLocaleString('en-IN')}</td>
                            <td className="p-3 border-r-2 border-black text-center">{item.gst}%</td>
                            <td className="p-3 text-right">{((item.qty * item.rate) * (1 + item.gst/100)).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-10 flex">
                    <div className="w-7/12 border-2 border-black p-4 text-[10px] font-black uppercase leading-relaxed">
                      <p className="underline mb-2">Terms & Declaration:</p>
                      <p>1. Byaj @ {lateInterest}% for delayed payments.</p>
                      <p>2. GST Firm: {bizGST}.</p>
                      <p>3. Subject to local jurisdiction only.</p>
                    </div>
                    <div className="w-5/12 pl-8 space-y-2">
                       <div className="flex justify-between font-bold text-sm border-b border-black"><span>Subtotal</span><span>₹{totals.subtotal.toLocaleString()}</span></div>
                       <div className="flex justify-between font-bold text-sm border-b border-black"><span>Tax Total</span><span>₹{totals.totalGst.toLocaleString()}</span></div>
                       <div className="flex justify-between font-black text-xl border-t-2 border-black pt-2"><span>Grand Total</span><span>₹{Math.round(totals.grandTotal).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div className="mt-16 flex justify-between items-end border-t border-black pt-8">
                     <p className="text-[8px] font-bold opacity-40">Professional Digital Document Powered by ProTools</p>
                     <div className="text-right">
                        <div className="w-48 h-0.5 bg-black ml-auto mb-2"></div>
                        <p className="text-[10px] font-black uppercase">Authorized Signatory</p>
                        <p className="text-[8px] font-bold uppercase">{bizName}</p>
                     </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between items-center border-t border-slate-50 pt-8">
                 <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                   Digital Document ID: S-94443482
                 </div>
                 {design !== 'classic_bw' && (
                   <div className="text-center">
                      <div className="w-32 h-0.5 bg-slate-900 mx-auto mb-2 opacity-10"></div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Auth. Signatory:</p>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HISTORY DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsHistoryOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-black uppercase tracking-widest">Record Library</h2>
              <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {history.map(record => (
                <div key={record.id} onClick={() => loadFromHistory(record)} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black text-indigo-500 uppercase">{record.invoiceNo}</p>
                      <p className="text-sm font-black uppercase text-slate-800 dark:text-white">{record.partyName}</p>
                    </div>
                    <p className="text-xs font-black">₹{record.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden !important; background: white !important; }
          #invoice-actual-sheet, #invoice-actual-sheet * { visibility: visible !important; }
          #invoice-actual-sheet {
            position: absolute !important; left: 0 !important; top: 0 !important;
            width: 210mm !important; height: 297mm !important;
            transform: none !important; margin: 0 !important;
            padding: 10mm !important; box-shadow: none !important;
            z-index: 9999999 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;