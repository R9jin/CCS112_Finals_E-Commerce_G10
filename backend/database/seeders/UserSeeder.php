<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder responsible for populating the 'users' database table 👤.
 * It reads user data (including passwords) from a dedicated JSON file.
 */
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $usersFile = database_path('seeders/users.json');

        // 1. Check if the users.json data file exists
        if (!file_exists($usersFile)) {
            // Output message to the console if the file is missing
            $this->command->info('users.json file not found in seeders folder.');
            return;
        }

        // 2. Read and decode user data from the JSON file
        $users = json_decode(file_get_contents($usersFile), true);

        // 3. Loop through the array and create or update user records
        foreach ($users as $user) {
            User::updateOrCreate(
                // Search condition: Check if a user with this email already exists
                ['email' => $user['email']],
                [
                    // Data for creation or update
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']), // Hash the password securely
                    'phone' => $user['phone'],
                    'gender' => $user['gender'],
                    'dob' => $user['dob'],
                    'role' => $user['role'] ?? 'user',       // Default to 'user' role
                    'isAdmin' => $user['isAdmin'] ?? false, // Default to not being an admin
                ]
            );
        }
    }
}