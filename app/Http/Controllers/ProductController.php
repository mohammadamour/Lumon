<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Support\Str;

use Illuminate\Http\Request;

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

    $validated['slug'] = Str::slug($validated['name']);

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
        $validated['slug'] = Str::slug($validated['name']);
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
    // Fetch paginated products with their category
    public function index()
    {
        $products = Product::with('category')->where('is_active', true)->paginate(10);
        return ProductResource::collection($products);
    }

    // Fetch a single product by ID or slug
    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }
}
