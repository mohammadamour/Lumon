<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_product(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $category = Category::factory()->create();

        // Admin product creation should persist the supplied catalog data.
        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/seller/products', [
                'category_id' => $category->id,
                'name' => 'Red Running Shoes',
                'description' => 'Lightweight running shoes',
                'price' => 89.99,
                'stock' => 12,
                'is_active' => true,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Red Running Shoes')
            ->assertJsonPath('data.slug', 'red-running-shoes')
            ->assertJsonPath('data.category.id', $category->id);

        $this->assertDatabaseHas('products', [
            'name' => 'Red Running Shoes',
            'slug' => 'red-running-shoes',
            'category_id' => $category->id,
        ]);
    }

    public function test_non_admin_cannot_create_a_product(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        // Ordinary customers must not access the admin product endpoint.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/seller/products', [
                'category_id' => $category->id,
                'name' => 'Restricted Product',
                'price' => 10,
                'stock' => 1,
            ]);

        $response->assertForbidden();
    }

    public function test_admin_product_creation_validates_required_fields(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);

        // Required catalog fields must be supplied before a product is created.
        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/seller/products', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'category_id',
                'name',
                'price',
                'stock',
            ]);
    }

    public function test_admin_can_update_a_product(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $product = Product::factory()->create(['name' => 'Old Name', 'seller_id' => $admin->id]);

        // An administrator should be able to update product catalog fields.
        $response = $this->actingAs($admin, 'sanctum')
            ->putJson("/api/seller/products/{$product->id}", [
                'name' => 'New Name',
                'price' => 49.99,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'New Name')
            ->assertJsonPath('data.slug', 'new-name');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'New Name',
            'slug' => 'new-name',
        ]);
    }

    public function test_admin_can_delete_a_product(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $product = Product::factory()->create(['seller_id' => $admin->id]);

        // Deleting a product should remove it from the catalog.
        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/seller/products/{$product->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Product removed from your listings.');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'is_active' => false,
        ]);
    }

    public function test_product_slugs_are_unique_when_names_repeat(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $category = Category::factory()->create();
        Product::factory()->create(['name' => 'Same Name', 'slug' => 'same-name']);

        // Reusing a product name should generate a distinct slug.
        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/seller/products', [
                'category_id' => $category->id,
                'name' => 'Same Name',
                'price' => 20,
                'stock' => 5,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.slug', 'same-name-2');
    }
}
