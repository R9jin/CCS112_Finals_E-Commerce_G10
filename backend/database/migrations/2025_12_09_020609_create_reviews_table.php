<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'reviews' database table ⭐.
 * This table stores customer ratings and comments for products.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Primary key (database ID for the review entry)
            
            // Foreign key linking to the 'users' table
            $table->foreignId('user_id')
                  ->constrained() // Assumes 'users' table and 'id' column
                  ->onDelete('cascade'); // If the user is deleted, their reviews are removed
                  
            // Foreign key linking to the 'products' table
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade'); // If the product is deleted, its reviews are removed
                  
            $table->integer('rating'); // The numerical rating (expected 1 to 5)
            $table->text('comment')->nullable(); // Optional text comment
            
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};