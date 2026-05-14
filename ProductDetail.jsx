import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, LogOut, Package, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
    setProfileOpen(false);
  };

  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "New Arrivals", to: "/shop?sort=newest" },
    { label: "Collections", to: "/shop?category=ethnic" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-light tracking-[0.3em] text-brand-400 uppercase">
            VELOUR
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} className="nav-link">{l.label}</Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-dark-200 hover:text-brand-400 transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-dark-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-body font-600">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-2 text-dark-200 hover:text-brand-400 transition-colors"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-brand-500/50" />
                  ) : (
                    <User size={20} />
                  )}
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-800 border border-dark-600 shadow-2xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-dark-600">
                      <p className="text-dark-50 text-sm font-body font-500 truncate">{user.displayName}</p>
                      <p className="text-dark-300 text-xs truncate">{user.email}</p>
                      {isAdmin && <span className="text-brand-400 text-xs font-body tracking-wider uppercase">Admin</span>}
                    </div>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-dark-200 hover:text-brand-400 hover:bg-dark-700 text-sm font-body transition-colors" onClick={() => setProfileOpen(false)}>
                      <Package size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-brand-400 hover:bg-dark-700 text-sm font-body transition-colors" onClick={() => setProfileOpen(false)}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-dark-200 hover:text-red-400 hover:bg-dark-700 text-sm font-body transition-colors">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-link flex items-center gap-1.5">
                <User size={16} /> Sign In
              </Link>
            )}

            {/* Mobile menu */}
            <button className="md:hidden p-2 text-dark-200 hover:text-brand-400" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link py-2" onClick={() => setMobileOpen(false)}>{l.label}</Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-brand-400 tracking-widest uppercase text-xs font-body py-2" onClick={() => setMobileOpen(false)}>Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
}
