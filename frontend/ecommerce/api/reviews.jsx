// Base URL for the API endpoints
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Fetches reviews for a specific product ID.
 */
export async function getReviews(productId) {
    // Appends the product ID to the reviews endpoint
    const res = await fetch(`${API_BASE_URL}/reviews/${productId}`); 
    return res.json();
    }

/**
 * Submits a new review on behalf of the authenticated user.
 */
export async function submitReview(reviewData, token) {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST", // Use POST to create a new resource (the review)
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Authentication token
        },
        body: JSON.stringify(reviewData), // Review content and rating
    });
    return res.json();
    }