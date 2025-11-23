import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistCard from "../components/WishlistCard";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/WishlistPage.module.css";

export default function WishListPage() {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/products");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const wishlistProducts = allProducts.filter(p =>
    wishlistItems.some(i => i.productId === String(p.product_id))
  );

  const handleAddCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    addToCart({ ...product, quantity: 1 });
    navigate("/checkout");
  };

  return (
    <main className={styles.wishlistPage}>
      {wishlistProducts.length === 0 ? (
        <p className={styles.emptyMessage}>No wishlisted items yet.</p>
      ) : (
        wishlistProducts.map((product) => (
          <WishlistCard
            key={product.product_id}
            product={product}
            onRemove={() => removeFromWishlist(product.product_id)}
            onAddCart={() => handleAddCart(product)}
            onBuyNow={() => handleBuyNow(product)}
          />
        ))
      )}
    </main>
  );
}
