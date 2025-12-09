<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a single item entry within a placed order 🧾.
 * This acts as a pivot table with extra columns (quantity, price).
 */
class OrderItem extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'order_id',   // Foreign key to the parent Order
        'product_id', // Foreign key to the Product model
        'quantity',   // Quantity purchased in this order
        'price',      // Price of the item at the time of purchase
    ];

    /**
     * Defines the inverse one-to-many relationship with the Order model.
     * An order item belongs to one order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Defines the inverse one-to-many relationship with the Product model.
     * An order item links to one product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}