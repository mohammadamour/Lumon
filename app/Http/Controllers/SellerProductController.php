<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SellerProductController extends Controller
{
    /**
     * List the authenticated seller's own products.
     */
    public function index(Request $request)
    {
        $products = $request->user()
            ->products()
            ->with(['category'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->latest()
            ->paginate(20);

        return ProductResource::collection($products);
    }

    /**
     * Create a new product for the authenticated seller.
     * Supports file upload for the product image.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/'.$path;
        }

        // Remove the 'image' key (it's the file, not a DB column)
        unset($validated['image']);

        $validated['seller_id'] = $request->user()->id;
        $validated['slug'] = $this->uniqueSlug($validated['name']);

        $product = Product::create($validated);

        return new ProductResource($product->load(['category', 'seller']));
    }

    /**
     * Update a seller's own product.
     */
    public function update(Request $request, Product $product)
    {
        // Ownership check
        if ($product->seller_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only manage your own products.',
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['image_url'] = '/storage/'.$path;
        }

        unset($validated['image']);

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $product);
        }

        $product->update($validated);

        return new ProductResource($product->load(['category', 'seller']));
    }

    /**
     * Soft-delete a product (set is_active = false).
     * We preserve order history by not hard-deleting.
     */
    public function destroy(Request $request, Product $product)
    {
        if ($product->seller_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only manage your own products.',
            ], 403);
        }

        $product->update(['is_active' => false]);

        return response()->json([
            'message' => 'Product removed from your listings.',
        ]);
    }

    /**
     * Generate a unique slug for a product.
     */
    private function uniqueSlug(string $name, ?Product $ignoreProduct = null): string
    {
        $baseSlug = Str::slug($name) ?: Str::random(8);
        $slug = $baseSlug;
        $suffix = 2;

        while (
            Product::where('slug', $slug)
                ->when($ignoreProduct, fn ($query) => $query->whereKeyNot($ignoreProduct->getKey()))
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$suffix++;
        }

        return $slug;
    }
}
