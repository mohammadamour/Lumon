<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ── Demo Accounts (One-Click Recruiter Access) ──

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

        // ── Additional Sellers ──

        $seller2 = User::create([
            'name' => 'Urban Threads',
            'email' => 'urban@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        $seller3 = User::create([
            'name' => 'TechNova',
            'email' => 'technova@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        $sellers = collect([$demoSeller, $seller2, $seller3]);

        // ── Additional Buyers ──

        User::factory(4)->create(['role' => 'buyer']);

        // ── Categories ──

        $categoryData = [
            ["Men's Clothing", 'Stylish menswear for every occasion.'],
            ["Women's Clothing", 'Trendy fashion for the modern woman.'],
            ['Accessories', 'Complete your look with curated accessories.'],
            ['Electronics', 'Latest gadgets and tech essentials.'],
            ['Home & Living', 'Elevate your living space.'],
        ];

        $categories = collect($categoryData)->map(fn ($c) => Category::create([
            'name' => $c[0],
            'slug' => Str::slug($c[0]),
            'description' => $c[1],
        ]));

        // ── Products ──

        foreach ($categories as $category) {
            Product::factory()
                ->count(6)
                ->sequence(fn () => [
                    'seller_id' => $sellers->random()->id,
                ])
                ->create([
                    'category_id' => $category->id,
                ]);
        }
    }
}
