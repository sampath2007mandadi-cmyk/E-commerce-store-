import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const defaultSize = product.sizes?.[0] || "";
    const defaultColor = product.colors?.[0] || "";
    dispatch({ type: "ADD", item: { id: product.id, name: product.name, price: product.price, image: product.images?.[0], size: defaultSize, color: defaultColor } });
    toast.success(`${product.name} added to cart`);
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-dark-800 aspect-[3/4]">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark-700">
            <span className="text-dark-400 font-body text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="badge bg-brand-500 text-dark-900">{discount}% OFF</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-dark-900/90 text-dark-200 border border-dark-600">Sold Out</span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="badge bg-red-900/80 text-red-300">Only {product.stock} left</span>
          )}
        </div>

        {/* Quick add */}
        {product.stock > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleQuickAdd}
              className="w-full bg-brand-500 text-dark-900 py-3 font-body text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-brand-400 transition-colors">
              <ShoppingBag size={14} /> Quick Add
            </button>
          </div>
        )}
      </div>

      <div className="pt-3">
        <p className="font-body text-xs text-dark-300 tracking-widest uppercase">{product.category}</p>
        <h3 className="font-display text-lg font-light text-dark-50 mt-0.5 leading-tight group-hover:text-brand-400 transition-colors">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-body font-500 text-brand-400">₹{product.price.toLocaleString()}</span>
          {discount > 0 && (
            <span className="font-body text-dark-400 text-sm line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
