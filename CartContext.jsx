import { useEffect, useState } from "react";
import { MapPin, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "../../utils/api.js";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-yellow-900/40 text-yellow-400 border-yellow-700",
  confirmed: "bg-blue-900/40 text-blue-400 border-blue-700",
  processing: "bg-purple-900/40 text-purple-400 border-purple-700",
  shipped: "bg-brand-900/40 text-brand-400 border-brand-700",
  delivered: "bg-green-900/40 text-green-400 border-green-700",
  cancelled: "bg-red-900/40 text-red-400 border-red-700",
};

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    const params = filterStatus !== "all" ? { status: filterStatus } : {};
    getAllOrders(params).then((res) => setOrders(res.data.orders)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleStatusUpdate = async (orderId, status, trackingId) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, status, trackingId);
      toast.success("Status updated!");
      load();
    } catch { toast.error("Update failed"); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl font-light text-dark-50">Orders</h1>
        <span className="font-body text-xs text-dark-400">{orders.length} orders</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", ...statuses].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`font-body text-xs tracking-wider uppercase px-4 py-2 border transition-colors capitalize ${filterStatus === s ? "border-brand-500 text-brand-400 bg-brand-500/10" : "border-dark-600 text-dark-400 hover:text-dark-200"}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 shimmer" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 font-body text-dark-400">No orders found</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <div className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-dark-700/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-500 text-dark-100">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="font-body text-xs text-dark-400 truncate">{order.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-body text-sm text-brand-400">₹{order.totalAmount?.toLocaleString()}</span>
                  <span className={`badge border ${statusColors[order.status] || statusColors.pending} capitalize`}>{order.status}</span>
                  <span className="font-body text-xs text-dark-500">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-IN") : "—"}
                  </span>
                  {expanded === order.id ? <ChevronUp size={15} className="text-dark-400" /> : <ChevronDown size={15} className="text-dark-400" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-dark-700 p-5 grid md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-3">Items</p>
                    <div className="space-y-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt={item.name} className="w-10 h-12 object-cover bg-dark-700" />}
                          <div className="font-body text-sm">
                            <p className="text-dark-200">{item.name}</p>
                            <p className="text-dark-400 text-xs">{item.size && `Size: ${item.size}`} ×{item.quantity}</p>
                            <p className="text-brand-400 text-xs">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-3 flex items-center gap-1.5">
                      <MapPin size={12} /> Delivery Address
                    </p>
                    <div className="font-body text-sm text-dark-300 leading-relaxed space-y-1">
                      <p className="text-dark-100 font-500">{order.shippingAddress?.name}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                      <p className="text-dark-400">{order.shippingAddress?.phone}</p>
                    </div>
                  </div>

                  {/* Status update */}
                  <div className="md:col-span-2 border-t border-dark-700 pt-4">
                    <p className="font-body text-xs tracking-widest uppercase text-dark-400 mb-3">Update Status</p>
                    <OrderStatusUpdater order={order} onUpdate={handleStatusUpdate} loading={updatingId === order.id} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusUpdater({ order, onUpdate, loading }) {
  const [status, setStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || "");

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="bg-dark-700 border border-dark-600 text-dark-200 font-body text-sm px-3 py-2 focus:outline-none focus:border-brand-500 capitalize">
          {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>
      {(status === "shipped" || status === "delivered") && (
        <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Tracking ID (optional)" className="input-field w-52 py-2 text-sm" />
      )}
      <button onClick={() => onUpdate(order.id, status, trackingId)} disabled={loading}
        className="btn-primary py-2 flex items-center gap-2 disabled:opacity-50">
        {loading && <Loader size={12} className="animate-spin" />} Update
      </button>
    </div>
  );
}
