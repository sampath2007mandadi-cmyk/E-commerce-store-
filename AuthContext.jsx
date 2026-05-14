import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, MapPin, Share2, Settings, LogOut, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const navItems = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", Icon: Package },
  { to: "/admin/orders", label: "Orders", Icon: ShoppingBag },
  { to: "/admin/delivery", label: "Delivery Zones", Icon: MapPin },
  { to: "/admin/social", label: "Social Links", Icon: Share2 },
  { to: "/admin/settings", label: "Store Settings", Icon: Settings },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-dark-900">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-800 border-r border-dark-700 flex flex-col">
        <div className="p-6 border-b border-dark-700">
          <div className="font-display text-xl font-light tracking-[0.3em] text-brand-400 uppercase">VELOUR</div>
          <p className="font-body text-xs text-dark-400 mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 font-body text-sm transition-colors ${
                  isActive ? "text-brand-400 bg-brand-500/10 border-l-2 border-brand-500" : "text-dark-300 hover:text-dark-100 hover:bg-dark-700"
                }`}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700 space-y-1">
          <NavLink to="/" className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-dark-300 hover:text-brand-400 transition-colors">
            <ChevronLeft size={16} /> Back to Store
          </NavLink>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 font-body text-sm text-dark-300 hover:text-red-400 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
