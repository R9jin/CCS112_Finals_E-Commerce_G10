<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'products' database table 🍔.
 * This table stores details about all items available for sale.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();                                                              // Primary key (database ID)
            $table->string('product_id')->unique();                                    // Unique identifier for the product (e.g., AP001)
            $table->string('name');                                                    // Product name
            // Restricted list of possible categories
            $table->enum('category', ['Appetizers', 'Main Course', 'Desserts', 'Street Food', 'Drinks']);
            $table->decimal('price', 8, 2);                                            // Price (total 8 digits, 2 decimal places)
            $table->string('image_url')->nullable();                                   // URL or path to the product image
            $table->text('description')->nullable();                                   // Long description
            $table->decimal('rating', 2, 1)->default(0);                               // Average rating (e.g., 4.5)
            $table->integer('stock')->default(0);                                      // Current inventory level
            $table->integer('sold')->default(0);                                       // Total units sold
            $table->boolean('wishlisted')->default(false);                             // Flag (likely redundant with Wishlist table)
            $table->date('dateAdded')->nullable();                                     // Date the product was added
            $table->timestamps();                                                      // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};