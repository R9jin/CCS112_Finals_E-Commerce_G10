<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products
     * List all products (public)
     */
    public function index()
    {
        // Optional: paginate for performance
        $products = Product::paginate(10);

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * POST /api/products
     * Create a new product (admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|string|unique:products,product_id',
            'name' => 'required|string|max:255',
            'category' => 'required|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'required|numeric',
            'image_url' => 'nullable|url',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'required|integer',
            'sold' => 'nullable|integer|min:0',
            'wishlisted' => 'nullable|boolean',
            'dateAdded' => 'nullable|date',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'success' => true,
            'data' => $product
        ], 201);
    }

    /**
     * GET /api/products/{id}
     * Show a single product (public)
     */
    public function show(Product $product)
    {
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * PUT /api/products/{id}
     * Update a product (admin only)
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|string|unique:products,product_id,' . $product->id,
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'sometimes|numeric',
            'image_url' => 'sometimes|url|nullable',
            'description' => 'sometimes|string|nullable',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'stock' => 'sometimes|integer',
            'sold' => 'sometimes|integer|min:0',
            'wishlisted' => 'sometimes|boolean',
            'dateAdded' => 'sometimes|date',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * DELETE /api/products/{id}
     * Delete a product (admin only)
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
