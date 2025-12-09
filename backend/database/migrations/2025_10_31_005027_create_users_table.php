<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'users' database table 👤.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();                                                   // Primary key (database ID)
            $table->string('name');                                         // User's full name
            $table->string('email')->unique();                              // User's email (must be unique)
            $table->string('password');                                     // Hashed password
            $table->string('phone');                                        // User's phone number
            $table->enum('gender', ['Male', 'Female', 'Others']);           // Restricted list of possible gender values
            $table->date('dob');                                            // Date of birth
            $table->string('role')->default('user');                        // User's application role (e.g., user, admin)
            $table->boolean('isAdmin')->default(false);                     // Boolean flag indicating admin status
            $table->timestamps();                                           // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};