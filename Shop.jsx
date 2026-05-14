import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { getMyOrders } from "../utils/api.js";

const statusColors = {
  pending: "bg-yellow-900/40 text-yellow-400 border-yellow-900",
  confirmed: "bg-blue-900/40 text-blue-400 border-blue-900",
  processing: "bg-purple-900/40 text-purple-400 border-purple-900",
  shipped: "bg-brand-900/40 text-brand-400 border-brand-900",
  delivered: "bg-green-900/40 text-green-400 border-green-900",
  cancelled: "bg-red-900/40 text-red-400 border-red-900",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-20 space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="h-24 shimmer" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
      <h1 className="font-display text-4xl font-light text-dark-50 mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="text-dark-600 mx-auto mb-6" />
          <p className="font-display text-2xl text-dark-300">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <div className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-dark-700/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4">
                  <Package size={18} className="text-brand-400 flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm text-dark-200 font-500">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-body text-xs text-dark-400 mt-0.5">
                      {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge border ${statusColors[order.status] || statusColors.pending}`}>
                    {order.status}
                  </span>
                  <span className="font-body font-500 text-brand-400">₹{order.totalAmount?.toLocaleString()}</span>
                  {expanded === order.id ? <ChevronUp size={16} className="text-dark-400" /> : <ChevronDown size={16} className="text-dark-400" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-dark-700 p-5 space-y-4">
                  {/* Items */}
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-3">Items</p>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-dark-700" />}
                          <div className="flex-1 font-body text-sm">
                            <p className="text-dark-200">{item.name}</p>
                            <p className="text-dark-400 text-xs">{item.size && `Size: ${item.size}`} {item.color && `· ${item.color}`} · Qty: {item.quantity}</p>
                          </div>
                          <span className="font-body text-sm text-dark-200">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping address */}
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-2">Delivery To</p>
                    <p className="font-body text-sm text-dark-300 leading-relaxed">
                      {order.shippingAddress?.name}, {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  {order.trackingId && (
                    <div>
                      <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-1">Tracking ID</p>
                      <p className="font-body text-sm text-brand-400">{order.trackingId}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
