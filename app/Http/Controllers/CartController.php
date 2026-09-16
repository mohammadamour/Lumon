<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{
   // View authenticated user's cart
    public function index(Request $request)
    {
        $cart = $request->user()->cart()->firstOrCreate([]);
        $cart->load('items.product.seller');

        return new CartResource($cart);
    }

    // Add item or increment quantity if already present
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $quantity = $validated['quantity'] ?? 1;
        $product = Product::findOrFail($validated['product_id']);

        // Check product stock availability
        if ($product->stock < $quantity) {
            return response()->json(['message' => 'Requested quantity exceeds available stock.'], 400);
        }

        $cart = $request->user()->cart()->firstOrCreate([]);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;
            if ($product->stock < $newQuantity) {
                return response()->json(['message' => 'Total cart quantity exceeds available stock.'], 400);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        $cart->load('items.product.seller');

        return new CartResource($cart);
    }

    // Update specific cart item quantity
    public function update(Request $request, CartItem $cartItem)
    {
        // Authorize that cart item belongs to logged in user
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($cartItem->product->stock < $validated['quantity']) {
            return response()->json(['message' => 'Requested quantity exceeds available stock.'], 400);
        }

        $cartItem->update(['quantity' => $validated['quantity']]);

        $cart = $request->user()->cart->load('items.product.seller');

        return new CartResource($cart);
    }

    // Remove item from cart
    public function destroy(Request $request, CartItem $cartItem)
    {
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart successfully.']);
    }
}
