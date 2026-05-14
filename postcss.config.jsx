import { useEffect, useState } from "react";
import { Loader, Store } from "lucide-react";
import { getSettings, updateStoreSettings } from "../../utils/api.js";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [form, setForm] = useState({ storeName: "VELOUR", storeDescription: "", email: "", phone: "", address: "", currency: "INR" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((res) => { if (res.data.store) setForm({ ...form, ...res.data.store }); }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateStoreSettings(form);
      toast.success("Store settings saved!");
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-8"><div className="h-96 shimmer" /></div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-4xl font-light text-dark-50 mb-2">Store Settings</h1>
      <p className="font-body text-sm text-dark-400 mb-8">Basic information about your store</p>

      <div className="card p-6 space-y-5">
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Store Name</label>
          <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} placeholder="VELOUR" className="input-field" />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Store Description</label>
          <textarea value={form.storeDescription} onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
            rows={3} placeholder="Premium clothing crafted with care..." className="input-field resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="store@email.com" className="input-field" />
          </div>
          <div>
            <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9999999999" className="input-field" />
          </div>
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Address</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            rows={2} placeholder="Your store address..." className="input-field resize-none" />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Logo URL</label>
          <input value={form.logo || ""} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Currency</label>
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-field">
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-primary mt-6 flex items-center gap-2 disabled:opacity-50">
        {saving && <Loader size={14} className="animate-spin" />} Save Settings
      </button>

      <div className="mt-8 card p-5 border-brand-500/20 bg-brand-900/10">
        <p className="font-body text-xs tracking-widest uppercase text-brand-400 mb-3">Admin Setup Reminder</p>
        <p className="font-body text-xs text-dark-300 leading-relaxed">
          To add a new admin, go to your Firebase Console → Firestore → <code className="text-brand-400">admins</code> collection → Add a document with the user's UID, set <code className="text-brand-400">isAdmin: true</code>.
        </p>
      </div>
    </div>
  );
}
