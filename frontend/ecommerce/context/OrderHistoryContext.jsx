import { createContext, useEffect, useState } from "react";
import { getOrders } from "../api/orders"; // API utility to fetch orders
import { useAuth } from "./AuthContext"; // Import authentication context

// Create the Context object
export const OrderHistoryContext = createContext();

/**
 * Provides the user's order history state (transactions) and a function to refresh it.
 */
export const OrderHistoryProvider = ({ children }) => {
  // Get the authentication token from AuthContext
  const { token } = useAuth(); 
  // State to store the array of historical transactions/orders
  const [transactions, setTransactions] = useState([]);

  // Function to fetch the user's order history from the backend
  const fetchOrders = async () => {
    if (!token) return; // Only fetch if the user is authenticated

    try {
      // Call the API function using the auth token
      const response = await getOrders(token);
      if (response && response.success) {
        setTransactions(response.data); // Update state with the fetched orders
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Effect to run fetchOrders whenever the token changes (i.e., on login/logout)
  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    // Provides the order data and the refresh function to consumers
    <OrderHistoryContext.Provider 
      value={{ 
        transactions, 
        refreshOrders: fetchOrders // Function to allow components to manually trigger a refresh
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};