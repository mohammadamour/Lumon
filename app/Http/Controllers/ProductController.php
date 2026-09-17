<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * List public products with search, category, price filters, sorting, and pagination.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'category' => ['nullable', 'string', 'max:255', 'exists:categories,slug'],
            'seller_id' => ['nullable', 'integer', 'exists:users,id'],
            'min_price' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::when($request->filled('max_price'), ['lte:max_price']),
            ],
            'max_price' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::when($request->filled('min_price'), ['gte:min_price']),
            ],
            'sort_by' => ['nullable', 'in:price,created_at,name,rating'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:48'],
        ]);

        $query = Product::with(['category', 'seller'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->where('is_active', true);

        // Search by name or description
        if (! empty($validated['search'])) {
            $searchTerm = $validated['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%'.$searchTerm.'%')
                  ->orWhere('description', 'like', '%'.$searchTerm.'%');
            });
        }

        // Filter by category ID
        if (isset($validated['category_id'])) {
            $query->where('category_id', $validated['category_id']);
        }

        // Filter by category slug
        if (! empty($validated['category'])) {
            $query->whereHas('category', function ($categoryQuery) use ($validated) {
                $categoryQuery->where('slug', $validated['category']);
            });
        }

        // Filter by seller
        if (isset($validated['seller_id'])) {
            $query->where('seller_id', $validated['seller_id']);
        }

        // Filter by minimum price
        if (isset($validated['min_price'])) {
            $query->where('price', '>=', $validated['min_price']);
        }

        // Filter by maximum price
        if (isset($validated['max_price'])) {
            $query->where('price', '<=', $validated['max_price']);
        }

        // Sort products (default to latest)
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';

        if ($sortBy === 'rating') {
            $query->orderBy('reviews_avg_rating', $sortOrder === 'asc' ? 'asc' : 'desc');
        } elseif (in_array($sortBy, ['price', 'created_at', 'name'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        // Paginate results (12 per page by default)
        $perPage = $validated['per_page'] ?? 12;
        $products = $query->paginate($perPage)->withQueryString();

        return ProductResource::collection($products);
    }

    /**
     * Fetch a single product by slug.
     */
    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);

        return new ProductResource($product->load(['category', 'seller']));
    }

    /**
     * Create a new product (seller only).
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
            'image_url' => 'nullable|url|max:2048',
        ]);

        $validated['seller_id'] = $request->user()->id;
        $validated['slug'] = $this->uniqueSlug($validated['name']);

        $product = Product::create($validated);

        return new ProductResource($product->load(['category', 'seller']));
    }

    /**
     * Update an existing product (seller only, own products).
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'is_active' => 'boolean',
            'image_url' => 'nullable|url|max:2048',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = $this->uniqueSlug($validated['name'], $product);
        }

        $product->update($validated);

        return new ProductResource($product->load(['category', 'seller']));
    }

    /**
     * Delete a product (seller only).
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
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
