<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'carts' database table 🛒.
 * This table stores a list of products currently in a user's shopping cart.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id(); // Primary key (database ID for the cart entry)
            
            // Foreign key linking to the 'users' table
            $table->foreignId('users_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // If the user is deleted, their cart items are automatically removed
            
            // Foreign key linking to the 'products' table
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade'); // If the product is deleted, the item is removed from all carts
                  
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};