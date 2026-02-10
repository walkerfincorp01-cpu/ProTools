
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Printer, Building2, User, Landmark, ImageIcon, Calculator, Percent } from 'lucide-react';
import html2canvas from 'html2canvas';

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
}

const InvoiceGenerator: React.FC = () => {
  // Business Info
  const [bizName, setBizName] = useState('PROTOOLS SOLUTIONS');
  const [bizAddr, setBizAddr] = useState('123 Industrial Area, Tech Park, Bangalore - 560001');
  const [bizGST, setBizGST] = useState('29AAAAA0000A1Z5');
  const [bizEmail, setBizEmail] = useState('billing@protools.com');
  const [bizPhone, setBizPhone] = useState('+91 98765 43210');

  // Party Info
  const [partyName, setPartyName] = useState('RETAIL CLIENT LTD');
  const [partyBillAddr, setPartyBillAddr] = useState('45 Corporate Street, CBD, Mumbai - 400001');
  const [partyShipAddr, setPartyShipAddr] = useState('Same as billing');
  const [partyGST, setPartyGST] = useState('27BBBBB1111B2Z2');
  const [partyPhone, setPartyPhone] = useState('+91 90000 12345');

  // Invoice Details
  const [invoiceNo, setInvoiceNo] = useState('INV-2024-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [gstSlab, setGstSlab] = useState(18);
  const [paymentMode, setPaymentMode] = useState('BANK TRANSFER / UPI');

  // Interest (Byaj) Settings
  const [applyInterest, setApplyInterest] = useState(false);
  const [interestRate, setInterestRate] = useState(24); // 24% p.a.
  const [interestType, setInterestType] = useState<'SI' | 'CI'>('SI');
  const [daysLate, setDaysLate] = useState(0);

  // Status
  const [isExporting, setIsExporting] = useState(false);

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Development Services', hsn: '9983', qty: 1, rate: 25000 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const totalGst = (subtotal * gstSlab) / 100;
    const cgst = totalGst / 2;
    const sgst = totalGst / 2;
    const baseTotal = subtotal + totalGst;
    
    let calculatedInterest = 0;
    if (applyInterest && daysLate > 0) {
      if (interestType === 'SI') {
        calculatedInterest = (baseTotal * (interestRate / 100) * (daysLate / 365));
      } else {
        calculatedInterest = baseTotal * (Math.pow(1 + (interestRate / 100) / 365, daysLate) - 1);
      }
    }
    
    return { subtotal, cgst, sgst, baseTotal, calculatedInterest, grandTotal: baseTotal + calculatedInterest };
  }, [items, gstSlab, applyInterest, interestRate, interestType, daysLate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `invoice-${invoiceNo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      {/* EDITOR */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl print:hidden space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black">Invoice Editor</h2>
          <div className="flex gap-2">
            <button onClick={handleDownloadImage} disabled={isExporting} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/10 transition-all">
              <ImageIcon className="w-4 h-4" /> {isExporting ? 'Saving...' : 'Save Image'}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/10 transition-all">
              <Printer className="w-4 h-4" /> Print PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-2"><Building2 className="w-3 h-3" /> Seller Details</h3>
            <input placeholder="Business Name" value={bizName} onChange={(e) => setBizName(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
            <input placeholder="GSTIN" value={bizGST} onChange={(e) => setBizGST(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
            <textarea placeholder="Address" value={bizAddr} onChange={(e) => setBizAddr(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm h-16 resize-none" />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2"><User className="w-3 h-3" /> Buyer Details</h3>
            <input placeholder="Party Name" value={partyName} onChange={(e) => setPartyName(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
            <input placeholder="Buyer GST" value={partyGST} onChange={(e) => setPartyGST(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
            <textarea placeholder="Address" value={partyBillAddr} onChange={(e) => setPartyBillAddr(e.target.value)} className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm h-16 resize-none" />
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2"><Calculator className="w-3 h-3" /> Byaj (Interest) Setup</h3>
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <input type="checkbox" checked={applyInterest} onChange={(e) => setApplyInterest(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
              <label className="text-xs font-bold text-blue-700 dark:text-blue-300">Add Late Interest?</label>
            </div>
            {applyInterest && (
              <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-300">
                <input type="number" placeholder="Rate %" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
                <input type="number" placeholder="Days Late" value={daysLate} onChange={(e) => setDaysLate(Number(e.target.value))} className="p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
                <select value={interestType} onChange={(e) => setInterestType(e.target.value as 'SI' | 'CI')} className="col-span-2 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm">
                  <option value="SI">Simple Interest (SI)</option>
                  <option value="CI">Compound Interest (CI)</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
               <input placeholder="Inv No" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm" />
               <select value={gstSlab} onChange={(e) => setGstSlab(Number(e.target.value))} className="p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-sm">
                <option value={5}>5% GST</option>
                <option value={12}>12% GST</option>
                <option value={18}>18% GST</option>
                <option value={28}>28% GST</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Line Items (HSN & Rate Check)</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} className="col-span-4 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs" />
                <input placeholder="HSN" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} className="col-span-2 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs" />
                <input type="number" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))} className="col-span-2 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs" />
                <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))} className="col-span-3 p-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs font-bold" />
                <button onClick={() => removeItem(item.id)} className="col-span-1 text-red-400 hover:text-red-600 flex justify-center"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={addItem} className="flex items-center gap-2 text-xs font-bold text-blue-600 px-4 py-2 border-2 border-dashed border-blue-100 rounded-xl hover:bg-blue-50 transition-all">
              <Plus className="w-3 h-3" /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div id="invoice-preview" className="bg-white text-slate-900 p-8 shadow-2xl mx-auto w-full max-w-[5.5in] flex flex-col border border-slate-100 print:shadow-none print:m-0 print:p-[0.5in] print:max-w-none print:w-full">
        {/* Header Strip */}
        <div className="bg-[#121E3E] text-white p-4 flex justify-between items-center -mx-8 -mt-8 print:-mx-[0.5in] print:-mt-[0.5in] border-b-2 border-blue-500">
          <h1 className="text-sm font-black tracking-tight uppercase print:text-xl">Tax Invoice</h1>
          <div className="text-right">
            <div className="text-[7px] font-bold uppercase opacity-60 print:text-[10px]">Invoice #</div>
            <div className="text-xs font-bold print:text-base">{invoiceNo}</div>
          </div>
        </div>

        {/* Seller Center */}
        <div className="text-center mt-6 mb-6">
          <h2 className="text-lg font-black text-[#121E3E] print:text-2xl">{bizName}</h2>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 print:text-[11px]">{bizAddr}</p>
          <div className="flex justify-center gap-4 mt-2 text-[7px] font-bold text-slate-400 uppercase print:text-[10px]">
            <span>GSTIN: {bizGST}</span>
            <span>Ph: {bizPhone}</span>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Address Grid */}
        <div className="grid grid-cols-2 gap-6 py-6 print:py-10">
          <div className="space-y-1.5">
            <div className="text-[7px] font-black uppercase text-blue-600 border-b pb-0.5 inline-block print:text-[10px]">Bill To:</div>
            <div className="text-xs font-black text-slate-800 print:text-lg">{partyName}</div>
            <p className="text-[8px] font-bold text-slate-500 uppercase leading-tight print:text-[11px]">{partyBillAddr}</p>
            <div className="text-[7px] font-bold text-slate-400 uppercase print:text-[10px]">GSTIN: {partyGST}</div>
          </div>
          <div className="space-y-1.5 border-l pl-6 print:pl-10">
            <div className="text-[7px] font-black uppercase text-slate-400 print:text-[10px]">Invoice Details</div>
            <div className="pt-0.5 space-y-0.5">
               <div className="flex justify-between text-[7px] font-bold uppercase print:text-[10px]">
                 <span className="text-slate-400">Date:</span>
                 <span className="text-slate-800">{invoiceDate}</span>
               </div>
               <div className="flex justify-between text-[7px] font-bold uppercase print:text-[10px]">
                 <span className="text-slate-400">Due:</span>
                 <span className="text-slate-800">{invoiceDate}</span>
               </div>
               <div className="flex justify-between text-[7px] font-bold uppercase print:text-[10px]">
                 <span className="text-slate-400">Payment:</span>
                 <span className="text-slate-800 truncate pl-1">{paymentMode}</span>
               </div>
            </div>
          </div>
        </div>

        {/* ITEM TABLE - Fixed HSN and Rate columns */}
        <div className="flex-grow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-[7px] font-black uppercase p-2 border border-slate-100 print:text-[10px] print:p-4">Description</th>
                <th className="text-center text-[7px] font-black uppercase p-2 border border-slate-100 print:text-[10px] print:p-4">HSN</th>
                <th className="text-center text-[7px] font-black uppercase p-2 border border-slate-100 print:text-[10px] print:p-4">Qty</th>
                <th className="text-right text-[7px] font-black uppercase p-2 border border-slate-100 print:text-[10px] print:p-4">Rate</th>
                <th className="text-right text-[7px] font-black uppercase p-2 border border-slate-100 print:text-[10px] print:p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border border-slate-100 text-[9px] font-bold text-slate-700 print:text-[11px] print:p-4">{item.description}</td>
                  <td className="p-2 border border-slate-100 text-center text-[8px] font-bold text-slate-500 print:text-[10px] print:p-4">{item.hsn || '-'}</td>
                  <td className="p-2 border border-slate-100 text-center text-[9px] font-black text-slate-800 print:text-[11px] print:p-4">{item.qty}</td>
                  <td className="p-2 border border-slate-100 text-right text-[9px] font-bold text-slate-500 print:text-[11px] print:p-4">{item.rate.toFixed(2)}</td>
                  <td className="p-2 border border-slate-100 text-right text-[9px] font-black text-slate-800 print:text-[11px] print:p-4">{(item.qty * item.rate).toFixed(2)}</td>
                </tr>
              ))}
              {/* Spacers */}
              {[...Array(Math.max(0, 4 - items.length))].map((_, i) => (
                <tr key={i} className="h-6 print:h-12">
                  <td className="border border-slate-100"></td>
                  <td className="border border-slate-100"></td>
                  <td className="border border-slate-100"></td>
                  <td className="border border-slate-100"></td>
                  <td className="border border-slate-100"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="mt-6 flex border-t pt-6 print:mt-10 print:pt-10">
          <div className="w-1/2 pr-6">
            <h4 className="text-[7px] font-black uppercase text-blue-600 mb-2 print:text-[10px]">Terms & Notes</h4>
            <ul className="text-[6px] font-bold text-slate-400 space-y-1 list-disc pl-3 print:text-[9px]">
              <li>Goods once sold cannot be returned.</li>
              <li>{applyInterest ? `Interest @ ${interestRate}% p.a. charged for delayed payments.` : 'Interest @ 24% p.a. charged for delayed payments.'}</li>
              <li>Subject to local jurisdiction only.</li>
            </ul>
            {applyInterest && (
              <div className="mt-4 p-2 bg-blue-50 border border-blue-100 rounded-lg print:p-4">
                <div className="text-[6px] font-black text-blue-600 uppercase mb-1 print:text-[9px]">Late Payment Interest (Byaj)</div>
                <div className="text-[8px] font-bold text-blue-800 print:text-[11px]">
                  Type: {interestType} | Days: {daysLate} | Rate: {interestRate}%
                </div>
              </div>
            )}
          </div>
          <div className="w-1/2">
            <div className="space-y-1.5 print:space-y-3">
              <div className="flex justify-between text-[8px] font-bold uppercase print:text-[11px]">
                <span className="text-slate-400">Sub Total</span>
                <span className="text-slate-800">₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[8px] font-bold uppercase print:text-[11px]">
                <span className="text-slate-400">Total GST ({gstSlab}%)</span>
                <span className="text-slate-800">₹{(totals.cgst + totals.sgst).toLocaleString()}</span>
              </div>
              {applyInterest && (
                <div className="flex justify-between text-[8px] font-bold uppercase text-blue-600 print:text-[11px]">
                  <span>Added Interest</span>
                  <span>+ ₹{Math.round(totals.calculatedInterest).toLocaleString()}</span>
                </div>
              )}
              <div className="bg-[#121E3E] text-white p-3 mt-3 flex justify-between items-center -mr-8 print:-mr-[0.5in] print:p-6">
                <span className="text-[9px] font-black uppercase print:text-sm">Grand Total</span>
                <span className="text-lg font-black print:text-2xl">₹{Math.round(totals.grandTotal).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 text-center print:mt-16">
              <div className="w-full border-b border-slate-900 pb-1 mb-1 font-black text-[7px] uppercase print:text-[10px]">
                For {bizName}
              </div>
              <div className="text-[7px] font-black uppercase text-slate-400 print:text-[10px]">Authorised Signatory</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-slate-400 text-xs py-4 print:hidden">
        Standard Tax Invoice Format with GST, HSN, and Rate columns.
      </div>
      
      <style>{`
        @media print {
          #invoice-preview {
            max-width: 100% !important;
            width: 100% !important;
            border: none !important;
            padding: 0.5in !important;
          }
          table th, table td {
            font-size: 11px !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;
