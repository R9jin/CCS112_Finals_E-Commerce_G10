<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // Trait for token-based authentication

/**
 * Model representing a user of the application, used for authentication and authorization 👤.
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable; // Enables API token management and notifications

    // Specifies which fields can be mass-assigned
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'gender',
        'dob',
        'role',     // User role (e.g., 'user', 'admin')
        'isAdmin',  // Boolean flag for admin status
    ];

    // Fields that should be hidden when the model is serialized to an array/JSON
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Defines the one-to-many relationship with the Wishlist model.
     * A user can have many wishlisted items.
     */
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Defines the one-to-many relationship with the Cart model.
     * A user can have many items in their cart.
     */
    public function cart()
    {
        return $this->hasMany(Cart::class, 'users_id'); // Explicitly uses 'users_id' foreign key
    }

    /**
     * Defines the one-to-many relationship with the Order model.
     * A user can have many orders.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}