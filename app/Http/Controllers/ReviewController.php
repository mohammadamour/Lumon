<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * List paginated reviews for a product.
     */
    public function index(Product $product)
    {
        $reviews = $product->reviews()
            ->with('user')
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }

    /**
     * Create a review for a product.
     * - Only authenticated buyers can review.
     * - Sellers cannot review their own product.
     * - One review per user per product (enforced by DB unique constraint).
     */
    public function store(Request $request, Product $product)
    {
        // Sellers can't review their own products
        if ($product->seller_id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot review your own product.',
            ], 403);
        }

        // Check if user already reviewed this product
        $existing = Review::where('product_id', $product->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You have already reviewed this product. You can edit your existing review instead.',
            ], 422);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = $product->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        $review->load('user');

        return new ReviewResource($review);
    }

    /**
     * Update own review.
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);
        $review->load('user');

        return new ReviewResource($review);
    }

    /**
     * Delete own review.
     */
    public function destroy(Request $request, Review $review)
    {
        if ($review->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
