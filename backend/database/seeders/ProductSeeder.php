<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

/**
 * Seeder responsible for populating the 'products' database table 🍔.
 * It reads product data from a dedicated JSON file.
 */
class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Read and decode product data from the external JSON file
        $products = json_decode(file_get_contents(database_path('seeders/products.json')), true);

        // 2. Loop through the array and create a Product model instance for each entry
        foreach ($products as $product) {
            Product::create($product);
        }
    }
}