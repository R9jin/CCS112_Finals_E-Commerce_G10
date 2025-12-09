<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

/**
 * Controller handling user wishlist management (retrieval, adding, and removal) ❤️.
 */
class WishlistController extends Controller
{
    /**
     * Retrieves all wishlist items for the authenticated user.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Fetch items, eager load 'product' to include product details
        $items = Wishlist::with('product')
            ->where('user_id', $request->user()->id) // Scope to the authenticated user
            ->get();

        return response()->json($items);
    }

    /**
     * Adds a product to the user's wishlist.
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        // 1. Validate incoming data (product_id must exist in the products table)
        $request->validate([
            'product_id' => 'required|exists:products,product_id', 
        ]);

        // 2. Check if the item is already wishlisted
        $exists = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            // Return 409 Conflict if the item is already present
            return response()->json(['message' => 'Already in wishlist'], 409);
        }

        // 3. Create the new wishlist entry
        $item = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json($item, 201); // Return 201 Created
    }
    
    /**
     * Removes a wishlist item using the Wishlist entry ID (database ID).
     * @param int $id - The ID of the wishlist entry.
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Find the wishlist entry or fail (404)
        $item = Wishlist::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }

    /**
     * Removes a wishlist item using the Product ID (unique product identifier).
     * @param \Illuminate\Http\Request $request
     * @param string $productId - The product's unique 'product_id'.
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeByProduct(Request $request, $productId)
    {
        // Delete the entry matching the user and the specific product ID
        $deleted = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Removed from wishlist']);
    }
}