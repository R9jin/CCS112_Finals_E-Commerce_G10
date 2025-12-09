import { createContext, useEffect, useState } from "react";
// Import all necessary product API utility functions
import { createProduct, deleteProduct, getProducts, restoreProducts, updateProduct } from "../api/products";
import { useAuth } from "./AuthContext"; // Import authentication context

// Create the Products Context object
export const ProductsContext = createContext();

/**
 * Provides product data state and management functions for CRUD operations.
 */
export const ProductsProvider = ({ children }) => {
  // Get the authentication token from AuthContext (needed for admin/auth actions)
  const { token } = useAuth();
  // State to hold the array of all products
  const [products, setProducts] = useState([]);

  // Effect runs once on mount to fetch all products for initial display
  useEffect(() => {
    const fetchAll = async () => {
      const res = await getProducts(); // Call the API to get all products
      if (res.success) setProducts(res.data); // Update state on success
    };
    fetchAll();
  }, []);

  // Function to create a new product via API
  const addProductAPI = async (formData) => {
    const res = await createProduct(formData, token);
    // Optimistic update: Add the new product data to the state array immediately
    if (res.success) setProducts(prev => [...prev, res.data]);
    return res;
  };

  // Function to update an existing product via API
  const updateProductAPI = async (id, formData) => {
    const res = await updateProduct(id, formData, token);
    // Update state: Replace the old product with the newly returned data
    if (res.success) setProducts(prev => prev.map(p => p.id === id ? res.data : p));
    return res;
  };

  // Function to delete (soft delete) a product via API
  const deleteProductAPI = async (id) => {
    const res = await deleteProduct(id, token);
    // Update state: Filter out the deleted product (client-side soft delete removal)
    if (res.success) setProducts(prev => prev.filter(p => p.id !== id));
    return res;
  };

  // Function to restore all soft-deleted products via API
  const restoreProductsAPI = async () => {
    const res = await restoreProducts(token);
    if (res.success) {
      // After restoration, re-fetch the entire list to show restored items
      const allProducts = await getProducts();
      if (allProducts.success) setProducts(allProducts.data);
    }
    return res;
  };

  return (
    // Provides the product state and all CRUD management functions to consumers
    <ProductsContext.Provider value={{ 
      products,
      addProductAPI,
      updateProductAPI,
      deleteProductAPI,
      restoreProductsAPI
    }}>
      {children}
    </ProductsContext.Provider>
  );
};