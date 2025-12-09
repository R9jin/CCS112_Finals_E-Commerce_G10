import { Link } from "react-router-dom";
import styles from "../styles/CategoryCards.module.css";

/**
 * Component to display interactive cards for various food categories.
 */
function CategoryCards() {
  // Array defining the food categories, their names, and image paths
  const categories = [
    { name: "Appetizers", img: `${process.env.PUBLIC_URL}/assets/appetizers/dynamite-lumpia.jpeg` },
    { name: "Main Course", img: `${process.env.PUBLIC_URL}/assets/mainCourse/chicken-adobo.jpeg` },
    { name: "Desserts", img: `${process.env.PUBLIC_URL}/assets/desserts/leche-flan.jpg` },
    { name: "Street Foods", img: `${process.env.PUBLIC_URL}/assets/streetFoods/bananacue.jpg` },
    { name: "Drinks", img: `${process.env.PUBLIC_URL}/assets/drinks/bukoPandan.jpg` }
  ];

  return (
    <div className={styles.categoryContainer}>
      <h2 className={styles.categoryTitle}>CATEGORIES</h2>
      <div className={styles.categoryGrid}>
        {/* Map through the categories array to render a card for each */}
        {categories.map((cat) => (
          <Link
            key={cat.name}
            // Dynamic link: navigates to /category and uses a URL hash for scrolling/filtering
            to={`/category#${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
            className={styles.categoryCard}
          >
            <div className={styles.imagePlaceholder}>
              <img src={cat.img} alt={cat.name} />
            </div>
            <p>{cat.name}</p> {/* Category name displayed below the image */}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryCards;