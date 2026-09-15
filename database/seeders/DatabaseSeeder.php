<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

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
            'name' => 'Demo Seller',
            'email' => 'seller@lumon.demo',
            'password' => Hash::make('password'),
            'role' => 'seller',
        ]);

        // ── Categories & Products ──

        Category::factory(5)
            ->has(Product::factory()->count(10))
            ->create();
    }
}
