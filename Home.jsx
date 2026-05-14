import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { getProduct } from "../utils/api.js";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        setSelectedSize(res.data.sizes?.[0] || "");
        setSelectedColor(res.data.colors?.[0] || "");
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) { toast.error("Please select a size"); return; }
    dispatch({ type: "ADD", item: { id: product.id, name: product.name, price: product.price, image: product.images?.[0], size: selectedSize, color: selectedColor, quantity: qty } });
    toast.success("Added to cart!");
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square shimmer" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 shimmer rounded" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-32 font-body text-dark-400">Product not found.</div>
  );

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 page-enter">
      <Link to="/shop" className="inline-flex items-center gap-2 text-dark-300 hover:text-brand-400 font-body text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div>
          <div className="relative aspect-[3/4] bg-dark-800 overflow-hidden">
            {product.images?.length > 0 ? (
              <img src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-dark-400 font-body">No Image</div>
            )}
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setImgIndex((imgIndex - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-dark-900/80 p-2 hover:bg-dark-800">
                  <ChevronLeft size={18} className="text-dark-200" />
                </button>
                <button onClick={() => setImgIndex((imgIndex + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-900/80 p-2 hover:bg-dark-800">
                  <ChevronRight size={18} className="text-dark-200" />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`w-16 h-20 overflow-hidden border-2 transition-colors ${i === imgIndex ? "border-brand-500" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-body text-xs tracking-widest uppercase text-brand-400 mb-2">{product.category}</p>
          <h1 className="font-display text-4xl font-light text-dark-50 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <span className="font-body text-2xl font-500 text-brand-400">₹{product.price.toLocaleString()}</span>
            {discount > 0 && (
              <>
                <span className="font-body text-dark-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="badge bg-brand-500/20 text-brand-400 border border-brand-500/30">{discount}% off</span>
              </>
            )}
          </div>

          {product.description && (
            <p className="font-body text-dark-300 text-sm leading-relaxed mt-6">{product.description}</p>
          )}

          <div className="w-full h-px bg-dark-700 my-6" />

          {/* Size selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-dark-300 mb-3">
                Size: <span className="text-brand-400">{selectedSize}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 font-body text-sm border transition-all ${selectedSize === s ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-dark-600 text-dark-300 hover:border-dark-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selection */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-dark-300 mb-3">
                Color: <span className="text-brand-400">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 font-body text-sm border transition-all ${selectedColor === c ? "border-brand-500 text-brand-400 bg-brand-500/10" : "border-dark-600 text-dark-300 hover:border-dark-400"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="font-body text-xs tracking-widest uppercase text-dark-300 mb-3">Quantity</p>
            <div className="flex items-center border border-dark-600 w-fit">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-dark-300 hover:text-brand-400 text-lg">−</button>
              <span className="w-10 text-center font-body text-dark-100">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="w-10 h-10 text-dark-300 hover:text-brand-400 text-lg">+</button>
            </div>
          </div>

          {/* Stock */}
          {product.stock <= 5 && product.stock > 0 && (
            <p className="font-body text-xs text-red-400 mb-4">Only {product.stock} left in stock!</p>
          )}

          <button onClick={addToCart} disabled={product.stock === 0}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <ShoppingBag size={16} />
            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </button>

          {product.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-6">
              {product.tags.map((tag) => (
                <span key={tag} className="font-body text-xs text-dark-400 border border-dark-700 px-3 py-1">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
