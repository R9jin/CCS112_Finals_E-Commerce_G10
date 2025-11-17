import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductsContext } from "../context/ProductsContext";
import ProductDetails from "../components/ProductDetails";

function ProductDetailsPage() {
  const { id } = useParams();
  const { products, loading } = useContext(ProductsContext);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading product...
      </h2>
    );
  }

  // Normalize the product ID type (Laravel might return numeric or string)
  const product = products.find((p) => String(p.id) === String(id));

  if (!product) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Product not found
      </h2>
    );
  }

  return <ProductDetails product={{ ...product, image: product.image_url }} />;
}

export default ProductDetailsPage;
