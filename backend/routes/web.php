<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/**
 * The web routes file 🌐.
 * These routes are loaded by the RouteServiceProvider and are typically used
 * for routes that serve HTML views (like a traditional web application).
 */

// Define the root URL ('/') route
Route::get('/', function () {
    // Returns the default 'welcome' view
    return view('welcome');
});

// // Example of how to enable a full RESTful resource route for products:
// // Route::apiResource('products', ProductController::class); 
// // This line is currently commented out, indicating it's not active.