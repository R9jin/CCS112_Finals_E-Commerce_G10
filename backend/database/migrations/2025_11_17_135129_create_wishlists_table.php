<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'wishlists' database table ❤️.
 * This table links users to the products they have wishlisted.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up()
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id(); // Primary key (database ID for the wishlist entry)
            
            // Foreign key linking to the 'users' table (uses conventional 'id' column)
            $table->foreignId('user_id')
                  ->constrained() // Assumes 'users' table and 'id' column
                  ->onDelete('cascade'); // If the user is deleted, their wishlist items are removed
                  
            $table->string('product_id'); // Stores the unique product identifier string (e.g., AP001)
            
            // Explicitly define the foreign key constraint using the string 'product_id' column
            $table->foreign('product_id')
                  ->references('product_id') // References the 'product_id' column in the 'products' table
                  ->on('products')
                  ->onDelete('cascade'); // If the product is deleted, it's removed from all wishlists

            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns

            // Ensures a user can only wishlist a specific product once
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down()
    {
        Schema::dropIfExists('wishlists');
    }

};