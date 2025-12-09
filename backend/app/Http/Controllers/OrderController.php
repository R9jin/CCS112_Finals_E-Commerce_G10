<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Support\Facades\DB; // Used for database transactions

/**
 * Controller handling user order placement, history retrieval, tracking, and status updates 📦.
 */
class OrderController extends Controller
{
    /**
     * Retrieves the order history for the authenticated user.
     */
    public function index()
    {
        // Fetch orders, eager load order items and their associated product details
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id()) // Scope to the authenticated user
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Creates a new order from the items currently in the user's cart.
     */
    public function store(Request $request)
    {
        // Use a database transaction to ensure atomicity (all steps succeed or all fail)
        return DB::transaction(function () use ($request) {
            $user = auth()->user();
            
            // 1. Fetch all cart items for the user, eager load product details
            $cartItems = Cart::where('users_id', $user->id)->with('product')->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
            }

            $totalAmount = 0;

            // 2. Pre-check stock availability and calculate total amount
            foreach ($cartItems as $item) {
                if ($item->product->stock < $item->quantity) {
                    // Fail the transaction if stock is insufficient
                    return response()->json([
                        'success' => false, 
                        'message' => "Insufficient stock for product: " . $item->product->name
                    ], 400);
                }
                $totalAmount += $item->product->price * $item->quantity;
            }

            // 3. Create the main Order record
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => $totalAmount,
                'status' => 'Pending', // Default initial status
            ]);

            // 4. Move items from Cart to OrderItems, update product stock/sold counts
            foreach ($cartItems as $item) {
                // Create the record in the pivot table (OrderItem)
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price // Record the price at the time of order
                ]);

                // Decrement stock and increment sold counts on the Product model
                $item->product->decrement('stock', $item->quantity);
                $item->product->increment('sold', $item->quantity);
            }

            // 5. Clear the user's cart
            Cart::where('users_id', $user->id)->delete();

            // 6. Return success response
            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => $order
            ]);
        });
    }

    /**
     * Retrieves details for a single order (for tracking/viewing).
     */
    public function show($id)
    {
        // Fetch order, eager load items and products
        $order = Order::with('items.product')
            ->where('user_id', auth()->id()) // Scope to authenticated user
            ->findOrFail($id); // Find by ID or throw 404

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Updates the status of a specific order.
     */
    public function update(Request $request, $id)
    {
        // 1. Validate the required status field
        $request->validate([
            'status' => 'required|string'
        ]);

        // 2. Find the order, ensuring it belongs to the authenticated user
        $order = Order::where('user_id', auth()->id())->findOrFail($id);
        
        // 3. Update the status field
        $order->update([
            'status' => $request->status
        ]);

        // 4. Return success response
        return response()->json([
            'success' => true,
            'message' => 'Order status updated',
            'data' => $order
        ]);
    }
}