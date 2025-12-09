<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a customer's review or rating for a specific product ⭐.
 */
class Review extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'user_id',    // Foreign key to the User who wrote the review
        'product_id', // Foreign key to the Product being reviewed
        'rating',     // Numerical rating (e.g., 1 to 5)
        'comment'     // Textual feedback
    ];

    /**
     * Defines the inverse one-to-many relationship with the User model.
     * A review belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Defines the inverse one-to-many relationship with the Product model.
     * A review belongs to one product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}