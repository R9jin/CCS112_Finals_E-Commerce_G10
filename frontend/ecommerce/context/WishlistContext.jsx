import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]); // array of product_id strings
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  useEffect(() => {
    if (!currentUser?.token) return;

    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch wishlist");

        const data = await res.json();
        setWishlistItems(data.map(item => String(item.product_id)));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [currentUser]);

  const addToWishlist = async (productId) => {
    if (!currentUser?.token) return false;
    const id = String(productId);

    // Optimistic update
    setWishlistItems(prev => [...prev, id]);

    try {
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ product_id: id }),
      });

      if (res.status === 409) {
        // already in wishlist, ignore
        return true;
      }

      if (!res.ok) throw new Error("Failed to add to wishlist");

      return true;
    } catch (err) {
      console.error("Add wishlist error:", err);
      // rollback optimistic update
      setWishlistItems(prev => prev.filter(pid => pid !== id));
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!currentUser?.token) return false;
    const id = String(productId);

    // Optimistic update
    setWishlistItems(prev => prev.filter(pid => pid !== id));

    try {
      // fetch wishlist to find record id
      const res = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      const data = await res.json();
      const record = data.find(item => String(item.product_id) === id);
      if (!record) return true; // already gone

      const deleteRes = await fetch(`${API_BASE_URL}/wishlist/${record.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });
      if (!deleteRes.ok) throw new Error("Failed to remove");

      return true;
    } catch (err) {
      console.error("Remove wishlist error:", err);
      // rollback optimistic update
      setWishlistItems(prev => [...prev, id]);
      return false;
    }
  };

  const toggleWishlist = async (productId) => {
    const id = String(productId);
    return wishlistItems.includes(id)
      ? await removeFromWishlist(id)
      : await addToWishlist(id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
