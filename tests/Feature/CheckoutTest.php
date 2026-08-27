<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_checkout(): void
    {
        // Checkout contains private cart and address data, so guests must be rejected.
        $response = $this->postJson('/api/checkout', [
            'shipping_address' => '123 Main Street',
        ]);

        $response->assertUnauthorized();
    }

    public function test_checkout_requires_a_shipping_address(): void
    {
        $user = User::factory()->create();

        // The shipping address is required before an order can be created.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/checkout', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['shipping_address']);
    }

    public function test_user_cannot_checkout_an_empty_cart(): void
    {
        $user = User::factory()->create();

        // A user without a cart or cart items cannot create an order.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/checkout', [
                'shipping_address' => '123 Main Street',
            ]);

        $response->assertStatus(400)
            ->assertJsonPath('message', 'Your cart is empty.');

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_user_can_checkout_their_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 25.00,
            'stock' => 10,
        ]);
        $cart = $user->cart()->create();
        $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        // Checkout should convert the cart into one pending order.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/checkout', [
                'shipping_address' => '123 Main Street',
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.shipping_address', '123 Main Street')
            ->assertJsonPath('data.total_amount', 50)
            ->assertJsonCount(1, 'data.items')
            ->assertJsonPath('data.items.0.product_id', $product->id)
            ->assertJsonPath('data.items.0.quantity', 2)
            ->assertJsonPath('data.items.0.price', 25)
            ->assertJsonPath('data.items.0.subtotal', 50);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
            'shipping_address' => '123 Main Street',
            'total_amount' => 50.00,
        ]);
    }

    public function test_checkout_deducts_stock_and_clears_the_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10]);
        $cart = $user->cart()->create();
        $cartItem = $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        // Inventory is reserved by reducing stock and removing purchased cart items.
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/checkout', [
                'shipping_address' => '456 Oak Avenue',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 7,
        ]);
        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }
}
