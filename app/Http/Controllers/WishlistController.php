<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Resources\ProductResource;

class WishlistController extends Controller
{
    // Return flat array of wishlisted product IDs (for fast client-side lookup)
    public function ids(Request $request)
    {
        $ids = DB::table('wishlists')
            ->where('user_id', $request->user()->id)
            ->pluck('product_id');

        return response()->json($ids);
    }

    // Toggle wishlist status for a product
    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $userId = $request->user()->id;
        $productId = $validated['product_id'];

        $existing = DB::table('wishlists')
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            DB::table('wishlists')->where('id', $existing->id)->delete();
            return response()->json(['wishlisted' => false]);
        } else {
            DB::table('wishlists')->insert([
                'user_id' => $userId,
                'product_id' => $productId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json(['wishlisted' => true]);
        }
    }
}
