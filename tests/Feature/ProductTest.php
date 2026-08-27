<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_inactive_products_are_hidden_from_the_public_list(): void
    {
        // Create a product that should not be visible in the public catalog.
        Product::factory()->create([
            'is_active' => false,
        ]);

        // Make the same request a visitor or frontend would make.
        $response = $this->getJson('/api/products');

        // The request should succeed, but the inactive product must be excluded.
        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_active_products_are_visible_in_the_public_list(): void
    {
        // Create a product that should be visible in the public catalog.
        $product = Product::factory()->create([
            'is_active' => true,
        ]);

        Product::factory()->create([
            'is_active' => false,
        ]);

        // Make the same request a visitor or frontend would make.
        $response = $this->getJson('/api/products');

        // The request should succeed, and the active product must be included.
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $product->id);
    }

    public function test_product_can_be_searched_by_name(): void
    {
        // Create a product with a specific name.
        $product = Product::factory()->create([
            'name' => 'red shoes',
            'is_active' => true,
        ]);

        Product::factory()->create([
            'name' => 'blue shoes',
            'is_active' => true,
        ]);

        // Make a request to search for the product by name.
        $response = $this->getJson('/api/products?search=red%20shoes');

        // The request should succeed, and the product must be included in the results.
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $product->id);
    }

    public function test_product_can_be_filtered_by_price_range(): void
    {
        // Create products below, inside, and above the requested price range.
        Product::factory()->create(['price' => 50.00, 'is_active' => true]);

        $matchingProduct = Product::factory()->create([
            'price' => 150.00,
            'is_active' => true,
        ]);

        Product::factory()->create(['price' => 250.00, 'is_active' => true]);

        // Make a request to filter products by price range.
        $response = $this->getJson('/api/products?min_price=100&max_price=200');

        // The request should succeed, and only the product within the price range must be included.
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $matchingProduct->id);
    }

    public function test_product_can_be_filtered_by_category(): void
    {
        // Create a category and products associated with it.
        $category = Category::factory()->create();
        $matchingProduct = Product::factory()->create([
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        Product::factory()->create([
            'is_active' => true,
        ]);

        // Make a request to filter products by category.
        $response = $this->getJson('/api/products?category_id='.$category->id);

        // The request should succeed, and only the product in the specified category must be included.
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $matchingProduct->id);
    }

    public function test_product_can_be_filtered_by_category_slug(): void
    {
        // Use an explicit slug so the request and expected category are predictable.
        $category = Category::factory()->create(['slug' => 'running-shoes']);
        $matchingProduct = Product::factory()->create([
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        Product::factory()->create(['is_active' => true]);

        $response = $this->getJson('/api/products?category=running-shoes');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $matchingProduct->id);
    }

    public function test_invalid_product_filters_return_unprocessable_entity(): void
    {
        // The API validates that the minimum price cannot exceed the maximum price.
        $response = $this->getJson('/api/products?min_price=200&max_price=100');

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['min_price', 'max_price']);
    }

    public function test_active_product_can_be_found_by_slug(): void
    {
        // Use a known slug to verify route model binding and the public lookup.
        $product = Product::factory()->create([
            'slug' => 'red-running-shoes',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/products/red-running-shoes');

        $response->assertOk()
            ->assertJsonPath('data.id', $product->id);
    }

    public function test_inactive_product_cannot_be_found_by_slug(): void
    {
        // An inactive product must remain unavailable through direct public lookup.
        Product::factory()->create([
            'slug' => 'hidden-shoes',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/products/hidden-shoes');

        $response->assertNotFound();
    }
}
