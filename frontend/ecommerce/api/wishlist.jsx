// Base URL for the API endpoints
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches the user's entire wishlist.
 */
export async function getWishlist(token) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` }, // Sends auth token for authentication
  });
  return res.json();
}

/**
 * Adds a product to the user's wishlist.
 */
export async function addToWishlist(productId, token) {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: "POST", // Used to create a new wishlist entry
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId }), // ID of the product to add
  });
  return res.json();
}

/**
 * Removes an item from the wishlist using its wishlist entry ID.
 */
export async function removeFromWishlist(id, token) {
  const res = await fetch(`${API_BASE_URL}/wishlist/${id}`, {
    method: "DELETE", // Used to remove the entry
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}