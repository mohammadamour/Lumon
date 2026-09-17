<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\SellerProductController;

$user = User::where('role', 'seller')->first();
if (!$user) {
    die("No seller found\n");
}

$request = Request::create('/api/seller/products', 'POST', [
    'category_id' => \App\Models\Category::first()->id,
    'name' => 'Test Product Script',
    'description' => 'Description test',
    'price' => '10.50',
    'stock' => '100',
    'is_active' => '1',
]);
$request->setUserResolver(function () use ($user) {
    return $user;
});

try {
    $controller = new SellerProductController();
    $response = $controller->store($request);
    echo "Success!\n";
    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
