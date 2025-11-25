import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ FIX: Only destructure 'token', remove 'currentUser' to fix ESLint warning
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // Helper function to fetch and format cart data
  const fetchCart = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // Map backend structure { id, product: {...} } to frontend structure
      const formattedCart = Array.isArray(data) ? data.map(item => ({
        ...item.product,        // Spread product details (name, price, etc)
        cart_id: item.id,       // Keep cart ID for removal
        quantity: 1,            // Default quantity (since DB doesn't have it yet)
        image: item.product.image_url // Map image_url to image
      })) : [];

      setCartItems(formattedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    }
  };

  // Load cart when token changes
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [token]);

  const addToCart = async (product) => {
    if (!token) return; 

    try {
      await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // Backend expects 'product_id' (integer DB ID)
        body: JSON.stringify({ product_id: product.id })
      });

      // Re-fetch cart to get the full list with product details
      fetchCart(); 
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    // Frontend-only update since DB doesn't have quantity column in migration yet
    setCartItems(prev => prev.map(p => (p.id === productId ? { ...p, quantity } : p)));
  };

  const removeFromCart = async (productId) => {
    if (!token) return;

    // Find the cart_id (relationship ID) not the product ID
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (!itemToRemove) return;

    try {
      await fetch(`${API_BASE_URL}/cart/${itemToRemove.cart_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update UI
      setCartItems(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};