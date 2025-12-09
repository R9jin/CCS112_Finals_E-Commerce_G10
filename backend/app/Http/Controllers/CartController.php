<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

/**
 * Controller handling shopping cart operations (retrieval, adding, updating, removal) 🛒.
 */
class CartController extends Controller
{
    /**
     * Retrieves all cart items for the authenticated user.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id; // Get ID of authenticated user

        // Fetch cart items belonging to the user
        // Eager load 'product' relationship to include product details in the response
        $cartItems = Cart::with('product')
            ->where('users_id', $userId)
            ->get();

        return response()->json($cartItems);
    }

    /**
     * Adds a product to the cart or increments the quantity if it already exists.
     */
    public function store(Request $request)
    {
        // 1. Validate incoming data
        $request->validate([
            // product_id must exist in the 'products' table
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1'
        ]);

        // 2. Check if the item already exists in the user's cart
        $existingCart = Cart::where('users_id', $request->user()->id)
                            ->where('product_id', $request->product_id)
                            ->first();

        if ($existingCart) {
            // If item exists, increment the quantity
            $existingCart->quantity += $request->input('quantity', 1);
            $existingCart->save();
            return response()->json($existingCart, 200); // Return 200 OK for update
        }

        // 3. If item does not exist, create a new cart entry
        $cart = Cart::create([
            'users_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'quantity' => $request->input('quantity', 1) // Default quantity is 1
        ]);

        return response()->json($cart, 201); // Return 201 Created for new resource
    }

    /**
     * Updates the quantity of a specific cart item by its Cart ID.
     */
    public function update(Request $request, $id)
    {
        // 1. Validate incoming quantity
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        // 2. Find the cart entry or fail (404)
        $cart = Cart::findOrFail($id);
        
        // 3. Authorization check: ensure the cart item belongs to the authenticated user
        if ($cart->users_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 4. Update the quantity
        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json($cart);
    }

    /**
     * Removes a specific cart item by its Cart ID.
     */
    public function destroy(Request $request, $id)
    {
        // 1. Find the cart entry or fail (404)
        $cart = Cart::findOrFail($id);

        // 2. Authorization check
        if ($cart->users_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }