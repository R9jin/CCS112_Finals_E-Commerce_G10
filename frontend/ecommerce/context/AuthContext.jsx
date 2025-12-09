import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, updateUser as apiUpdateUser } from "../api/auth";

// Create the Context object
const AuthContext = createContext();

/**
 * Provides authentication state (isLoggedIn, currentUser, token) 
 * and methods (login, logout, updateProfile) to the rest of the app.
 */
export function AuthProvider({ children }) {
  // Authentication status state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Stores the currently authenticated user object
  const [currentUser, setCurrentUser] = useState(null);
  // Stores the JWT or access token
  const [token, setToken] = useState(null);

  // Effect runs once on mount to restore user session from browser storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("currentUser");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Handles user login via API
  const login = async (credentials) => {
    try {
      const data = await apiLogin(credentials); // Calls the API utility function

      if (data.token) {
        // Update state
        setToken(data.token);
        setCurrentUser(data.user);
        setIsLoggedIn(true);

        // Persist session to local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        return { success: true, user: data.user };
      } else if (data.error) {
        return { success: false, error: data.error };
      } else {
        return { success: false, error: "Unknown login error" };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  // Clears user session from state and local storage
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  };

  // Handles updating the user profile via API
  const updateProfile = async (userData) => {
    try {
      // Calls the API utility function using the current token
      const data = await apiUpdateUser(userData, token);
      
      if (data.success) {
        // Update local state and storage with the new user data
        setCurrentUser(data.user);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || "Update failed" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, error: "Network error" };
    }
  };

  return (
    // Provides state and functions to consumers
    <AuthContext.Provider
      value={{ isLoggedIn, currentUser, token, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for convenient access to the auth context values
export const useAuth = () => useContext(AuthContext);