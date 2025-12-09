<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * The primary service provider for the Laravel application ⚙️.
 * It's used to register application-wide services, dependencies, 
 * configurations, and boot up essential components.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     * This method is where you register bindings (e.g., singleton classes, interfaces).
     */
    public function register(): void
    {
        // This method runs early during the framework's bootstrapping.
    }

    /**
     * Bootstrap any application services.
     * This method runs after all service providers have been registered.
     * It's typically used to define routes, view composers, event listeners, etc.
     */
    public function boot(): void
    {
        // This method runs later in the bootstrapping cycle.
    }
}