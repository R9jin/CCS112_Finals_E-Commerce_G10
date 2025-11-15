<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\WishlistController;

// Tasks
Route::apiResource('tasks', TaskController::class);

// Public product endpoints
Route::resource('products', ProductController::class)->only(['index', 'show']);

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Wishlist
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::delete('/wishlist/{id}', [WishlistController::class, 'destroy']);

    // Cart
    Route::post('/cart', [CartController::class, 'store']);
    Route::get('/cart', [CartController::class, 'index']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    // Authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
