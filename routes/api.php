<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'E-Commerce API initialized successfully!',
    ]);
});

// ── Public Catalog Routes ──

Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);

// ── Protected Routes (Session-based via Sanctum SPA) ──

Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', fn (Request $request) => $request->user());

    // Cart Endpoints
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy']);

    // Wishlist Endpoints
    Route::get('/wishlist/ids', [\App\Http\Controllers\WishlistController::class, 'ids']);
    Route::post('/wishlist', [\App\Http\Controllers\WishlistController::class, 'toggle']);

    // Order Endpoints
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/checkout', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});

// ── Seller-Only Product Management ──

Route::middleware(['auth:sanctum', 'seller'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // Seller Order Management
    Route::get('/seller/orders', [OrderController::class, 'adminIndex']);
    Route::patch('/seller/orders/{order}/status', [OrderController::class, 'updateStatus']);
});