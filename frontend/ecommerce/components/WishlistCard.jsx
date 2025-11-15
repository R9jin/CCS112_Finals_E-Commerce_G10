import React from "react";
import styles from "../styles/WishlistCard.module.css";

/**
 * WishlistCard Component
 *
 * Displays a single product in the user's wishlist, showing its image, details,
 * price, and action buttons for adding to cart, buying immediately, or removing.
 */
function WishlistCard({ product, onRemove, onAddCart, onBuyNow }) {
  return (
    <div className={styles.wishlistCard}>
      {/* Product image section */}
      <div className={styles.wishlistImage}>
        <img src={product.image} alt={product.name} />
      </div>

      {/* Product details section */}
      <div className={styles.wishlistDetails}>
        <p><strong>{product.name}</strong></p>
        <p>{product.description}</p>
        <p>{product.stock} item(s) left</p>
      </div>

      {/* Product price */}
      <div className={styles.wishlistPrice}>₱{product.price}</div>

      {/* Action buttons */}
      <div className={styles.wishlistActions}>
        <button
          className={styles.addCart}
          onClick={() => onAddCart && onAddCart(product)}
        >
          Add to Cart
        </button>

        <button
          className={styles.buyNow}
          onClick={() => onBuyNow && onBuyNow(product)}
        >
          Buy Now
        </button>

        <button
          className={styles.removeWishlist}
          onClick={() => onRemove && onRemove(product)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;
