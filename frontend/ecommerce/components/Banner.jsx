import { useLocation } from "react-router-dom";
import banner from "../assets/banner.png";
import styles from "../styles/Banner.module.css";

// Maps specific routes to their corresponding banner title and CSS style
const routeTitles = {
  "/": { title: "SAVORING CULINARY DELIGHTS WITH EVERY CLICK", style: "homeTitle" },
  "/home": { title: "SAVORING CULINARY DELIGHTS WITH EVERY CLICK", style: "homeTitle" },
  "/category": { title: "CATEGORIES", style: "normalTitle" },
  "/profile": { title: "USER ACCOUNT", style: "normalTitle" },
  "/wishlist": { title: "WISHLIST", style: "normalTitle" },
  "/cart": { title: "CART", style: "normalTitle" },
  "/checkout": { title: "CHECKOUT", style: "normalTitle" },
  "/order-history": { title: "ORDER HISTORY", style: "normalTitle" },
  "/admin": { title: "ADMIN PRODUCT MANAGEMENT", style: "normalTitle" },
  "/search": { title: "SEARCH RESULTS", style: "normalTitle" },
};

/**
 * A reusable component that displays a banner image and a title 
 * that dynamically changes based on the current URL path.
 */
function Banner() {
  // Hook to get the current location object
  const location = useLocation();
  const path = location.pathname;

  let bannerTitle, styling;

  // 1. Check for exact route matches
  if (routeTitles[path]) {
    ({ title: bannerTitle, style: styling } = routeTitles[path]);
  // 2. Check for dynamic routes using startsWith
  } else if (path.startsWith("/product/")) {
    bannerTitle = "PRODUCT DETAILS";
    styling = "normalTitle";
  } else if (path.startsWith("/track-order/")) {
    bannerTitle = "TRACK ORDER";
    styling = "normalTitle";
  } else if (path.startsWith("/rate-order/")) {
    bannerTitle = "RATE YOUR ORDER";
    styling = "normalTitle";
  // 3. Default case if no route matches
  } else {
    bannerTitle = "WELCOME TO OUR SHOP";
    styling = "normalTitle";
  }

  // Render the banner image and the dynamically styled title
  return (
    <div className={styles.bannerContainer}>
      <img src={banner} alt="Banner" className={styles.bannerImg} />
      <h1 className={styles[styling]}>{bannerTitle}</h1>
    </div>
  );
}

export default Banner;