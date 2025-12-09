<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import all necessary Controller classes
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and all assigned
| to the "api" middleware group.
|
*/

// --- 1. Public Routes (No Authentication Required) ---

// Tasks: Standard RESTful API for tasks
Route::apiResource('tasks', TaskController::class);

// Products: Read-only access for all users
Route::resource('products', ProductController::class)->only(['index', 'show']);

// Authentication endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Reviews: Read reviews for a specific product
Route::get('/reviews/{productId}', [ReviewController::class, 'index']);

// --- 2. Authenticated Routes (Requires 'auth:sanctum' middleware) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // User Profile
    Route::put('/user', [AuthController::class, 'update']); // Update profile details
    Route::get('/user', function (Request $request) {
        return $request->user(); // Get authenticated user data
    });

    // Reviews: Submit a new review
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Products (Admin/Management access)
    Route::post('/products', [ProductController::class, 'store']);       // Create
    Route::put('/products/{product}', [ProductController::class, 'update']); // Update
    Route::delete('/products/{product}', [ProductController::class, 'destroy']); // Delete
    Route::post('/products/restore', [ProductController::class, 'restore']); // Restore/Seed data

    // Wishlist
    Route::post('/wishlist', [WishlistController::class, 'store']);               // Add item
    Route::get('/wishlist', [WishlistController::class, 'index']);                // Get all items
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);      // Remove item by Wishlist ID
    Route::delete('/wishlist/product/{id}', [WishlistController::class, 'removeByProduct']); // Remove item by Product ID

    // Cart
    Route::get('/cart', [CartController::class, 'index']);           // Get all cart items
    Route::post('/cart', [CartController::class, 'store']);          // Add item to cart
    Route::delete('/cart/clear', [CartController::class, 'clear']);  // Clear all items in cart
    Route::put('/cart/{id}', [CartController::class, 'update']);     // Update item quantity
    Route::delete('/cart/{id}', [CartController::class, 'destroy']); // Remove item from cart by Cart ID

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);       // Place a new order
    Route::get('/orders', [OrderController::class, 'index']);        // Get order history
    Route::put('/orders/{order}', [OrderController::class, 'update']); // Update order status
});