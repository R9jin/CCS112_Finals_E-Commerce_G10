import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// Create the Wishlist Context object
export const WishlistContext = createContext();

/**
 * Provides the user's wishlist state and functions to manage it (add, remove, toggle).
 */
export const WishlistProvider = ({ children }) => {
  // Access the authentication token from AuthContext
  const { token } = useAuth();
  // State to hold the array of product IDs currently in the wishlist
  const [wishlistItems, setWishlistItems] = useState([]); 
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // Effect runs on mount and whenever the token changes (login/logout)
  useEffect(() => {
    // Clear wishlist state if user logs out
    if (!token) {
        setWishlistItems([]);
        return;
    }

    // Function to fetch the current wishlist from the backend
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }, // Use token for authorized fetch
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        // Store only the product IDs (as strings) for easy checking
        setWishlistItems(data.map(item => String(item.product_id)));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [token]); // Dependency array ensures re-run on token change

  // Function to add a product to the wishlist
  const addToWishlist = async (productId) => {
    if (!token) return false;
    const id = String(productId);

    // Optimistic Update: Add to UI immediately
    setWishlistItems(prev => [...prev, id]);

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        method: "POST", // POST request to add item
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use token
        },
        body: JSON.stringify({ product_id: id }), // Send product ID
      });

      // Status 409 (Conflict) usually means the item was already present
      if (res.status === 409) return true;
      if (!res.ok) throw new Error("Failed to add to wishlist");
      return true;
    } catch (err) {
      console.error("Add wishlist error:", err);
      // Revert change if API call fails
      setWishlistItems(prev => prev.filter(pid => pid !== id));
      return false;
    }
  };

  // Function to remove a product from the wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) return false;
    const id = String(productId);

    // Optimistic Update: Remove from UI immediately
    setWishlistItems(prev => prev.filter(pid => pid !== id));

    try {
      // DELETE request using a product ID-based endpoint
      const res = await fetch(`${API_BASE_URL}/wishlist/product/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Failed to remove");
      return true;
    } catch (err) {
      console.error("Remove wishlist error:", err);
      // Revert change if it failed
      setWishlistItems(prev => [...prev, id]);
      return false;
    }
  };

  // Function to toggle the wishlist status (add if absent, remove if present)
  const toggleWishlist = async (productId) => {
    const id = String(productId);
    return wishlistItems.includes(id)
      ? await removeFromWishlist(id) // If present, remove
      : await addToWishlist(id);    // If absent, add
  };

  return (
    // Provides the state and all management functions to consumers
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};