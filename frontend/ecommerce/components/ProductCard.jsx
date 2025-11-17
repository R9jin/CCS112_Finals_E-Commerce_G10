import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css";

import starIcon from "../assets/star.png";
import cartIcon from "../assets/cart.png";
import heartIcon from "../assets/heart.png";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();

  const fullStars = Math.round(product.rating);
  const [showNotice, setShowNotice] = useState(false);
  const isWishlisted = wishlistItems.includes(product.id);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to add items to your cart.");
      return;
    }

    try {
      await addToCart({ ...product, quantity: 1 });
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 3000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Could not add item to cart. Try again.");
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      alert("Please log in first to manage your wishlist.");
      return;
    }

    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      alert("Could not update wishlist. Try again.");
    }
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <Link to={`/product/${product.id}`}>
          <img src={process.env.PUBLIC_URL + product.image_url} alt={product.name} />
        </Link>
      </div>

      <div className={styles.productDetails}>
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              alt="star"
              className={`${styles.star} ${i < fullStars ? styles.filled : styles.unfilled}`}
            />
          ))}
        </div>

        <Link to={`/product/${product.id}`} className={styles.productName}>
          <h3>{product.name}</h3>
        </Link>

        <p className={styles.productPrice}>₱{product.price}</p>

        <div className={styles.productFooter}>
          <span className={styles.sold}>{product.sold ? `${product.sold} Sold` : "0 Sold"}</span>
          <div className={styles.icons}>
            <img
              src={heartIcon}
              alt="wishlist"
              className={`${styles.wishIcon} ${isWishlisted ? styles.active : ""}`}
              onClick={handleToggleWishlist}
            />
            <img
              src={cartIcon}
              alt="cart"
              className={`${styles.cartIcon} ${showNotice ? styles.active : ""}`}
              onClick={handleAddToCart}
            />
          </div>
        </div>

        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}
      </div>
    </div>
  );
}

export default ProductCard;
