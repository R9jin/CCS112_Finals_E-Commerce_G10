<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a user's placed order 🛍️.
 */
class Order extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'user_id',       // Foreign key to the User model
        'total_price',   // Total amount of the order
        'status',        // Current status (e.g., Pending, Delivered, Completed)
    ];

    /**
     * Defines the inverse one-to-many relationship with the User model.
     * An order belongs to one user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Defines the one-to-many relationship with the OrderItem model.
     * An order has many items.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}