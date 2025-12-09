<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

/**
 * Custom console commands are defined here. 
 * This file registers a simple 'inspire' command provided by Laravel's core. 💡
 */

// Define a new Artisan command using a closure
Artisan::command('inspire', function () {
    // Output the inspiring quote retrieved from the Inspiring class
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote'); // Provide a short description for the 'php artisan list' command

?>