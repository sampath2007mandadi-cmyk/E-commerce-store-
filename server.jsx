import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Shield, RefreshCw } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import { getProducts } from "../utils/api.js";

const categories = [
  { label: "Ethnic Wear", value: "ethnic", emoji: "🪔" },
  { label: "Western", value: "western", emoji: "👗" },
  { label: "Casual", value: "casual", emoji: "✨" },
  { label: "Formal", value: "formal", emoji: "🎩" },
];

const features = [
  { Icon: Truck, title: "Free Delivery", desc: "On orders above ₹999" },
  { Icon: Shield, title: "Secure Payment", desc: "Razorpay encrypted" },
  { Icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy" },
  { Icon: Sparkles, title: "Premium Quality", desc: "Curated collections" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ sort: "newest", limit: 8 })
      .then((res) => setFeatured(res.data.products.slice(0, 8)))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(ellipse at 70% 50%, #d4831a22 0%, transparent 70%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center py-20">
          <div>
            <span className="inline-block font-body text-xs tracking-[0.4em] uppercase text-brand-400 mb-6">
              New Collection 2025
            </span>
            <h1 className="section-title text-5xl md:text-7xl mb-6 leading-[1.1]">
              Dress to<br />
              <em className="text-brand-400 not-italic">Define</em> You
            </h1>
            <p className="font-body text-dark-300 text-base leading-relaxed max-w-md mb-8">
              Discover premium clothing that blends timeless elegance with modern sensibility. Every piece tells a story.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight size={14} />
              </Link>
              <Link to="/shop?sort=newest" className="btn-outline">
                New Arrivals
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-80 h-96">
              <div className="absolute inset-0 border border-brand-500/30 translate-x-4 translate-y-4" />
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 to-dark-700 border border-dark-600 flex items-end p-8">
                <div>
                  <p className="font-body text-xs tracking-widest uppercase text-brand-400 mb-2">Featured</p>
                  <p className="font-display text-2xl text-dark-50">Autumn Luxe</p>
                  <p className="font-display text-2xl text-dark-50 italic">Collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-dark-700 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-10 h-10 border border-brand-500/40 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <p className="font-body text-sm font-500 text-dark-100">{title}</p>
                  <p className="font-body text-xs text-dark-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title text-4xl">Shop by Category</h2>
          <div className="w-10 h-0.5 bg-brand-500 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.value} to={`/shop?category=${cat.value}`}
              className="group relative bg-dark-800 border border-dark-600 hover:border-brand-500/50 p-8 text-center transition-all duration-300 hover:bg-dark-700">
              <div className="text-4xl mb-4">{cat.emoji}</div>
              <p className="font-body text-xs tracking-widest uppercase text-dark-200 group-hover:text-brand-400 transition-colors">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-body text-xs tracking-[0.4em] uppercase text-brand-400">Curated For You</span>
            <h2 className="section-title text-4xl mt-2">New Arrivals</h2>
          </div>
          <Link to="/shop" className="nav-link flex items-center gap-2">View All <ArrowRight size={14} /></Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] shimmer rounded" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-dark-400 font-body">
            <p className="text-4xl mb-4">✨</p>
            <p>Products coming soon. Check back later!</p>
          </div>
        )}
      </section>
    </div>
  );
}
