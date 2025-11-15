import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetch(`http://127.0.0.1:8000/api/wishlist`, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    })
      .then(res => res.json())
      .then(data => setWishlistItems(data))
      .catch(() => setWishlistItems([]));
  }, [currentUser]);

  const addToWishlist = async (productId) => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.token}`
      },
      body: JSON.stringify({ product_id: productId })
    });
    setWishlistItems(prev => [...prev, productId]);
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;
    await fetch(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    setWishlistItems(prev => prev.filter(id => id !== productId));
  };

  const toggleWishlist = (productId) => {
    wishlistItems.includes(productId) ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
