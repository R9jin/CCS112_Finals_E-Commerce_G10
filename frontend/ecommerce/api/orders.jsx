// Base URL for the API endpoints
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches the list of orders for the authenticated user.
 */
export async function getOrders(token) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` }, // Sends auth token
  });
  return res.json();
}

/**
 * Creates a new order using the data provided.
 */
export async function createOrder(order, token) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST", // Use POST for creation
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order), // Order details (e.g., items, shipping info)
  });
  return res.json();
}