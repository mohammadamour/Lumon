<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(
            Category::withCount(['products' => fn ($q) => $q->where('is_active', true)])->get()
        );
    }

    public function show(Category $category)
    {
        return new CategoryResource($category->load([
            'products' => function ($query) {
                $query->where('is_active', true);
            },
        ]));
    }
}
