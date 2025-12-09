<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a product item available for sale 🍔.
 */
class Product extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'product_id',   // Unique identifier (non-primary key)
        'name',
        'category',
        'price',
        'image_url',
        'description',
        'rating',
        'stock',        // Inventory level
        'sold',         // Number of units sold
        'wishlisted',   // (May be redundant if using relationships)
        'dateAdded',
    ];
    
    /**
     * Defines the one-to-many relationship with the Wishlist model.
     * A product can be in many users' wishlists.
     */
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Defines the one-to-many relationship with the Cart model.
     * A product can be in many users' carts.
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Defines the one-to-many relationship with the OrderItem model.
     * A product can be included in many orders.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Defines the one-to-many relationship with the Review model.
     * A product can have many reviews.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}