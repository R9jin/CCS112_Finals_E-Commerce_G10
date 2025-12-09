<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder responsible for populating the 'reviews' database table ⭐.
 * It also conditionally creates placeholder User accounts for the reviews if they don't exist.
 */
class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Load the JSON data containing review entries
        $json = File::get(database_path('seeders/reviews.json'));
        $reviews = json_decode($json, true);

        foreach ($reviews as $data) {
            // 2. Find the target product using its unique string ID ('product_code')
            $product = Product::where('product_id', $data['product_code'])->first();

            if (!$product) {
                // Skip the review if the associated product is not found in the database
                continue;
            }

            // 3. Find or Create the User based on email
            // 'firstOrCreate' prevents creating duplicate users if the seeder runs multiple times
            $user = User::firstOrCreate(
                ['email' => $data['user_email']], // Check only the email
                [
                    // Default creation data if the email is new
                    'name' => 'Reviewer ' . explode('@', $data['user_email'])[0],
                    'password' => Hash::make('password'),
                    'phone' => '09123456789',
                    'gender' => 'Male', // Default values for required fields
                    'dob' => '2000-01-01',
                    'role' => 'user'
                ]
            );

            // 4. Create the Review record
            Review::create([
                'user_id' => $user->id,                  // Use the database ID of the found or created User
                'product_id' => $product->id,            // Use the database ID of the found Product
                'rating' => $data['rating'],
                'comment' => $data['comment'],
            ]);
        }
    }
}