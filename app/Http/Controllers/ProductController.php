<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;

use Illuminate\Http\Request;

class ProductController extends Controller
{
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
