<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;

/**
 * Seeder responsible for populating the 'tasks' database table 📝.
 * It uses the Task Model Factory to quickly generate fake data.
 */
class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Use the Task factory to create 20 fake task records and save them to the database
        Task::factory()->count(20)->create();
    }
}