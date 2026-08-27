<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_the_cart(): void
    {
        // Cart data is private, so an unauthenticated request must be rejected.
        $response = $this->getJson('/api/cart');

        $response->assertUnauthorized();
    }

    public function test_authenticated_user_can_view_an_empty_cart(): void
    {
        $user = User::factory()->create();

        // Visiting the cart for the first time should create an empty cart for the user.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/cart');

        $response->assertCreated()
            ->assertJsonCount(0, 'data.items')
            ->assertJsonPath('data.grand_total', 0);

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_add_a_product_to_the_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 25.00,
            'stock' => 10,
        ]);

        // Adding a product should create one cart item with the requested quantity.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        $response->assertCreated()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.product_id', $product->id)
            ->assertJsonPath('data.items.0.quantity', 2)
            ->assertJsonPath('data.items.0.subtotal', 50)
            ->assertJsonPath('data.grand_total', 50);
    }

    public function test_adding_the_same_product_increments_its_quantity(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);

        // The second add should update the existing row instead of creating a duplicate.
        $this->actingAs($user, 'sanctum')->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/cart', [
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $response->assertOk()
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.quantity', 5);

        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_cart_item_quantity_can_be_updated(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        $cart = $user->cart()->create();
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Updating an item should persist the new quantity for the authenticated user's cart.
        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/cart/items/{$cartItem->id}", [
                'quantity' => 4,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.items.0.quantity', 4);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 4,
        ]);
    }

    public function test_cart_item_can_be_removed(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $cart = $user->cart()->create();
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Removing an item should delete it and return a confirmation message.
        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/cart/items/{$cartItem->id}");

        $response->assertOk()
            ->assertJsonPath('message', 'Item removed from cart successfully.');

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    public function test_product_cannot_be_added_beyond_available_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 2]);

        // The API should reject a requested quantity greater than current stock.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart', [
                'product_id' => $product->id,
                'quantity' => 3,
            ]);

        $response->assertStatus(400)
            ->assertJsonPath('message', 'Requested quantity exceeds available stock.');
    }

    public function test_cart_request_validates_product_and_quantity(): void
    {
        $user = User::factory()->create();

        // Missing and invalid values should be rejected before cart data is changed.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/cart', [
                'product_id' => 999999,
                'quantity' => 0,
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['product_id', 'quantity']);
    }

    public function test_user_cannot_update_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $product = Product::factory()->create();
        $cart = $owner->cart()->create();
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // A cart item must only be editable by the user who owns its cart.
        $response = $this->actingAs($otherUser, 'sanctum')
            ->putJson("/api/cart/items/{$cartItem->id}", [
                'quantity' => 2,
            ]);

        $response->assertForbidden();

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 1,
        ]);
    }

    public function test_user_cannot_remove_another_users_cart_item(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $product = Product::factory()->create();
        $cart = $owner->cart()->create();
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // A cart item must only be removable by the user who owns its cart.
        $response = $this->actingAs($otherUser, 'sanctum')
            ->deleteJson("/api/cart/items/{$cartItem->id}");

        $response->assertForbidden();

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
        ]);
    }
}
