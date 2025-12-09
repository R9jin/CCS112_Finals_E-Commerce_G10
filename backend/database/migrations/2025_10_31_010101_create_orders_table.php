<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'orders' database table 🛍️.
 * This table stores high-level transaction details.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // Primary key (database ID for the order)
            
            // Foreign key linking to the 'users' table
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade'); // If the user is deleted, their orders are automatically removed
                  
            $table->decimal('total_price', 10, 2); // The final price of the entire order
            $table->string('status')->default('pending'); // Current status of the order (e.g., pending, delivered)
            
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};