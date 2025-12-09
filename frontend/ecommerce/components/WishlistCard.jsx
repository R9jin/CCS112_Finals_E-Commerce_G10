import { useState } from "react";
import styles from "../styles/WishlistCard.module.css";

/**
 * Component to display a single product item within the user's wishlist.
 * Provides actions to remove the item, add it to the cart, or buy it directly.
 * @param {object} product - The product data object.
 * @param {function} onRemove - Handler to remove the item from the wishlist.
 * @param {function} onAddCart - Handler to add the item to the cart.
 * @param {function} onBuyNow - Handler to proceed directly to checkout.
 */
function WishlistCard({ product, onRemove, onAddCart, onBuyNow }) {
  // State to show the "Added!" notification status
  const [isAdded, setIsAdded] = useState(false);
  // State to track the loading status during the Add to Cart API call
  const [isAdding, setIsAdding] = useState(false); 

  // Determines the correct image URL source (remote URL vs local asset)
  const imageSrc = product.image_url?.startsWith("http")
    ? product.image_url
    : process.env.PUBLIC_URL + product.image_url;

  // Handler for adding the item to the cart
  const handleAddToCart = async () => {
    setIsAdding(true); // Start loading animation/state
    
    // Calls the parent component's handler (which performs the API call)
    const success = await onAddCart(product);
    setIsAdding(false); // End loading animation/state

    if (success) {
      setIsAdded(true); // Set success status
      setTimeout(() => setIsAdded(false), 2000); // Reset status after 2 seconds
    }
  };

  return (
    <div className={styles.wishlistCard}>
      <div className={styles.wishlistImage}>
        <img src={imageSrc} alt={product.name} />
      </div>

      <div className={styles.wishlistDetails}>
        <p><strong>{product.name}</strong></p>
        <p>{product.description}</p>
        <p>{product.sold ?? 0} sold</p>
      </div>

      {/* Formats price to two decimal places */}
      <div className={styles.wishlistPrice}>₱{Number(product.price).toFixed(2)}</div>

      <div className={styles.wishlistActions}>
        {/* Add to Cart button logic */}
        <button 
          className={`${styles.addCart} ${isAdded ? styles.added : ""}`} 
          onClick={handleAddToCart}
          // Disable button while adding or if already added to prevent duplicate clicks
          disabled={isAdded || isAdding} 
          style={{ opacity: isAdding ? 0.7 : 1, cursor: (isAdded || isAdding) ? 'default' : 'pointer' }}
        >
          {isAdding ? "Adding..." : (isAdded ? "Added!" : "Add to Cart")}
        </button>

        {/* Buy Now button calls parent handler */}
        <button className={styles.buyNow} onClick={() => onBuyNow(product)}>
          Buy Now
        </button>

        {/* Remove button calls parent handler */}
        <button className={styles.removeWishlist} onClick={() => onRemove(product)}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;