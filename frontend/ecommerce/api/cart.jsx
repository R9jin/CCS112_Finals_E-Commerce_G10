// Base URL for the API endpoints
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches the contents of the user's shopping cart.
 */
export async function getCart(token) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` }, // Sends auth token
  });
  return res.json();
}

/**
 * Adds a specific product to the user's shopping cart.
 */
export async function addToCart(productId, token) {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }), // Product ID to add
  });
  return res.json();
}

/**
 * Removes an item (identified by its cart ID) from the user's shopping cart.
 */
export async function removeFromCart(cartId, token) {
  const res = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
    method: "DELETE", // Use DELETE method for removal
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}