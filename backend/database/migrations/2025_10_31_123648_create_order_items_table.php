<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'order_items' database table 🧾.
 * This table stores the details of individual products purchased within a specific order.
 * It acts as a pivot table between 'orders' and 'products'.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id(); // Primary key (database ID for the order item entry)
            
            // Foreign key linking to the 'orders' table
            $table->foreignId('order_id')
                  ->constrained('orders')
                  ->onDelete('cascade'); // If the order is deleted, its items are removed
                  
            // Foreign key linking to the 'products' table
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade'); // If the product is deleted, the item is removed from orders
                  
            $table->integer('quantity')->default(1); // Quantity of the product purchased
            $table->decimal('price', 8, 2); // Price of the product *at the time of purchase*
            
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};