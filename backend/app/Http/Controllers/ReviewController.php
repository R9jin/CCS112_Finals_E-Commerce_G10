<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Http\Request;

/**
 * Controller handling product reviews (submission and retrieval) ⭐.
 */
class ReviewController extends Controller
{

    /**
     * Submits a new review for a product by the authenticated user.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data
        $request->validate([
            // product_id must exist in the 'products' table
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5', // Rating must be between 1 and 5
            'comment' => 'nullable|string'
        ]);

        // 2. Create the new Review record
        $review = Review::create([
            'user_id' => $request->user()->id, // Automatically assign the authenticated user's ID
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // 3. Return success response
        return response()->json(['success' => true, 'data' => $review], 201);
    }

    /**
     * Retrieves all reviews for a specific product.
     * @param string $productId - The product ID (either unique string ID or database ID).
     */
    public function index($productId)
    {

        // 1. Find the product using either the unique 'product_id' or the database 'id'
        $product = Product::where('product_id', $productId)->orWhere('id', $productId)->firstOrFail();

        // 2. Fetch all reviews associated with the found product's database ID
        $reviews = Review::with('user:id,name') // Eager load only the user's ID and name
            ->where('product_id', $product->id)
            ->latest() // Order by newest reviews first
            ->get();

        // 3. Return the list of reviews
        return response()->json(['success' => true, 'data' => $reviews]);
    }
}