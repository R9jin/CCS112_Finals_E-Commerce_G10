<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Database\Seeders\ProductSeeder;
use Illuminate\Support\Facades\Schema;

/**
 * Controller handling all CRUD operations for Products (admin functionality) 📦.
 */
class ProductController extends Controller
{
    /**
     * Retrieves all products from the database.
     */
    public function index()
    {
        // Fetch all products model instances
        return response()->json([
            'success' => true,
            'data' => Product::all()
        ]);
    }

    /**
     * Creates a new product.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'required|numeric',
            // Image validation (optional, file size limit)
            'image' => 'nullable|image|max:2048', 
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'stock' => 'required|integer',
            'sold' => 'nullable|integer|min:0',
            'wishlisted' => 'nullable|boolean',
            'dateAdded' => 'nullable|date',
        ]);

        // 2. Generate a unique product identifier (e.g., P-randomid)
        $validated['product_id'] = 'P-' . uniqid();

        // 3. Handle image upload if a file is present
        if ($request->hasFile('image')) {
            // Store file in the 'products' directory within the public disk
            $path = $request->file('image')->store('products', 'public');
            // Store the full URL to the image in the database
            $validated['image_url'] = asset('storage/' . $path);
        }

        // 4. Create the product record
        $product = Product::create($validated);

        return response()->json(['success' => true, 'data' => $product], 201);
    }

    /**
     * Retrieves a single product by its ID (using Route Model Binding).
     */
    public function show(Product $product)
    {
        // Route Model Binding automatically fetches the product
        return response()->json(['success' => true, 'data' => $product]);
    }

    /**
     * Updates an existing product.
     */
    public function update(Request $request, Product $product)
    {
        // 1. Validate incoming data ('sometimes' means field is optional but validated if present)
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:Appetizers,Main Course,Desserts,Street Food,Drinks',
            'price' => 'sometimes|numeric',
            'image' => 'sometimes|image|max:2048',
            'description' => 'sometimes|string',
            'rating' => 'sometimes|numeric|min:0|max:5',
            'stock' => 'sometimes|integer',
            'sold' => 'sometimes|integer|min:0',
            'wishlisted' => 'sometimes|boolean',
            'dateAdded' => 'sometimes|date',
        ]);

        // 2. Handle new image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = asset('storage/' . $path);
        }

        // 3. Update the product record
        $product->update($validated);
        $product->refresh(); // Retrieve the latest state from the database

        return response()->json(['success' => true, 'data' => $product]);
    }

    /**
     * Deletes (soft deletes) a specific product.
     */
    public function destroy(Product $product)
    {
        // Assumes the Product model uses the SoftDeletes trait
        $product->delete(); 
        return response()->json(['success' => true, 'message' => 'Product deleted']);
    }

    /**
     * Restores all products by truncating and re-seeding the table (Admin action).
     */
    public function restore()
    {
        // 1. Temporarily disable foreign key constraints to allow TRUNCATE
        Schema::disableForeignKeyConstraints();
        Product::truncate(); // Delete all records in the table

        // 2. Re-enable foreign key constraints
        Schema::enableForeignKeyConstraints();
        
        // 3. Run the ProductSeeder to populate the table with default data
        $seeder = new ProductSeeder();
        $seeder->run();

        // 4. Return success response
        return response()->json([
            'success' => true, 
            'message' => 'Products restored to default settings.'
        ]);
    }
}