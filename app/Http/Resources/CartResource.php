<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $items = CartItemResource::collection($this->whenLoaded('items'));
        $total = $this->items ? $this->items->sum(fn ($item) => $item->product->price * $item->quantity) : 0;

        return [
            'id' => $this->id,
            'items' => $items,
            'grand_total' => (float) $total,
        ];
    }
}
