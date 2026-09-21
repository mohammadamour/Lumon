<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('rolls back the checkout transaction if a product runs out of stock midway', function () {
    // 1. Setup: A user with a cart and an item
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 50.00,
        'stock' => 10,
    ]);
    
    $cart = $user->cart()->create();
    $cartItem = $cart->items()->create([
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    // 2. Simulate race condition: Another process buys the last stock just before this checkout
    $product->update(['stock' => 1]); // Now there is only 1 left, but cart wants 2!

    // 3. Act: Attempt to checkout
    $response = $this->actingAs($user, 'sanctum')
        ->postJson('/api/checkout', [
            'shipping_address' => '123 Main Street',
        ]);

    // 4. Assert: The request fails with an exception (500)
    $response->assertStatus(500);
    $response->assertSee('does not have enough stock');

    // 5. Assert: Transaction rolled back (no order created, cart still exists)
    $this->assertDatabaseCount('orders', 0);
    
    $this->assertDatabaseHas('cart_items', [
        'id' => $cartItem->id,
        'quantity' => 2, // Cart remains untouched
    ]);
});
