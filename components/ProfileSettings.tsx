
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  ShieldCheck, 
  Camera, 
  Save, 
  Trash2, 
  Bell, 
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Package,
  Plus,
  Hash
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
  const [personal, setPersonal] = useState({
    name: user?.name || '',
    email: user?.email || '',
    photo: user?.photo || '',
    bio: 'ProTools Premium User'
  });

  const [business, setBusiness] = useState({
    name: '',
    gst: '',
    addr: '',
    mobile: '',
    logo: null as string | null,
    sign: null as string | null
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newInvItem, setNewInvItem] = useState({ name: '', hsn: '' });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const savedBiz = localStorage.getItem('protools_biz_profile');
    if (savedBiz) setBusiness(JSON.parse(savedBiz));

    const savedInv = localStorage.getItem('protools_inventory');
    if (savedInv) setInventory(JSON.parse(savedInv));
  }, []);

  const handleSavePersonal = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...personal });
      setIsSaving(false);
      triggerToast();
    }, 800);
  };

  const handleSaveBusiness = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('protools_biz_profile', JSON.stringify(business));
      setIsSaving(false);
      triggerToast();
    }, 800);
  };

  const addInventoryItem = () => {
    if (!newInvItem.name) return;
    const updated = [...inventory, { ...newInvItem, id: Date.now().toString() }];
    setInventory(updated);
    localStorage.setItem('protools_inventory', JSON.stringify(updated));
    setNewInvItem({ name: '', hsn: '' });
    triggerToast();
  };

  const deleteInventoryItem = (id: string) => {
    const updated = inventory.filter(item => item.id !== id);
    setInventory(updated);
    localStorage.setItem('protools_inventory', JSON.stringify(updated));
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'sign' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const data = ev.target?.result as string;
        if (field === 'photo') setPersonal({ ...personal, photo: data });
        else setBusiness({ ...business, [field]: data });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-48 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute -bottom-12 left-10 flex items-end gap-6">
          <div className="relative group">
            <img 
              src={personal.photo} 
              className="w-32 h-32 rounded-[2.5rem] border-8 border-white dark:border-slate-800 shadow-xl object-cover" 
              alt="Profile" 
            />
            <label className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-all">
              <Camera className="w-4 h-4" />
              <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'photo')} />
            </label>
          </div>
          <div className="mb-14">
            <h2 className="text-3xl font-black text-white drop-shadow-md">{personal.name || 'User Name'}</h2>
            <p className="text-indigo-100 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3" /> Professional Account
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-16">
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'personal', icon: <User className="w-4 h-4" />, label: 'Personal Info' },
            { id: 'business', icon: <Building2 className="w-4 h-4" />, label: 'Business (GST)' },
            { id: 'inventory', icon: <Package className="w-4 h-4" />, label: 'Inventory (Fix Items)' },
            { id: 'security', icon: <ShieldCheck className="w-4 h-4" />, label: 'Security' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm min-h-[400px]">
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input type="text" value={personal.name} onChange={e => setPersonal({...personal, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                  <input type="email" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
              </div>
              <button onClick={handleSavePersonal} disabled={isSaving} className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                <Save className="w-4 h-4" /> {isSaving ? 'Updating...' : 'Save Personal Details'}
              </button>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Registered Business Name</label>
                  <input type="text" placeholder="e.g. My Agency LLC" value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">GSTIN Number</label>
                  <input type="text" placeholder="22AAAAA0000A1Z5" value={business.gst} onChange={e => setBusiness({...business, gst: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Business Address</label>
                  <textarea value={business.addr} onChange={e => setBusiness({...business, addr: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold h-24 resize-none" />
                </div>
              </div>
              <button onClick={handleSaveBusiness} disabled={isSaving} className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Business Profile'}
              </button>
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
                      placeholder="Item Name (e.g. Software Service)" 
                      value={newInvItem.name}
                      onChange={e => setNewInvItem({...newInvItem, name: e.target.value})}
                      className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="w-full sm:w-32">
                    <input 
                      type="text" 
                      placeholder="HSN Code" 
                      value={newInvItem.hsn}
                      onChange={e => setNewInvItem({...newInvItem, hsn: e.target.value})}
                      className="w-full p-3 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={addInventoryItem}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Saved Items List</h4>
                {inventory.length === 0 ? (
                  <div className="py-10 text-center bg-slate-50 dark:bg-slate-800/20 rounded-3xl">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No fixed items saved.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {inventory.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl group hover:border-indigo-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs uppercase">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">{item.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Hash className="w-2.5 h-2.5" /> HSN: {item.hsn || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteInventoryItem(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="space-y-4 pt-4 border-t dark:border-slate-800">
                <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-red-500">
                  <AlertTriangle className="w-4 h-4" /> Danger Zone
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                  Resetting your data will delete all local history, saved parties, and business settings.
                </p>
                <button 
                  onClick={() => { if(confirm('Sabh data delete ho jayega. Continue?')) { localStorage.clear(); window.location.reload(); } }}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Reset All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Done! Settings updated.</span>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
