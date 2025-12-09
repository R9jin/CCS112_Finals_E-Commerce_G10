import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css";

import cartIcon from "../assets/cart.png";
import heartIcon from "../assets/heart.png";
import starIcon from "../assets/star.png";

import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

/**
 * Component to display a single product in a grid or list view.
 * It provides functionality to view details, add to cart, and toggle wishlist status.
 * @param {object} product - The product data object passed as a prop.
 */
function ProductCard({ product }) {
  // Destructure functions and state from Contexts
  const { addToCart, cartItems } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth(); // Authentication status

  // Calculate the number of full stars for rating display
  const fullStars = Math.round(product.rating);
  // State for showing the "Added to cart!" notification
  const [showNotice, setShowNotice] = useState(false);

  // Check if the product is in the wishlist (compares product IDs as strings)
  const isWishlisted = wishlistItems.includes(String(product.product_id));
  
  // Check if the product is currently in the cart
  const isInCart = cartItems.some(item => String(item.product_id) === String(product.product_id));

  // Helper to determine the correct image URL source
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url; // Use URL directly for uploaded images
    return process.env.PUBLIC_URL + url;    // Prepend PUBLIC_URL for local assets
  };

  // Handler for adding the product to the cart
  const handleAddToCart = async () => {
      if (!isLoggedIn) {
          alert("Please log in first to add items to your cart.");
          return;
      }
      try {
        // Call the context function to add to cart
        const success = await addToCart({ ...product, quantity: 1 });
        
        if (success) {
          // Show notice upon successful API call
          setShowNotice(true);
          setTimeout(() => setShowNotice(false), 3000);
        } else {
          alert("Could not add item to cart.");
        }
      } catch (err) {
        console.error("Failed to add to cart:", err);
        alert("Could not add item to cart. Try again.");
      }
    };

  // Handler for toggling the wishlist status
  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
        alert("Please log in first to manage your wishlist.");
        return;
    }
    // Call the context function to add/remove from wishlist
    await toggleWishlist(product.product_id); 
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        {/* Link to the product details page */}
        <Link to={`/product/${product.product_id}`}>
          <img src={getImageUrl(product.image_url)} alt={product.name} />
        </Link>
      </div>

      <div className={styles.productDetails}>
        <div className={styles.rating}>
          {/* Renders 5 star icons, filling them based on the product rating */}
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              alt="star"
              className={`${styles.star} ${i < fullStars ? styles.filled : styles.unfilled}`}
            />
          ))}
        </div>

        <Link to={`/product/${product.product_id}`} className={styles.productName}>
          <h3>{product.name}</h3>
        </Link>

        {/* Formats price to two decimal places */}
        <p className={styles.productPrice}>₱{Number(product.price).toFixed(2)}</p>

        <div className={styles.productFooter}>
          <span className={styles.sold}>{product.sold ? `${product.sold} Sold` : "0 Sold"}</span>
          <div className={styles.icons}>
            {/* Wishlist Icon */}
            <img
              src={heartIcon}
              alt="wishlist"
              className={`${styles.wishIcon} ${isWishlisted ? styles.active : ""}`}
              onClick={handleToggleWishlist}
            />
            {/* Cart Icon */}
            <img
              src={cartIcon}
              alt="cart"
              // Active class style is applied if the item is in the cart OR the notice is showing
              className={`${styles.cartIcon} ${isInCart || showNotice ? styles.active : ""}`} 
              onClick={handleAddToCart}
            />
          </div>
        </div>

        {/* Notification displayed briefly after adding to cart */}
        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}
      </div>
    </div>
  );
}

export default ProductCard;