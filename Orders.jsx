import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, MessageCircle, ExternalLink } from "lucide-react";
import { getSettings } from "../utils/api.js";

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
  website: ExternalLink,
};

export default function Footer() {
  const [social, setSocial] = useState({});
  const [store, setStore] = useState({});

  useEffect(() => {
    getSettings().then((res) => {
      setSocial(res.data.social || {});
      setStore(res.data.store || {});
    }).catch(() => {});
  }, []);

  const socialLinks = Object.entries(social).filter(([, v]) => v);

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-3xl font-light tracking-[0.3em] text-brand-400 uppercase mb-4">VELOUR</div>
            <p className="text-dark-300 font-body text-sm leading-relaxed max-w-xs">
              {store.storeDescription || "Premium clothing crafted with care. Elegance in every thread."}
            </p>
            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socialLinks.map(([platform, url]) => {
                  const Icon = iconMap[platform];
                  if (!Icon) return null;
                  const href = platform === "whatsapp"
                    ? `https://wa.me/${url.replace(/\D/g, "")}`
                    : url.startsWith("http") ? url : `https://${url}`;
                  return (
                    <a key={platform} href={href} target="_blank" rel="noopener noreferrer"
                      className="w-9 h-9 border border-dark-600 flex items-center justify-center text-dark-300 hover:text-brand-400 hover:border-brand-500 transition-all duration-200">
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Shop links */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-brand-400 mb-5">Shop</h4>
            <ul className="space-y-3">
              {["All Products", "New Arrivals", "Ethnic Wear", "Western Wear", "Accessories"].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="text-dark-300 hover:text-brand-400 font-body text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-brand-400 mb-5">Contact</h4>
            <ul className="space-y-3 text-dark-300 font-body text-sm">
              {store.email && <li>{store.email}</li>}
              {store.phone && <li>{store.phone}</li>}
              {store.address && <li className="leading-relaxed">{store.address}</li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-dark-400 font-body text-xs">© {new Date().getFullYear()} VELOUR. All rights reserved.</p>
          <p className="text-dark-500 font-body text-xs">Powered by Razorpay · Secured by Firebase</p>
        </div>
      </div>
    </footer>
  );
}
