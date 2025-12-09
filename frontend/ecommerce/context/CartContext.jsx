import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Create the Cart Context object
export const CartContext = createContext();

/**
 * Provides shopping cart state and API interaction functions to the application.
 */
export const CartProvider = ({ children }) => {
  // Access the authentication token from AuthContext
  const { token } = useAuth();
  // State to hold the array of items currently in the cart
  const [cartItems, setCartItems] = useState([]);
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // Helper function to fetch the cart contents from the backend
  const fetchCart = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      // Maps the flat backend response structure to the richer frontend product structure
      const formattedCart = Array.isArray(data) ? data.map(item => ({
        ...item.product,        // Includes all product details
        cart_id: item.id,       // Unique ID for the cart entry
        quantity: item.quantity, // Quantity of the product in the cart
        image: item.product.image_url // Maps image_url to image
      })) : [];

      setCartItems(formattedCart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartItems([]);
    }
  };

  // Effect to fetch cart data whenever the authentication token changes (login/logout)
  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      // Clear cart on logout
      setCartItems([]);
    }
  }, [token]);

  // Function to add a product to the cart
  const addToCart = async (product) => {
    if (!token) return false; 

    try {
      // Determine quantity to add
      const qty = product.quantity || 1;

      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST", // POST request to add item
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // Send product ID and quantity
        body: JSON.stringify({ 
            product_id: product.id,
            quantity: qty 
        })
      });

      if (res.ok) {
        fetchCart(); // Re-fetch cart data to update state
        return true; 
      } else {
        console.error("Failed to add to cart");
        return false;
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      return false;
    }
  };

  // Function to update the quantity of an item already in the cart
  const updateQuantity = async (productId, quantity) => {
    // Optimistic update: instantly update local state before API call completes
    setCartItems(prev => prev.map(p => (p.id === productId ? { ...p, quantity } : p)));
    
    const item = cartItems.find(i => i.id === productId);
    if (!item) return; // Exit if item not found

    try {
        await fetch(`${API_BASE_URL}/cart/${item.cart_id}`, {
            method: "PUT", // PUT request to update resource
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ quantity }) // Send new quantity
        });
    } catch (err) {
        console.error("Failed to update quantity", err);
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = async (productId) => {
    if (!token) return;

    const itemToRemove = cartItems.find(item => item.id === productId);
    if (!itemToRemove) return;

    try {
      // DELETE request to remove the cart entry
      await fetch(`${API_BASE_URL}/cart/${itemToRemove.cart_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state by filtering out the removed item
      setCartItems(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Remove cart error:", err);
    }
  };

  // Function to empty the entire shopping cart
  const clearCart = async () => {
    if (!token) return;
    try {
      // DELETE request to the specialized clear endpoint
      await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]); // Clear local state immediately
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    // Provides the cart state and all management functions
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};