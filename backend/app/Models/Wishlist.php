<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a single entry in a user's wishlist ❤️.
 * This is effectively a simple pivot table linking users and products.
 */
class Wishlist extends Model
{
    // Specifies which fields can be mass-assigned
    protected $fillable = ['user_id', 'product_id'];

    /**
     * Defines the inverse one-to-many relationship with the User model.
     * A wishlist item belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Defines the inverse one-to-many relationship with the Product model.
     * A wishlist item references one product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}