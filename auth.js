import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Check, Loader } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { createOrder, checkDelivery } from "../utils/api.js";
import { initiatePayment } from "../utils/razorpay.js";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, dispatch, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.displayName || "", email: user?.email || "",
    phone: "", address: "", city: "", pincode: "", state: "",
  });
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [loading, setLoading] = useState(false);

  const shipping = totalAmount >= 999 ? 0 : 99;
  const total = totalAmount + shipping;

  const handleCheckDelivery = async () => {
    if (!form.pincode || form.pincode.length < 6) { toast.error("Enter a valid pincode"); return; }
    setCheckingDelivery(true);
    try {
      const res = await checkDelivery({ pincode: form.pincode, city: form.city });
      setDeliveryStatus(res.data);
    } catch {
      setDeliveryStatus({ available: true, message: "Delivery available" });
    } finally {
      setCheckingDelivery(false);
    }
  };

  const handlePlaceOrder = async () => {
    const required = ["name", "email", "phone", "address", "city", "pincode", "state"];
    for (const field of required) {
      if (!form[field]) { toast.error(`Please fill in ${field}`); return; }
    }
    if (deliveryStatus && !deliveryStatus.available) {
      toast.error("Delivery not available to your location"); return;
    }

    setLoading(true);
    try {
      // Create order in DB first
      const orderData = {
        items: cart.items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, size: i.size, color: i.color, image: i.image })),
        shippingAddress: form,
        totalAmount: total,
      };
      const orderRes = await createOrder(orderData);
      const orderId = orderRes.data.id;

      // Initiate Razorpay
      initiatePayment({
        amount: total,
        description: `VELOUR Order #${orderId}`,
        prefill: { name: form.name, email: form.email, phone: form.phone },
        onSuccess: async (paymentId, razorpayOrderId) => {
          dispatch({ type: "CLEAR" });
          toast.success("Order placed successfully! 🎉");
          navigate("/orders");
          setLoading(false);
        },
        onFailure: (msg) => {
          toast.error(msg || "Payment failed");
          setLoading(false);
        },
      });
    } catch (err) {
      toast.error(err.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
      <h1 className="font-display text-4xl font-light text-dark-50 mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipping form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="font-display text-xl text-dark-50 mb-6">Delivery Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Full Name", placeholder: "Your full name" },
                { key: "email", label: "Email", placeholder: "you@email.com", type: "email" },
                { key: "phone", label: "Phone", placeholder: "+91 9999999999", type: "tel" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
                  <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">{label}</label>
                  <input type={type || "text"} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="input-field" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Address</label>
                <textarea placeholder="House no, Street, Area" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">City</label>
                <input type="text" placeholder="Visakhapatnam" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">Pincode</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="530001" value={form.pincode} maxLength={6}
                    onChange={(e) => { setForm({ ...form, pincode: e.target.value }); setDeliveryStatus(null); }}
                    className="input-field flex-1" />
                  <button onClick={handleCheckDelivery} disabled={checkingDelivery}
                    className="bg-dark-600 hover:bg-dark-500 text-dark-200 px-3 text-xs font-body flex items-center gap-1 transition-colors disabled:opacity-50">
                    {checkingDelivery ? <Loader size={12} className="animate-spin" /> : <MapPin size={12} />}
                    Check
                  </button>
                </div>
                {deliveryStatus && (
                  <p className={`font-body text-xs mt-2 flex items-center gap-1 ${deliveryStatus.available ? "text-green-400" : "text-red-400"}`}>
                    {deliveryStatus.available ? <Check size={12} /> : "✕"} {deliveryStatus.message}
                  </p>
                )}
              </div>
              <div>
                <label className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2 block">State</label>
                <input type="text" placeholder="Andhra Pradesh" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })} className="input-field" />
              </div>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="card p-6 h-fit sticky top-24">
          <h3 className="font-display text-xl text-dark-50 mb-4">Your Order</h3>
          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between font-body text-sm text-dark-300">
                <span className="truncate pr-2">{item.name} {item.size && `(${item.size})`} ×{item.quantity}</span>
                <span className="text-dark-100 flex-shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-600 pt-3 space-y-2 font-body text-sm">
            <div className="flex justify-between text-dark-300">
              <span>Subtotal</span><span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-dark-300">
              <span>Shipping</span><span>{shipping === 0 ? <span className="text-green-400">FREE</span> : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-500 text-dark-100 border-t border-dark-600 pt-2">
              <span>Total</span><span className="text-brand-400 text-base">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button onClick={handlePlaceOrder} disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader size={14} className="animate-spin" /> : null}
            Pay ₹{total.toLocaleString()} with Razorpay
          </button>
          <p className="font-body text-xs text-dark-500 text-center mt-3">🔒 Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}
