import { useState } from "react";
import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import search from "../assets/search.png";
import styles from "../styles/Navbar.module.css";

/**
 * Main navigation bar component with search, hamburger menu, and navigation links.
 */
function Navbar() {
  // State for the search input value
  const [query, setQuery] = useState("");
  // State to control the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Handler for search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      // Navigate to /search and pass the query as a URL parameter
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsMenuOpen(false); // Close menu after searching
    }
  };

  // Toggles the mobile menu open/closed state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Explicitly closes the mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handler to navigate back one step in browser history
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <nav className={styles.navBar}>
      <div className={styles.navHeader}>
        {/* Back navigation button */}
        <button className={styles.backBtn} onClick={handleGoBack} aria-label="Go Back">
          &#8592;
        </button>

        {/* Site title links to home page */}
        <Link to="/" className={styles.siteTitle} onClick={closeMenu}>
          <strong>Food</strong>Fresh
        </Link>

        {/* Hamburger icon/button for mobile menu toggle */}
        <button 
          className={styles.hamburger} 
          onClick={toggleMenu} 
          aria-label="Toggle navigation"
        >
          {/* Spans are styled to transform into an 'X' when menu is open */}
          <span className={styles.bar} style={isMenuOpen ? {transform: 'rotate(45deg) translate(5px, 6px)'} : {}}></span>
          <span className={styles.bar} style={isMenuOpen ? {opacity: 0} : {}}></span>
          <span className={styles.bar} style={isMenuOpen ? {transform: 'rotate(-45deg) translate(5px, -6px)'} : {}}></span>
        </button>
      </div>

      {/* Navigation links and search container. 'active' class controls visibility */}
      <div className={`${styles.navLinksContainer} ${isMenuOpen ? styles.active : ""}`}>
        <form className={styles.searchContainer} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchBar}
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update search query state
          />
          <button className={styles.searchBtn} type="submit" aria-label="Search">
            <img src={search} alt="" className={styles.searchImg} />
          </button>
        </form>

        <ul className={styles.navList}>
          {/* CustomLink component handles active state styling */}
          <CustomLink to="/home" onClick={closeMenu}>Home</CustomLink>
          <CustomLink to="/category" onClick={closeMenu}>Category</CustomLink>
          <CustomLink to="/profile" onClick={closeMenu}>Profile</CustomLink>
          <CustomLink to="/wishlist" onClick={closeMenu}>Wishlist</CustomLink>
          <CustomLink to="/cart" onClick={closeMenu}>Cart</CustomLink>
        </ul>
      </div>
    </nav>
  );
}

/**
 * Helper component for navigation links that applies an active class based on the current route.
 */
function CustomLink({ to, children, onClick, ...props }) {
  // Resolves the full path
  const resolvedPath = useResolvedPath(to);
  // Checks if the current URL path exactly matches the 'to' prop
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}>
      <Link to={to} className={styles.navLink} onClick={onClick} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;