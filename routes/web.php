<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Resources\ProductResource;
use App\Models\Product;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Inertia renders React pages server-side. Each route returns an Inertia
| response that maps to a component in resources/js/Pages/.
|
*/

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/products', function () {
    return Inertia::render('Shop');
});

// ── Product Detail Page ──

Route::get('/products/{product:slug}', function (Product $product) {
    abort_unless($product->is_active, 404);

    return Inertia::render('ProductDetail', [
        'product' => new ProductResource(
            $product->load(['category', 'seller'])
        ),
        'recommended' => ProductResource::collection(
            Product::where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit(4)
                ->get()
                ->load('category', 'seller')
        ),
    ]);
});

// ── Guest-Only Auth Routes ──

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/demo-login', [AuthController::class, 'demoLogin']);
});

// ── Authenticated Routes ──

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/cart', function () {
        return Inertia::render('Cart');
    });
    Route::get('/checkout', function () {
        return Inertia::render('Checkout');
    });
    Route::get('/wishlist', function () {
        return Inertia::render('Wishlist');
    });
});

