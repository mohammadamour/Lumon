<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
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

        $searchTerm = $validated['search'] ?? '';

        if ($searchTerm) {
            try {
                $query = Product::search($searchTerm);

                // Meilisearch filters
                if (isset($validated['category_id'])) {
                    $query->where('category_id', $validated['category_id']);
                }
                if (isset($validated['seller_id'])) {
                    $query->where('seller_id', $validated['seller_id']);
                }
                if (isset($validated['min_price'])) {
                    $query->where('price', '>=', $validated['min_price']);
                }
                if (isset($validated['max_price'])) {
                    $query->where('price', '<=', $validated['max_price']);
                }

                // Hydrate with Eloquent relations and computed properties
                $query->query(function ($builder) use ($validated) {
                    $builder->with(['category', 'seller'])
                        ->withAvg('reviews', 'rating')
                        ->withCount('reviews')
                        ->where('is_active', true);

                    if (! empty($validated['category'])) {
                        $builder->whereHas('category', function ($categoryQuery) use ($validated) {
                            $categoryQuery->where('slug', $validated['category']);
                        });
                    }
                });

                $sortBy = $validated['sort_by'] ?? 'created_at';
                $sortOrder = $validated['sort_order'] ?? 'desc';
                if ($sortBy === 'price') {
                    $query->orderBy('price', $sortOrder);
                }

                $perPage = $validated['per_page'] ?? 12;
                $products = $query->paginate($perPage)->withQueryString();
            } catch (\Exception $e) {
                // Fallback to database LIKE search if Meilisearch is unavailable
                report($e);
                
                $query = Product::with(['category', 'seller'])
                    ->withAvg('reviews', 'rating')
                    ->withCount('reviews')
                    ->where('is_active', true)
                    ->where(function ($q) use ($searchTerm) {
                        $q->where('name', 'LIKE', "%{$searchTerm}%")
                          ->orWhere('description', 'LIKE', "%{$searchTerm}%");
                    });

                if (isset($validated['category_id'])) {
                    $query->where('category_id', $validated['category_id']);
                }
                if (! empty($validated['category'])) {
                    $query->whereHas('category', function ($categoryQuery) use ($validated) {
                        $categoryQuery->where('slug', $validated['category']);
                    });
                }
                if (isset($validated['seller_id'])) {
                    $query->where('seller_id', $validated['seller_id']);
                }
                if (isset($validated['min_price'])) {
                    $query->where('price', '>=', $validated['min_price']);
                }
                if (isset($validated['max_price'])) {
                    $query->where('price', '<=', $validated['max_price']);
                }

                $sortBy = $validated['sort_by'] ?? 'created_at';
                $sortOrder = $validated['sort_order'] ?? 'desc';

                if ($sortBy === 'rating') {
                    $query->orderBy('reviews_avg_rating', $sortOrder === 'asc' ? 'asc' : 'desc');
                } elseif (in_array($sortBy, ['price', 'created_at', 'name'])) {
                    $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
                }

                $perPage = $validated['per_page'] ?? 12;
                $products = $query->paginate($perPage)->withQueryString();
            }
        } else {
            // No search term — use standard Eloquent query
            $query = Product::with(['category', 'seller'])
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->where('is_active', true);

            if (isset($validated['category_id'])) {
                $query->where('category_id', $validated['category_id']);
            }
            if (! empty($validated['category'])) {
                $query->whereHas('category', function ($categoryQuery) use ($validated) {
                    $categoryQuery->where('slug', $validated['category']);
                });
            }
            if (isset($validated['seller_id'])) {
                $query->where('seller_id', $validated['seller_id']);
            }
            if (isset($validated['min_price'])) {
                $query->where('price', '>=', $validated['min_price']);
            }
            if (isset($validated['max_price'])) {
                $query->where('price', '<=', $validated['max_price']);
            }

            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortOrder = $validated['sort_order'] ?? 'desc';

            if ($sortBy === 'rating') {
                $query->orderBy('reviews_avg_rating', $sortOrder === 'asc' ? 'asc' : 'desc');
            } elseif (in_array($sortBy, ['price', 'created_at', 'name'])) {
                $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
            }

            $perPage = $validated['per_page'] ?? 12;
            $products = $query->paginate($perPage)->withQueryString();
        }

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
}

