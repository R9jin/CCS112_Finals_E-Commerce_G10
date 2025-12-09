<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating and dropping the 'tasks' database table 📝.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the table).
     */
    public function up(): void {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();                                   // Primary key (auto-incrementing ID)
            $table->string('title');                        // Task title (required)
            $table->text('description')->nullable();        // Detailed description (optional)
            $table->string('status')->default('pending');   // Task status (defaults to 'pending')
            $table->date('due_date')->nullable();           // Optional due date
            $table->timestamps();                           // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations (drop the table).
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};