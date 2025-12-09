<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration responsible for creating the database tables required for Laravel's Queue System ⚙️.
 * This includes tables for managing individual jobs, job batches, and failed jobs.
 */
return new class extends Migration
{
    /**
     * Run the migrations (create the tables).
     */
    public function up(): void
    {
        // Table for storing individual jobs waiting to be processed
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();         // The queue connection the job belongs to
            $table->longText('payload');              // The serialized job data and class information
            $table->unsignedTinyInteger('attempts');  // Number of times the job has been attempted
            $table->unsignedInteger('reserved_at')->nullable(); // Timestamp when the job was reserved by a worker
            $table->unsignedInteger('available_at');  // Timestamp when the job should be processed
            $table->unsignedInteger('created_at');
        });

        // Table for tracking the status and progress of batched jobs
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();          // Unique ID for the batch
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');       // A list of IDs of jobs that have failed within the batch
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        // Table for storing detailed information about jobs that have failed permanently
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();         // Universally unique identifier for the failed job
            $table->text('connection');               // The connection name (e.g., database, redis)
            $table->text('queue');                    // The queue name
            $table->longText('payload');              // The serialized job data
            $table->longText('exception');            // The full stack trace of the exception
            $table->timestamp('failed_at')->useCurrent(); // Timestamp of failure
        });
    }

    /**
     * Reverse the migrations (drop the tables).
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};