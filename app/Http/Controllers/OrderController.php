<?php

namespace App\Http\Controllers;


use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // List logged-in user's orders
    public function index(Request $request)
    {
        $orders = $request->user()->orders()->with('items.product')->latest()->get();

        return OrderResource::collection($orders);
    }

    // Show a specific order
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id && ! $request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        return new OrderResource($order->load('items.product'));
    }

    // Checkout: Convert Cart to Order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:500',
        ]);

        $user = $request->user();
        $cart = $user->cart()->with('items.product')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 400);
        }

        // Wrap checkout operations in a database transaction
        return DB::transaction(function () use ($user, $cart, $validated) {
            // Calculate grand total and verify stock
            $totalAmount = 0;

            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    throw new \Exception("Product {$item->product->name} does not have enough stock.");
                }
                $totalAmount += $item->product->price * $item->quantity;
            }

            // 1. Create the Order
            $order = $user->orders()->create([
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $validated['shipping_address'],
            ]);

            // 2. Create Order Items & Deduct Stock
            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);

                // Decrement inventory stock
                $item->product->decrement('stock', $item->quantity);
            }

            // 3. Clear the Cart
            $cart->items()->delete();

            return new OrderResource($order->load('items.product'));
        });
    }
}
