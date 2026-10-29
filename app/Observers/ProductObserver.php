<?php

namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        $this->clearProductCache();
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        $this->clearProductCache();
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        $this->clearProductCache();
    }
    
    /**
     * Clear the products cache tags safely without throwing on unsupported drivers.
     */
    private function clearProductCache(): void
    {
        try {
            if (Cache::supportsTags()) {
                Cache::tags(['products'])->flush();
            } else {
                Cache::flush();
            }
        } catch (\Throwable $e) {
            // Safe ignore if cache tag is unsupported in current environment
        }
    }
}
