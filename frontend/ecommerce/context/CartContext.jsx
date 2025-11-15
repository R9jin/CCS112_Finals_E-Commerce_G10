import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from API when user logs in
  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://127.0.0.1:8000/api/cart`, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    })
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(() => setCartItems([]));
  }, [currentUser]);

  const addToCart = async (product) => {
    if (!currentUser) return;
    const res = await fetch(`http://127.0.0.1:8000/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ product_id: product.id, quantity: product.quantity })
    });
    const updatedCart = await res.json();
    setCartItems(updatedCart);
  };

  const updateQuantity = async (id, quantity) => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ quantity })
    });
    setCartItems(prev => prev.map(p => (p.id === id ? { ...p, quantity } : p)));
  };

  const removeFromCart = async (id) => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    setCartItems(prev => prev.filter(p => p.id !== id));
  };

  const clearCart = async () => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/cart/clear`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
