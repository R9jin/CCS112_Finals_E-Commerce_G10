<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * The main database seeder class 🌿.
 * It coordinates and calls all other individual seeders to populate the database with initial data.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * This is the primary method where all other seeders are registered and executed.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,      // Seeds initial user accounts
            ProductSeeder::class,   // Seeds initial product data
            TaskSeeder::class,      // Seeds initial task data
            ReviewSeeder::class,    // Seeds initial review data
        ]);
    }
}