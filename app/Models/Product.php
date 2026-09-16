<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'is_active',
        'category_id',
        'image_url',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    // ── Relationships ──

    /**
     * The category that the product belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The seller (user) who listed this product.
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    /**
     * Reviews left on this product.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // ── Computed Attributes ──

    /**
     * Average star rating (1.0–5.0), computed from all reviews.
     * Returns 0 if no reviews exist.
     */
    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    /**
     * Total number of reviews on this product.
     */
    public function getReviewCountAttribute(): int
    {
        return $this->reviews()->count();
    }
}

