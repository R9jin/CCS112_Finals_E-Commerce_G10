import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../api/reviews";
import heartIcon from "../assets/heart.png";
import starIcon from "../assets/star.png";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import styles from "../styles/ProductDetails.module.css";

/**
 * Displays detailed information for a single product, including image, price, 
 * description, and customer reviews.
 * Allows authenticated users to add to cart/wishlist.
 * @param {object} product - The detailed product data object.
 */
function ProductDetails({ product }) {
  // State for the quantity input (defaulting to 1)
  const [quantity, setQuantity] = useState(1);
  // State to show the "Added to cart!" notification
  const [showNotice, setShowNotice] = useState(false);
  // State to manage the loading state of the Add to Cart button
  const [isAdding, setIsAdding] = useState(false);

  // State to store fetched reviews
  const [reviews, setReviews] = useState([]);
  // State for the product's calculated average rating
  const [averageRating, setAverageRating] = useState(product.rating);

  // Context access
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { isLoggedIn } = useAuth();
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Checks if the current product ID exists in the wishlist
  const isWishlisted = wishlistItems.includes(String(product.product_id));

  // Effect to fetch reviews when the component mounts or product changes
  useEffect(() => {
    if (product?.id) {
      getReviews(product.id)
        .then((res) => {
          if (res.success) {
            setReviews(res.data);
            if (res.data.length > 0) {
              // Calculate new average rating from fetched reviews
              const total = res.data.reduce((acc, r) => acc + r.rating, 0);
              setAverageRating((total / res.data.length).toFixed(1));
            }
          }
        })
        .catch(err => console.error("Failed to load reviews", err));
    }
  }, [product]);

  // Handler for adding the product to the cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      // Prompt user to log in and redirect if confirmed
      if(window.confirm("Please log in first to add items to your cart.")) {
        navigate("/login");
      }
      return;
    }

    setIsAdding(true); // Start loading state

    try {
      // Call context function with the selected quantity
      const success = await addToCart({ ...product, quantity });
      
      if (success) {
        setShowNotice(true); // Show success notification
        setTimeout(() => setShowNotice(false), 2000);
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Cart Error:", error);
    } finally {
      setIsAdding(false); // End loading state
    }
  };

  // Handler for toggling the wishlist status
  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
        // Prompt user to log in and redirect if confirmed
        if(window.confirm("Please log in first.")) {
            navigate("/login");
        }
        return;
    }
    // Call context function to add/remove from wishlist
    await toggleWishlist(product.product_id);
  };

  // Display loading state if product data is not yet available
  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.productDetailsPage}>
      <div className={styles.imageGallery}>
        <div className={styles.mainImage}>
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2>{product.name}</h2>
        {/* Formats price to two decimal places */}
        <p className={styles.price}>₱{Number(product.price).toFixed(2)}</p>

        <div className={styles.rating}>
          {/* Renders 5 star icons, filling them based on the average rating */}
          {[...Array(5)].map((_, i) => (
            <img
              key={i}
              src={starIcon}
              className={`${styles.star} ${i < Math.round(averageRating) ? styles.filled : ""}`}
              alt="star"
            />
          ))}
          <span className={styles.reviewCount}>({reviews.length} reviews)</span>
        </div>

        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.actions}>
            {/* Quantity Selector */}
            <div className={styles.productDetailQuantity}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            {/* Add to Cart Button (disabled while loading) */}
            <button 
                className={styles.productDetailAddCart} 
                onClick={handleAddToCart}
                disabled={isAdding} // Disabled during API call
                style={{ opacity: isAdding ? 0.7 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
        </div>
        {/* Success notification */}
        {showNotice && <div className={styles.cartNotice}>Added to cart!</div>}

        {/* Wishlist Toggle Icon */}
        <img
          src={heartIcon}
          className={`${styles.wishlistIcon} ${isWishlisted ? styles.active : ""}`}
          onClick={handleToggleWishlist}
          alt="wishlist"
        />
        
        {/* Customer Reviews Section */}
        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <h3>Customer Reviews</h3>
          {reviews.length === 0 ? (
            <p style={{ color: "#777" }}>No reviews yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {reviews.map((rev) => (
                <li key={rev.id} style={{ marginBottom: "15px", borderBottom: "1px solid #f0f0f0", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Displays user name or "Anonymous" */}
                    <strong>{rev.user?.name || "Anonymous"}</strong>
                    <span style={{ color: "#ff4b2b", fontWeight: "bold" }}>
                      {rev.rating} ★ {/* Displays rating */}
                    </span>
                  </div>
                  <p style={{ margin: "5px 0", color: "#555" }}>{rev.comment}</p>
                  {/* Formats and displays review date */}
                  <small style={{ color: "#999" }}>
                    {new Date(rev.created_at).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;