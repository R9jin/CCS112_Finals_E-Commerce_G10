import { createContext, useState, useEffect } from "react";

export const ProductsContext = createContext();

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products across all paginated pages
  const fetchAllProducts = async () => {
    try {
      let allProducts = [];
      let page = 1;
      let totalPages = 1;

      do {
        const res = await fetch(`${API_BASE_URL}/products?page=${page}`);
        const json = await res.json();

        // Convert price and rating to numbers
        const productArray = Array.isArray(json.data?.data)
          ? json.data.data.map(p => ({
              ...p,
              price: Number(p.price),
              rating: Number(p.rating),
            }))
          : [];

        allProducts = [...allProducts, ...productArray];
        totalPages = json.data?.last_page || 1;
        page++;
      } while (page <= totalPages);

      setProducts(allProducts);
      console.log("Loaded all products:", allProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const refreshProducts = async () => {
    setLoading(true);
    await fetchAllProducts();
  };

  return (
    <ProductsContext.Provider value={{ products, refreshProducts, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};
