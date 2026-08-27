<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Category;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word(3, true);
        return [
            'category_id' => Category::factory(), // Automatically creates a category if needed
            'name' =>ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 500), // Random price between 10.00 and 500.00
            'stock' => fake()->numberBetween(0, 50),
            'is_active' => true,
        ];
    }
}
