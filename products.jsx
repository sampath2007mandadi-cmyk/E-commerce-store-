import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find(
        (i) => i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
              ? { ...i, quantity: i.quantity + (action.item.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => !(i.id === action.id && i.size === action.size && i.color === action.color)) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id && i.size === action.size && i.color === action.color
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] }, (init) => {
    try {
      const saved = localStorage.getItem("velour_cart");
      return saved ? JSON.parse(saved) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem("velour_cart", JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
