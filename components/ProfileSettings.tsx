
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Camera, 
  Save, 
  Trash2, 
  CheckCircle2,
  AlertTriangle,
  Package,
  Plus,
  Mail,
  Lock,
  Landmark,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface ProfileSettingsProps {
  user: { name: string; email: string; photo: string } | null;
  onUpdateUser: (userData: any) => void;
}

interface InventoryItem {
  id: string;
  name: string;
  hsn: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'inventory' | 'security'>('personal');
  
  const [business, setBusiness] = useState({
    name: 'MY BUSINESS NAME',
    gst: '22AAAAA0000A1Z5',
    addr: '123 Business Park, City, State, ZIP',
    mobile: '+91 99999 00000',
    bankName: '',
    accountNo: '',
    ifsc: '',
    branch: '',
    logo: '',
    signature: ''
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newInvItem, setNewInvItem] = useState({ name: '', hsn: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedBiz = localStorage.getItem('protools_biz_profile');
    if (savedBiz) {
      setBusiness(JSON.parse(savedBiz));
    }

    const savedInv = localStorage.getItem('protools_inventory');
    if (savedInv) setInventory(JSON.parse(savedInv));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBusiness(prev => ({ ...prev, [field]: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundAI = (field: 'logo' | 'signature') => {
    setIsProcessingAI(field);
    // Simulated AI Processing Delay
    setTimeout(() => {
      setIsProcessingAI(null);
      triggerToast("AI Background Removed Successfully!");
    }, 2000);
  };

  const handleSaveBusiness = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('protools_biz_profile', JSON.stringify(business));
      setIsSaving(false);
      triggerToast("Seller Details Saved!");
    }, 800);
  };

  const triggerToast = (msg: string) => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addInventoryItem = () => {
    if (!newInvItem.name) return;
    const updated = [...inventory, { ...newInvItem, id: Date.now().toString() }];
    setInventory(updated);
    localStorage.setItem('protools_inventory', JSON.stringify(updated));
    setNewInvItem({ name: '', hsn: '' });
  };

  const deleteInventoryItem = (id: string) => {
    const updated = inventory.filter(item => item.id !== id);
    setInventory(updated);
    localStorage.setItem('protools_inventory', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="relative h-48 bg-[#4285F4] rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <div className="relative">
            <img 
              src={user?.photo || 'https://ui-avatars.com/api/?name=Guest'} 
              className="w-32 h-32 rounded-[2.5rem] border-8 border-white dark:border-slate-800 shadow-xl object-cover" 
              alt="Profile" 
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full">
               <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" className="w-6 h-6" alt="Google" />
            </div>
          </div>
          <div className="mb-14">
            <h2 className="text-3xl font-black text-white drop-shadow-md">{user?.name || 'Guest User'}</h2>
            <p className="text-blue-100 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <Mail className="w-3 h-3" /> {user?.email || 'Not Logged In'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-16">
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'personal', icon: <User className="w-4 h-4" />, label: 'Google Account' },
            { id: 'business', icon: <Building2 className="w-4 h-4" />, label: 'Seller Details' },
            { id: 'inventory', icon: <Package className="w-4 h-4" />, label: 'Inventory' },
            { id: 'security', icon: <ShieldCheck className="w-4 h-4" />, label: 'Security' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm min-h-[400px]">
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-4 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
                 <Lock className="w-6 h-6 text-blue-600" />
                 <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase leading-relaxed tracking-tight">
                    Personal details Gmail se sync hain. Aap inhe manual change nahi kar sakte.
                 </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Account Name</label>
                  <div className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-500">{user?.name || '---'}</div>
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email ID</label>
                  <div className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold text-slate-500">{user?.email || '---'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-10 animate-in fade-in duration-300 pb-10">
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" /> General Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Name (Seller)</label>
                    <input type="text" placeholder="e.g. ADITYA SOLUTIONS" value={business.name} onChange={e => setBusiness({...business, name: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Seller GSTIN</label>
                    <input type="text" placeholder="22AAAAA0000A1Z5" value={business.gst} onChange={e => setBusiness({...business, gst: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Seller Full Address</label>
                    <textarea value={business.addr} onChange={e => setBusiness({...business, addr: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold h-20 resize-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-600" /> Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Bank Name</label>
                    <input type="text" placeholder="SBI / HDFC / PNB" value={business.bankName} onChange={e => setBusiness({...business, bankName: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Account Number</label>
                    <input type="text" placeholder="0000 0000 0000" value={business.accountNo} onChange={e => setBusiness({...business, accountNo: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">IFSC Code</label>
                    <input type="text" placeholder="SBIN0001234" value={business.ifsc} onChange={e => setBusiness({...business, ifsc: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Branch</label>
                    <input type="text" placeholder="CITY MAIN BRANCH" value={business.branch} onChange={e => setBusiness({...business, branch: e.target.value.toUpperCase()})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-600" /> Visual Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Logo</label>
                    {business.logo ? (
                      <div className="relative group p-4 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                        <img src={business.logo} className="h-24 object-contain mb-3 mix-blend-multiply dark:mix-blend-normal" />
                        <div className="flex gap-2">
                          <button onClick={() => removeBackgroundAI('logo')} disabled={isProcessingAI === 'logo'} className="p-2 bg-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> {isProcessingAI === 'logo' ? 'Removing...' : 'AI BG Remove'}
                          </button>
                          <button onClick={() => setBusiness({...business, logo: ''})} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 hover:bg-blue-50 transition-all">
                        <Upload className="w-6 h-6 text-slate-300 mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Upload Logo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'logo')} />
                      </label>
                    )}
                  </div>

                  {/* Signature Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Digital Signature / Stamp</label>
                    {business.signature ? (
                      <div className="relative group p-4 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                        <img src={business.signature} className="h-24 object-contain mb-3 mix-blend-multiply dark:mix-blend-normal" />
                        <div className="flex gap-2">
                          <button onClick={() => removeBackgroundAI('signature')} disabled={isProcessingAI === 'signature'} className="p-2 bg-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> AI BG Remove
                          </button>
                          <button onClick={() => setBusiness({...business, signature: ''})} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-dashed border-slate-200 hover:bg-blue-50 transition-all">
                        <Upload className="w-6 h-6 text-slate-300 mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Upload Signature</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'signature')} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button onClick={handleSaveBusiness} disabled={isSaving} className="w-full flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <Save className="w-5 h-5" /> {isSaving ? 'Processing Details...' : 'Save Complete Seller Identity'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Add Fixed Item / Product</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Item Name" 
                      value={newInvItem.name}
                      onChange={e => setNewInvItem({...newInvItem, name: e.target.value})}
                      className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border-none"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <input 
                      type="text" 
                      placeholder="HSN" 
                      value={newInvItem.hsn}
                      onChange={e => setNewInvItem({...newInvItem, hsn: e.target.value})}
                      className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border-none"
                    />
                  </div>
                  <button 
                    onClick={addInventoryItem}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Inventory List</h4>
                {inventory.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl">
                    <div>
                      <p className="text-xs font-black uppercase">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">HSN: {item.hsn}</p>
                    </div>
                    <button onClick={() => deleteInventoryItem(item.id)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="space-y-4 pt-4">
                <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h4>
                <button 
                  onClick={() => { if(confirm('Sabh kuch delete ho jayega. Sure?')) { localStorage.clear(); window.location.reload(); } }}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" /> Reset App Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300 z-[100]">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Done! Settings Updated.</span>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
