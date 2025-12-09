// src/ecommerce/utils/storage.js
/**
 * Safely retrieves and parses a JSON string from localStorage.
 * Returns an empty array if the key does not exist or if parsing fails.
 * @param {string} key - The key name in localStorage.
 * @returns {Array} The parsed array or an empty array [].
 */
export const safeParse = (key) => {
  try {
    const value = localStorage.getItem(key); // Retrieve the value by key
    // Return the parsed JSON value, or an empty array if the value is null/undefined
    return value ? JSON.parse(value) : [];
  } catch (e) {
    // Catch errors during parsing (e.g., malformed JSON)
    console.error(`Error parsing ${key}:`, e);
    return []; // Return an empty array on failure to prevent app crash
  }
};