import { useEffect, useState } from "react";
import { MapPin, Plus, X, Loader, Info } from "lucide-react";
import { getSettings, updateDeliverySettings } from "../../utils/api.js";
import toast from "react-hot-toast";

export default function AdminDelivery() {
  const [form, setForm] = useState({
    deliveryEnabled: true, city: "Visakhapatnam",
    centerLat: "17.6868", centerLng: "83.2185", radiusKm: "20",
    deliveryFee: "49", freeDeliveryAbove: "999",
    allowedPincodes: [],
  });
  const [pincodeInput, setPincodeInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then((res) => {
      const d = res.data.delivery;
      if (d && Object.keys(d).length > 0) {
        setForm({ ...form, ...d, allowedPincodes: d.allowedPincodes || [] });
      }
    }).finally(() => setLoading(false));
  }, []);

  const addPincode = () => {
    const p = pincodeInput.trim();
    if (!p || p.length !== 6) { toast.error("Enter a valid 6-digit pincode"); return; }
    if (form.allowedPincodes.includes(p)) { toast.error("Pincode already added"); return; }
    setForm({ ...form, allowedPincodes: [...form.allowedPincodes, p] });
    setPincodeInput("");
  };

  const removePincode = (p) => setForm({ ...form, allowedPincodes: form.allowedPincodes.filter((x) => x !== p) });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDeliverySettings(form);
      toast.success("Delivery settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Save failed");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8"><div className="h-96 shimmer" /></div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-display text-4xl font-light text-dark-50 mb-2">Delivery Zones</h1>
      <p className="font-body text-sm text-dark-400 mb-8">Control where you deliver and your delivery radius</p>

      <div className="space-y-6">
        {/* Enable/disable */}
        <div className="card p-5 flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-500 text-dark-100">Delivery Enabled</p>
            <p className="font-body text-xs text-dark-400 mt-0.5">Turn off to pause all deliveries</p>
          </div>
          <button onClick={() => setForm({ ...form, deliveryEnabled: !form.deliveryEnabled })}
            className={`w-12 h-6 rounded-full transition-colors ${form.deliveryEnabled ? "bg-brand-500" : "bg-dark-600"}`}>
            <div className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${form.deliveryEnabled ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        {/* City and coordinates */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display text-xl text-dark-100">Delivery Radius</h3>
          <div className="bg-dark-700 border border-dark-600 p-3 flex gap-2 text-xs font-body text-dark-300">
            <Info size={14} className="text-brand-400 flex-shrink-0 mt-0.5" />
            Set your store's coordinates and delivery radius. Orders outside this radius will be rejected. Default is set to Visakhapatnam city center.
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Visakhapatnam" className="input-field" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Radius (km)</label>
              <input type="number" value={form.radiusKm} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })} placeholder="20" className="input-field" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Center Latitude</label>
              <input type="number" step="0.0001" value={form.centerLat} onChange={(e) => setForm({ ...form, centerLat: e.target.value })} placeholder="17.6868" className="input-field" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Center Longitude</label>
              <input type="number" step="0.0001" value={form.centerLng} onChange={(e) => setForm({ ...form, centerLng: e.target.value })} placeholder="83.2185" className="input-field" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display text-xl text-dark-100">Delivery Pricing</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Delivery Fee (₹)</label>
              <input type="number" value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} placeholder="49" className="input-field" />
            </div>
            <div>
              <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Free Delivery Above (₹)</label>
              <input type="number" value={form.freeDeliveryAbove} onChange={(e) => setForm({ ...form, freeDeliveryAbove: e.target.value })} placeholder="999" className="input-field" />
            </div>
          </div>
        </div>

        {/* Pincodes */}
        <div className="card p-5 space-y-4">
          <h3 className="font-display text-xl text-dark-100">Allowed Pincodes</h3>
          <p className="font-body text-xs text-dark-400">Optionally whitelist specific pincodes. If empty, radius-based check is used.</p>
          <div className="flex gap-2">
            <input value={pincodeInput} onChange={(e) => setPincodeInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPincode()}
              placeholder="Enter 6-digit pincode" maxLength={6} className="input-field flex-1" />
            <button onClick={addPincode} className="btn-primary flex items-center gap-1.5 py-2 px-4"><Plus size={14} /> Add</button>
          </div>
          {form.allowedPincodes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.allowedPincodes.map((p) => (
                <span key={p} className="flex items-center gap-1.5 bg-dark-700 border border-dark-600 text-dark-200 font-body text-sm px-3 py-1">
                  <MapPin size={12} className="text-brand-400" />{p}
                  <button onClick={() => removePincode(p)} className="text-dark-500 hover:text-red-400 ml-1"><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving && <Loader size={14} className="animate-spin" />} Save Delivery Settings
        </button>
      </div>
    </div>
  );
}
