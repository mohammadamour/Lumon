<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Maps DummyJSON API categories → Lumon's 4 main categories.
     * Any API category not listed here will be skipped.
     */
    private const CATEGORY_MAP = [
        // Men's Clothing
        'mens-shirts'       => "Men's Clothing",
        'mens-shoes'        => "Men's Clothing",

        // Women's Clothing
        'tops'              => "Women's Clothing",
        'womens-dresses'    => "Women's Clothing",
        'womens-shoes'      => "Women's Clothing",

        // Accessories
        'womens-bags'       => "Accessories",
        'womens-jewellery'  => "Accessories",
        'womens-watches'    => "Accessories",
        'mens-watches'      => "Accessories",
        'sunglasses'        => "Accessories",

        // Electronics
        'laptops'           => "Electronics",
        'smartphones'       => "Electronics",
        'tablets'           => "Electronics",
        'mobile-accessories'=> "Electronics",
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── 1. Demo accounts ──

        $demoBuyer = User::create([
            'name' => 'Demo Buyer',
            'email' => 'buyer@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'buyer',
        ]);

        $demoSeller = User::create([
            'name' => 'Lumon Essentials',
            'email' => 'seller@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // ── 2. Additional Sellers (3 total) ──

        $sellers = collect([$demoSeller]);
        $sellers->push(User::create([
            'name' => 'Urban Threads',
            'email' => 'urban@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]));
        $sellers->push(User::create([
            'name' => 'TechNova',
            'email' => 'technova@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]));

        // ── 3. Additional Buyers (5 total) ──

        $buyers = collect([$demoBuyer]);
        User::factory(4)->create(['role' => 'buyer'])->each(fn($u) => $buyers->push($u));

        // ── 4. Categories (4 curated — unchanged structure) ──

        $categoryData = [
            "Men's Clothing"   => 'Stylish menswear for every occasion.',
            "Women's Clothing"  => 'Trendy fashion for the modern woman.',
            "Accessories"       => 'Complete your look with curated accessories.',
            "Electronics"       => 'Latest gadgets and electronic devices.',
        ];

        $categories = collect();
        foreach ($categoryData as $name => $desc) {
            $categories[$name] = Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $desc,
            ]);
        }

        // ── 5. Products (fetched from DummyJSON API) ──

        $insertedProducts = collect();

        try {
            $response = Http::timeout(15)->get('https://dummyjson.com/products', [
                'limit' => 200,
                'select' => 'title,description,price,stock,category,thumbnail,reviews',
            ]);

            if (!$response->successful()) {
                throw new \RuntimeException('DummyJSON API returned status ' . $response->status());
            }

            $apiProducts = $response->json('products');
            $this->command->info("✓ Fetched " . count($apiProducts) . " products from DummyJSON API.");

            foreach ($apiProducts as $item) {
                // Skip products whose API category doesn't map to our 4 categories
                $lumonCategory = self::CATEGORY_MAP[$item['category']] ?? null;
                if (!$lumonCategory) {
                    continue;
                }

                $insertedProducts->push(Product::create([
                    'seller_id'   => $sellers->random()->id,
                    'category_id' => $categories[$lumonCategory]->id,
                    'name'        => $item['title'],
                    'slug'        => Str::slug($item['title']) . '-' . Str::random(5),
                    'description' => $item['description'],
                    'price'       => $item['price'],
                    'stock'       => $item['stock'],
                    'is_active'   => true,
                    'image_url'   => $item['thumbnail'],
                ]));
            }

            $this->command->info("✓ Inserted " . $insertedProducts->count() . " products into the database.");

        } catch (\Exception $e) {
            // Fallback: generate products with factory if API is unreachable
            $this->command->warn("⚠ DummyJSON API unavailable ({$e->getMessage()}). Using factory fallback.");

            $categoryIds = $categories->pluck('id');
            Product::factory(50)->create([
                'seller_id'   => fn() => $sellers->random()->id,
                'category_id' => fn() => $categoryIds->random(),
                'is_active'   => true,
            ])->each(fn($p) => $insertedProducts->push($p));

            $this->command->info("✓ Generated 50 fallback products via factory.");
        }

        // ── 6. Reviews ──
        $this->call(ReviewSeeder::class);

        // ── 7. Wishlist items for demo buyer ──
        $wishlistCount = min(8, $insertedProducts->count());
        $randomProducts = $insertedProducts->random($wishlistCount);
        foreach ($randomProducts as $product) {
            DB::table('wishlists')->insert([
                'user_id' => $demoBuyer->id,
                'product_id' => $product->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
