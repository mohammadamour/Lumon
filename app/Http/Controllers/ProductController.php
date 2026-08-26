<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Str;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'category_id' => 'required|exists:categories,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'stock' => 'required|integer|min:0',
        'is_active' => 'boolean',
    ]);

    $validated['slug'] = $this->uniqueSlug($validated['name']);

    $product = Product::create($validated);

    return new ProductResource($product->load('category'));
}

public function update(Request $request, Product $product)
{
    $validated = $request->validate([
        'category_id' => 'sometimes|exists:categories,id',
        'name' => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'price' => 'sometimes|numeric|min:0',
        'stock' => 'sometimes|integer|min:0',
        'is_active' => 'boolean',
    ]);

    if (isset($validated['name'])) {
        $validated['slug'] = $this->uniqueSlug($validated['name'], $product);
    }

    $product->update($validated);

    return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
    $product->delete();

    return response()->json([
        'message' => 'Product deleted successfully'
    ]);
    }

    
    // List public products with search, price filters, and pagination
    public function index(Request $request)
    {
        // $products = Product::with('category')->where('is_active', true)->paginate(10);
        // return ProductResource::collection($products);

        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
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
            'sort_by' => ['nullable', 'in:price,created_at,name'],
            'sort_order' => ['nullable', 'in:asc,desc'],
        ]);

        $query = Product::with('category')->where('is_active', true);

    // Search by name or description
    if (! empty($validated['search'])) {
        $searchTerm = $validated['search'];
        $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'like', '%' . $searchTerm . '%')
              ->orWhere('description', 'like', '%' . $searchTerm . '%');
        });
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
    
    if (in_array($sortBy, ['price', 'created_at', 'name'])) {
        $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
    }

    // Paginate results (10 per page by default)
    $products = $query->paginate(10);

    return ProductResource::collection($products);

    }

    // Fetch a single product by ID or slug
    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);

        return new ProductResource($product->load('category'));
    }

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
            $slug = $baseSlug . '-' . $suffix++;
        }

        return $slug;
    }
}
