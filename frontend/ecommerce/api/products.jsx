// Base URL for the API endpoints
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches the list of all products.
 */
export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  return res.json();
}

/**
 * Creates a new product, typically used for file uploads (e.g., images).
 */
export async function createProduct(formData, token) {
  return fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // Authentication token
    body: formData, // Data is sent as FormData (multi-part)
  }).then(res => res.json());
}

/**
 * Updates an existing product by its ID.
 */
export async function updateProduct(id, formData, token) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "POST", // Often used with FormData even for updates
    headers: {
      Authorization: `Bearer ${token}`,
      // Note: Content-Type is set automatically by the browser for FormData
    },
    body: formData, // Updated data, possibly including new files
  }).then(res => res.json());
}

/**
 * Deletes a product by its ID.
 */
export async function deleteProduct(id, token) {
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE", // Use DELETE method for removal
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
}

/**
 * Restores soft-deleted products.
 */
export async function restoreProducts(token) {
  return fetch(`${API_BASE_URL}/products/restore`, {
    method: "POST", // Endpoint to trigger the restoration
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.json());
}