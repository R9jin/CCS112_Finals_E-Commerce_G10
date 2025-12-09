<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for adding and removing the 'quantity' column to the existing 'carts' table 🛒.
 * This allows a user to specify how many units of a product they want in their cart.
 */
return new class extends Migration
{
    /**
     * Run the migrations (add the column).
     */
    public function up(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            // Adds an integer column named 'quantity'
            $table->integer('quantity')
                  ->default(1) // Sets the default value to 1
                  ->after('product_id'); // Places the new column immediately after 'product_id'
        });
    }

    /**
     * Reverse the migrations (remove the column).
     */
    public function down(): void
    {
        Schema::table('carts', function (Blueprint $table) {
            // Reverses the action by dropping the 'quantity' column
            $table->dropColumn('quantity');
        });
    }
};