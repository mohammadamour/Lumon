<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_list_orders(): void
    {
        // Orders contain private customer data, so guests must be rejected.
        $response = $this->getJson('/api/orders');

        $response->assertUnauthorized();
    }

    public function test_user_can_list_only_their_own_orders(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $userOrder = $this->createOrder($user->id);
        $this->createOrder($otherUser->id);

        // The customer order list must never expose another user's orders.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/orders');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $userOrder->id);
    }

    public function test_order_owner_can_view_order_details(): void
    {
        $user = User::factory()->create();
        $order = $this->createOrder($user->id, [
            'user_id' => $user->id,
            'status' => 'pending',
            'shipping_address' => '123 Main Street',
        ]);

        // The order owner should be able to retrieve the complete order resource.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/orders/{$order->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $order->id)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.shipping_address', '123 Main Street');
    }

    public function test_user_cannot_view_another_users_order(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $order = $this->createOrder($owner->id);

        // Customers may view only orders that belong to their own account.
        $response = $this->actingAs($otherUser, 'sanctum')
            ->getJson("/api/orders/{$order->id}");

        $response->assertForbidden();
    }

    public function test_unknown_order_returns_not_found(): void
    {
        $user = User::factory()->create();

        // Route model binding should return 404 when the order does not exist.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/orders/999999');

        $response->assertNotFound();
    }

    public function test_admin_can_list_all_orders(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $firstUser = User::factory()->create();
        $secondUser = User::factory()->create();
        $this->createOrder($firstUser->id);
        $this->createOrder($secondUser->id);

        // Admins can inspect the complete paginated order list.
        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/seller/orders');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2);
    }

    public function test_non_admin_cannot_list_all_orders(): void
    {
        $user = User::factory()->create();

        // The admin endpoint must reject ordinary authenticated customers.
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/seller/orders');

        $response->assertForbidden();
    }

    public function test_admin_can_update_order_status(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $owner = User::factory()->create();
        $order = $this->createOrder($owner->id, [
            'status' => 'pending',
        ]);

        // Admin status changes should be returned and persisted on the order.
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/seller/orders/{$order->id}/status", [
                'status' => 'processing',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.id', $order->id)
            ->assertJsonPath('data.status', 'processing');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'processing',
        ]);
    }

    public function test_order_status_must_be_valid(): void
    {
        $admin = User::factory()->create(['role' => 'seller']);
        $owner = User::factory()->create();
        $order = $this->createOrder($owner->id);

        // Status updates must use one of the states supported by the API.
        $response = $this->actingAs($admin, 'sanctum')
            ->patchJson("/api/seller/orders/{$order->id}/status", [
                'status' => 'shipped',
            ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_non_admin_cannot_update_order_status(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $order = $this->createOrder($owner->id);

        // Only administrators may change order workflow state.
        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/seller/orders/{$order->id}/status", [
                'status' => 'completed',
            ]);

        $response->assertForbidden();
    }

    private function createOrder(int $userId, array $attributes = []): Order
    {
        return Order::create(array_merge([
            'user_id' => $userId,
            'total_amount' => 25.00,
            'status' => 'pending',
            'shipping_address' => '123 Main Street',
        ], $attributes));
    }
}
