<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

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

        // ── 4. Categories (6 curated) ──

        $categoryData = [
            "Men's Clothing" => 'Stylish menswear for every occasion.',
            "Women's Clothing" => 'Trendy fashion for the modern woman.',
            "Accessories" => 'Complete your look with curated accessories.',
            "Kids' Clothing" => 'Comfortable and durable clothes for children.',
            "Home & Living" => 'Elevate your living space.',
            "Sports & Outdoors" => 'Gear up for your next adventure.'
        ];

        $categories = collect();
        foreach ($categoryData as $name => $desc) {
            $categories[$name] = Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $desc,
            ]);
        }

        // ── 5. Products (30 curated with realistic names/prices) ──
        
        $productsData = [
            // Men's Clothing
            ['name' => 'Classic Oxford Shirt', 'price' => 45.00, 'category' => "Men's Clothing", 'desc' => "A versatile Oxford cotton shirt. Features a button-down collar and a tailored fit. Available in S, M, L, XL."],
            ['name' => 'Slim Fit Chinos', 'price' => 55.00, 'category' => "Men's Clothing", 'desc' => "Comfortable and stylish slim fit chinos. Perfect for casual or semi-formal occasions. Available in S, M, L, XL."],
            ['name' => 'Vintage Denim Jacket', 'price' => 85.00, 'category' => "Men's Clothing", 'desc' => "Classic vintage wash denim jacket with multiple pockets and durable stitching. Available in S, M, L, XL."],
            ['name' => 'Merino Wool Crewneck', 'price' => 65.00, 'category' => "Men's Clothing", 'desc' => "Lightweight and warm merino wool sweater. Ideal for layering during colder months. Available in S, M, L, XL."],
            ['name' => 'Essential Basic Tee', 'price' => 15.00, 'category' => "Men's Clothing", 'desc' => "100% organic cotton t-shirt with a relaxed fit. A wardrobe essential. Available in S, M, L, XL."],

            // Women's Clothing
            ['name' => 'Floral Wrap Dress', 'price' => 60.00, 'category' => "Women's Clothing", 'desc' => "Elegant floral wrap dress with a V-neckline and flowy silhouette. Available in S, M, L, XL."],
            ['name' => 'High-Waisted Skinny Jeans', 'price' => 50.00, 'category' => "Women's Clothing", 'desc' => "Stretch denim high-waisted jeans offering comfort and a flattering fit. Available in S, M, L, XL."],
            ['name' => 'Chunky Knit Cardigan', 'price' => 70.00, 'category' => "Women's Clothing", 'desc' => "Cozy oversized chunky knit cardigan perfect for chilly evenings. Available in S, M, L, XL."],
            ['name' => 'Silk Camisole', 'price' => 35.00, 'category' => "Women's Clothing", 'desc' => "Luxurious pure silk camisole with adjustable straps. Available in S, M, L, XL."],
            ['name' => 'Tailored Linen Blazer', 'price' => 95.00, 'category' => "Women's Clothing", 'desc' => "Breathable linen blazer suitable for office wear or smart casual outings. Available in S, M, L, XL."],

            // Accessories
            ['name' => 'Leather Crossbody Bag', 'price' => 120.00, 'category' => "Accessories", 'desc' => "Genuine leather crossbody bag with adjustable strap and interior zip pocket. Size: One Size."],
            ['name' => 'Polarized Aviator Sunglasses', 'price' => 45.00, 'category' => "Accessories", 'desc' => "Classic aviator sunglasses with UV400 polarized lenses for maximum protection. Size: One Size."],
            ['name' => 'Minimalist Watch', 'price' => 85.00, 'category' => "Accessories", 'desc' => "Sleek minimalist watch with a mesh band and quartz movement. Water-resistant up to 30m. Size: One Size."],
            ['name' => 'Woven Straw Hat', 'price' => 25.00, 'category' => "Accessories", 'desc' => "Wide-brimmed woven straw hat perfect for beach days and summer outings. Size: One Size."],
            ['name' => 'Sterling Silver Hoop Earrings', 'price' => 30.00, 'category' => "Accessories", 'desc' => "Elegant 925 sterling silver hoop earrings, lightweight and hypoallergenic. Size: One Size."],

            // Kids' Clothing
            ['name' => 'Boys Graphic T-Shirt', 'price' => 15.00, 'category' => "Kids' Clothing", 'desc' => "Fun and durable graphic tee for everyday wear. Available in S, M, L."],
            ['name' => 'Girls Denim Overalls', 'price' => 25.00, 'category' => "Kids' Clothing", 'desc' => "Classic denim overalls with adjustable straps. Available in S, M, L."],
            ['name' => 'Toddler Knit Sweater', 'price' => 20.00, 'category' => "Kids' Clothing", 'desc' => "Soft and cozy knit sweater for toddlers. Available in 2T, 3T, 4T."],
            ['name' => 'Kids Waterproof Jacket', 'price' => 35.00, 'category' => "Kids' Clothing", 'desc' => "Lightweight waterproof jacket with hood. Available in S, M, L."],
            ['name' => 'Boys Cargo Pants', 'price' => 22.00, 'category' => "Kids' Clothing", 'desc' => "Durable cargo pants with multiple pockets. Available in S, M, L."],

            // Home & Living
            ['name' => 'Ceramic Table Lamp', 'price' => 45.00, 'category' => "Home & Living", 'desc' => "Modern ceramic table lamp with a linen shade. Perfect for bedside tables or living rooms."],
            ['name' => 'Linen Duvet Cover Set', 'price' => 110.00, 'category' => "Home & Living", 'desc' => "100% French flax linen duvet cover set including two pillowcases. Breathable and gets softer with every wash."],
            ['name' => 'Cast Iron Skillet', 'price' => 40.00, 'category' => "Home & Living", 'desc' => "Pre-seasoned 10-inch cast iron skillet for versatile cooking from stovetop to oven."],
            ['name' => 'Aromatherapy Diffuser', 'price' => 35.00, 'category' => "Home & Living", 'desc' => "Ultrasonic essential oil diffuser with 7 color LED lights and auto shut-off function."],
            ['name' => 'Handwoven Throw Blanket', 'price' => 55.00, 'category' => "Home & Living", 'desc' => "Cozy handwoven cotton throw blanket with tassel details. Ideal for layering on sofas or beds."],

            // Sports & Outdoors
            ['name' => 'Yoga Mat with Alignment Lines', 'price' => 30.00, 'category' => "Sports & Outdoors", 'desc' => "Eco-friendly non-slip yoga mat featuring alignment lines to help perfect your poses. Includes carrying strap."],
            ['name' => 'Adjustable Dumbbell Set', 'price' => 150.00, 'category' => "Sports & Outdoors", 'desc' => "Space-saving adjustable dumbbell set ranging from 5 to 52.5 lbs per dumbbell. Perfect for home workouts."],
            ['name' => 'Insulated Water Bottle', 'price' => 25.00, 'category' => "Sports & Outdoors", 'desc' => "32oz double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours."],
            ['name' => 'Camping Tent', 'price' => 120.00, 'category' => "Sports & Outdoors", 'desc' => "Lightweight 2-person camping tent with waterproof rainfly and easy setup design. Includes stakes and carry bag."],
            ['name' => 'Resistance Band Set', 'price' => 20.00, 'category' => "Sports & Outdoors", 'desc' => "Set of 5 premium latex resistance bands with varying tension levels. Includes door anchor, handles, and ankle straps."]
        ];

        $insertedProducts = collect();
        foreach ($productsData as $index => $item) {
            $insertedProducts->push(Product::create([
                'seller_id' => $sellers->random()->id,
                'category_id' => $categories[$item['category']]->id,
                'name' => $item['name'],
                'slug' => Str::slug($item['name']) . '-' . rand(100, 999), // Ensure uniqueness
                'description' => $item['desc'],
                'price' => $item['price'],
                'stock' => rand(10, 100),
                'is_active' => true,
                'image_url' => 'https://picsum.photos/seed/'.Str::slug($item['name']).'/640/800',
            ]));
        }

        // ── 6. Reviews ──
        $this->call(ReviewSeeder::class);

        // ── 7. Wishlist items for demo buyer ──
        // 5 random products wishlisted
        $randomProducts = $insertedProducts->random(5);
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
