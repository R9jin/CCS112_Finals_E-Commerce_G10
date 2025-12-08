import { createContext, useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  restoreProducts,
  updateProduct
} from "../api/products";
import { useAuth } from "./AuthContext";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const loadProducts = async () => {
    const res = await getProducts();
    if (res.success) setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Call this after checkout to refresh stock
  const refreshStock = async () => {
    await loadProducts();
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        refreshStock,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
