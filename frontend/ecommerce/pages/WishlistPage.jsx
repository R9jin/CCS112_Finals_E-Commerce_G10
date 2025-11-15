import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import styles from "../styles/WishlistPage.module.css";
import productsData from "../data/products.json";

export default function WishListPage() {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate(); // ✅ hook for React Router navigation

  useEffect(() => {
    setAllProducts(productsData);
  }, []);

  const wishlistProducts = allProducts.filter((p) =>
    wishlistItems.includes(p.id)
  );

  const handleAddCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    addToCart({ ...product, quantity: 1 });
    navigate("/checkout"); // ✅ navigate without reloading
  };

  return (
    <main className={styles.wishlistPage}>
      {wishlistProducts.length === 0 ? (
        <p className={styles.emptyMessage}>No wishlisted items yet.</p>
      ) : (
        wishlistProducts.map((product) => (
          <WishlistCard
            key={product.id}
            product={product}
            onRemove={() => removeFromWishlist(product.id)}
            onAddCart={() => handleAddCart(product)}
            onBuyNow={() => handleBuyNow(product)}
          />
        ))
      )}
    </main>
  );
}
