import { createContext, useState, useEffect } from "react";

export const ProductsContext = createContext();

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Optionally: function to refresh products from API
  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to refresh products:", err);
    }
  };

  return (
    <ProductsContext.Provider value={{ products, refreshProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};
