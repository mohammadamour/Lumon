<?php

namespace Tests\Browser;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CheckoutFlowTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * Test the golden path checkout flow visually via a browser.
     */
    public function test_user_can_visually_checkout(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'name' => 'Signature Lumon Widget',
            'price' => 199.99,
            'stock' => 50,
            'is_active' => true,
        ]);

        $this->browse(function (Browser $browser) use ($user, $product) {
            // 1. Visit the homepage and login
            $browser->loginAs($user)
                    ->visit('/')
                    ->assertSee('Lumon');

            // 2. Navigate to the product page
            $browser->visit('/products/' . $product->slug)
                    ->waitForText('Signature Lumon Widget')
                    ->assertSee('199.99');

            // 3. Add to cart
            $browser->press('Add to Cart')
                    ->waitForText('Item added to cart');

            // 4. Navigate to checkout and complete purchase
            $browser->visit('/checkout')
                    ->waitForText('Checkout')
                    ->type('shipping_address', '456 Test Avenue, Automata City')
                    ->press('Complete Purchase')
                    // 5. Assert successful redirect to orders page
                    ->waitForRoute('orders.index', [], 5) // wait up to 5 seconds
                    ->assertSee('Order Details')
                    ->assertSee('pending')
                    ->assertSee('456 Test Avenue');
        });
    }
}
