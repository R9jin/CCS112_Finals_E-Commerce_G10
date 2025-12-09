<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Model representing a simple task entity 📝.
 */
class Task extends Model
{
    use HasFactory;

    // Specifies which fields can be mass-assigned when creating or updating a record
    protected $fillable = [
        'title',       // The title of the task
        'description', // Details about the task
        'status',      // Current state of the task (e.g., pending, complete)
        'due_date',    // Deadline for the task
    ];
}