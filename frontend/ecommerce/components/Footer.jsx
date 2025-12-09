import React from "react";
import styles from "../styles/Footer.module.css";

/**
 * A simple presentational component for displaying the application footer.
 */
function Footer() {
  // Dynamically gets the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Displays the copyright notice with the current year */}
      <p>© Copyright {currentYear} FoodFresh. Design by Group 10</p>
    </footer>
  );
}

export default Footer;