<?php

namespace App\Http\Controllers;


use App\Http\Resources\OrderResource;
use App\Jobs\SendOrderConfirmationMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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
        if ($order->user_id !== $request->user()->id && ! $request->user()->isSeller()) {
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

        // Wrap checkout operations in a database transaction
        $result = DB::transaction(function () use ($user, $validated) {
            $cart = $user->cart()->lockForUpdate()->first();

            if (! $cart) {
                return response()->json(['message' => 'Your cart is empty.'], 400);
            }

            $cartItems = $cart->items()
                ->orderBy('product_id')
                ->lockForUpdate()
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Your cart is empty.'], 400);
            }

            $products = collect();
            $totalAmount = 0;

            foreach ($cartItems as $item) {
                $product = $item->product()
                    ->lockForUpdate()
                    ->firstOrFail();

                $products->put($item->id, $product);

                if ($product->stock < $item->quantity) {
                    throw new \Exception("Product {$product->name} does not have enough stock.");
                }

                $totalAmount += $product->price * $item->quantity;
            }

            // 1. Create the Order
            $order = $user->orders()->create([
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'shipping_address' => $validated['shipping_address'],
            ]);

            // 2. Create Order Items & Deduct Stock
            foreach ($cartItems as $item) {
                $product = $products->get($item->id);

                $order->items()->create([
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                ]);

                // Decrement inventory stock
                $product->decrement('stock', $item->quantity);
            }

            // 3. Clear the Cart
            $cart->items()->delete();

            return $order->load('items.product');
        });

        // 4. Dispatch the confirmation email as a background job.
        //    This runs AFTER the transaction commits, so the order
        //    is guaranteed to exist in the database before the
        //    worker picks up this job.
        if ($result instanceof Order) {
            SendOrderConfirmationMail::dispatch($user, $result);

            return new OrderResource($result);
        }

        // If we got here, the transaction returned an error response (empty cart, etc.)
        return $result;
    }




    // Admin: View all orders across all users
            public function adminIndex(Request $request)
            {
            $orders = Order::with(['user', 'items.product'])->latest()->paginate(15);

            return OrderResource::collection($orders);
            }

            // Admin: Update order status
            public function updateStatus(Request $request, Order $order)
            {
                $validated = $request->validate([
                    'status' => ['required', Rule::in(['pending', 'processing', 'completed', 'cancelled'])],
            ]);

            $order->update([
            'status' => $validated['status'],
            ]);

        return new OrderResource($order->load('items.product'));
}
}
