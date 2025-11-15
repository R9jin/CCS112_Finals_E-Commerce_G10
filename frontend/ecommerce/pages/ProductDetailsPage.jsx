import { useParams } from "react-router-dom"; // For accessing URL parameters
import products from "../data/products.json"; // Static product data
import ProductDetails from "../components/ProductDetails"; // Component to display product info

function ProductDetailsPage() {
  // Extract the "id" parameter from the URL
  const { id } = useParams();

  // Find the product in the JSON data that matches the URL ID
  const product = products.find((p) => p.id === id);

  // If no matching product is found, show a "not found" message
  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Product not found
      </h2>
    );
  }

  // Render the ProductDetails component with the found product
  return <ProductDetails product={product} />;
}

export default ProductDetailsPage;
