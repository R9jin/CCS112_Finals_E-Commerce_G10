<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'personal_access_tokens' table 🔑.
 * This table is used by Laravel Sanctum for storing API tokens.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            // Adds 'tokenable_id' (unsignedBigInteger) and 'tokenable_type' (string) columns.
            // These link the token back to the polymorphic model (e.g., the User).
            $table->morphs('tokenable'); 
            $table->text('name');                       // Name given to the token (e.g., 'mobile-app')
            $table->string('token', 64)->unique();      // The hashed API token (used for validation)
            $table->text('abilities')->nullable();      // List of permissions granted to this token (JSON format)
            $table->timestamp('last_used_at')->nullable(); // Last time the token was used
            $table->timestamp('expires_at')->nullable()->index(); // Optional expiration time for the token
            $table->timestamps();                       // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};