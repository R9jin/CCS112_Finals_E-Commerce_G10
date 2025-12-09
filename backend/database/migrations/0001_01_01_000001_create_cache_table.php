<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the database tables used by Laravel's file/database cache driver 💾.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the tables).
     */
    public function up(): void
    {
        // Creates the main table for storing cached values
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();     // The unique cache key, used for retrieval
            $table->mediumText('value');          // The serialized cached value
            $table->integer('expiration');        // Unix timestamp when the cache item expires
        });

        // Creates the table for managing atomic locks, ensuring only one process modifies a cache item at a time
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();     // The lock key
            $table->string('owner');              // Unique identifier of the process holding the lock
            $table->integer('expiration');        // Unix timestamp when the lock expires
        });
    }

    /**
     * Reverse the migrations (drop the tables).
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};