<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class ReviewSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Supplementary review templates used to pad out products
     * beyond the 3 reviews the API provides.
     */
    private const TEMPLATES = [
        'Absolutely love this! The quality is way better than I expected for the price.',
        'Highly recommend. It arrived quickly and works exactly as described.',
        'Really solid purchase. I\'ve been using it every day since I got it.',
        'Exceeded my expectations. The design is sleek and it feels very premium.',
        'Good product overall. There are a few minor things I would change, but I\'m happy with it.',
        'Fantastic value for money. I\'ll definitely be buying from this seller again.',
        'Exactly what I was looking for. Fits perfectly into my daily routine.',
        'Impressive build quality. You can tell they paid attention to the details.',
        'I bought this as a gift and they absolutely loved it. Highly recommended.',
        'Great customer service and a great product to match. Five stars!',
        'Does the job perfectly. I was a bit skeptical at first, but it completely won me over.',
        'Very satisfied with my purchase. It\'s exactly like the pictures.',
        'One of the best purchases I\'ve made recently. The quality is outstanding.',
        'It\'s pretty good! Met all my expectations and then some.',
        'Love the attention to detail. Definitely worth the investment.',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $buyers = User::where('role', 'buyer')->get();

        if ($buyers->isEmpty()) {
            return;
        }

        // Build a lookup of local products keyed by name for fast matching
        $localProducts = Product::all()->keyBy('name');

        try {
            $response = Http::timeout(15)->get('https://dummyjson.com/products', [
                'limit' => 200,
                'select' => 'title,reviews',
            ]);

            if (!$response->successful()) {
                throw new \RuntimeException('DummyJSON API returned status ' . $response->status());
            }

            $apiProducts = $response->json('products');
            $apiReviewCount = 0;

            foreach ($apiProducts as $apiProduct) {
                $localProduct = $localProducts->get($apiProduct['title']);

                // Skip API products that weren't imported (unmapped categories)
                if (!$localProduct) {
                    continue;
                }

                // Shuffle buyers so we can assign unique reviewers sequentially
                $availableBuyers = $buyers->shuffle()->values();
                $assignedCount = 0;
                $maxReviews = min(5, $buyers->count()); // Cap at available buyers (unique constraint)

                // ── Import API reviews (up to 3) ──
                $apiReviews = $apiProduct['reviews'] ?? [];
                foreach ($apiReviews as $apiReview) {
                    if ($assignedCount >= $maxReviews) {
                        break;
                    }

                    Review::updateOrCreate(
                        [
                            'product_id' => $localProduct->id,
                            'user_id'    => $availableBuyers[$assignedCount]->id,
                        ],
                        [
                            'rating'  => max(1, min(5, $apiReview['rating'])),
                            'comment' => $apiReview['comment'],
                        ]
                    );

                    $assignedCount++;
                    $apiReviewCount++;
                }

                // ── Supplement with 1–2 template reviews ──
                $extraCount = rand(1, 2);
                for ($i = 0; $i < $extraCount; $i++) {
                    if ($assignedCount >= $maxReviews) {
                        break;
                    }

                    $rating = rand(1, 100) <= 80 ? 5 : (rand(1, 100) <= 75 ? 4 : 3);

                    Review::updateOrCreate(
                        [
                            'product_id' => $localProduct->id,
                            'user_id'    => $availableBuyers[$assignedCount]->id,
                        ],
                        [
                            'rating'  => $rating,
                            'comment' => self::TEMPLATES[array_rand(self::TEMPLATES)],
                        ]
                    );

                    $assignedCount++;
                }
            }

            $totalReviews = Review::count();
            $this->command->info("✓ Imported {$apiReviewCount} API reviews + supplemented to {$totalReviews} total reviews.");

        } catch (\Exception $e) {
            // Fallback: use template-only reviews if API is unreachable
            $this->command->warn("⚠ DummyJSON API unavailable ({$e->getMessage()}). Using template-only reviews.");

            // Clear any partially-inserted reviews from the failed API path
            Review::truncate();

            Product::chunk(50, function ($products) use ($buyers) {
                foreach ($products as $product) {
                    $numReviews = rand(2, min(5, $buyers->count()));
                    $reviewers = $buyers->random($numReviews);

                    foreach ($reviewers as $reviewer) {
                        $rating = rand(1, 100) <= 80 ? 5 : (rand(1, 100) <= 75 ? 4 : 3);

                        Review::create([
                            'product_id' => $product->id,
                            'user_id'    => $reviewer->id,
                            'rating'     => $rating,
                            'comment'    => self::TEMPLATES[array_rand(self::TEMPLATES)],
                        ]);
                    }
                }
            });

            $this->command->info("✓ Generated " . Review::count() . " template-based reviews (fallback).");
        }
    }
}
