<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a single item entry in a user's shopping cart 🛒.
 */
class Cart extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'users_id',   // Foreign key to the User model
        'product_id', // Foreign key to the Product model
        'quantity'    // Number of units of the product
    ];

    /**
     * Defines the inverse one-to-many relationship with the User model.
     */
    public function user()
    {
        // Explicitly specifying 'users_id' because Laravel defaults to 'user_id'
        return $this->belongsTo(User::class, 'users_id');
    }

    /**
     * Defines the inverse one-to-many relationship with the Product model.
     */
    public function product()
    {
        // Laravel automatically infers the foreign key as 'product_id'
        return $this->belongsTo(Product::class);
    }
}