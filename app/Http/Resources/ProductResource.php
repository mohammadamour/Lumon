<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'seller' => [
                'id' => $this->seller_id,
                'name' => $this->whenLoaded('seller', fn () => $this->seller->name, 'Unknown Seller'),
            ],
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'stock' => $this->stock,
            'is_active' => $this->is_active,
            'image_url' => $this->image_url,
            'average_rating' => 0,   // Computed from reviews (Phase 6)
            'review_count' => 0,     // Computed from reviews (Phase 6)
            // Loads category details only when requested/loaded
            'category' => new CategoryResource($this->whenLoaded('category')),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
