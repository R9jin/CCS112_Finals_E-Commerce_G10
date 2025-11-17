<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Get all items for a user
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $cartItems = Cart::with('product')
            ->where('users_id', $userId)
            ->get();

        return response()->json($cartItems);
    }

    // Add item to cart
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $cart = Cart::create([
            'users_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json($cart, 201);
    }

    // Remove a single cart item
    public function destroy($id)
    {
        $item = Cart::findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Item removed']);
    }

    // Clear all items of user
    public function clear(Request $request)
    {
        $userId = $request->user()->id;

        Cart::where('users_id', $userId)->delete();

        return response()->json(['message' => 'Cart cleared']);
    }
}
