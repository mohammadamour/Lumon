<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_categories_can_be_listed(): void
    {
        // Create a category that should be returned by the public category list.
        $category = Category::factory()->create();

        $response = $this->getJson('/api/categories');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $category->id);
    }

    public function test_category_includes_only_active_products(): void
    {
        // Attach one visible and one hidden product to the same category.
        $category = Category::factory()->create();
        $activeProduct = Product::factory()->create([
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        Product::factory()->create([
            'category_id' => $category->id,
            'is_active' => false,
        ]);

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertOk()
            ->assertJsonCount(1, 'data.products')
            ->assertJsonPath('data.products.0.id', $activeProduct->id);
    }

    public function test_unknown_category_returns_not_found(): void
    {
        // No category exists with this ID, so route model binding should return 404.
        $response = $this->getJson('/api/categories/999999');

        $response->assertNotFound();
    }
}
