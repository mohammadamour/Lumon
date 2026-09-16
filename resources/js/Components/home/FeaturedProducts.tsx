import { Link } from '@inertiajs/react';
import ProductCard from '../common/ProductCard';
import type { Product } from '@/types';

// 4 category images, each used twice across 8 cards
const CATEGORY_IMAGES = [
  '/category-men.png',
  '/category-women.png',
  '/category-accessory.png',
  '/category-kid.webp',
];

/**
 * Placeholder products for the homepage hero section.
 * Mapped to match the real `Product` type so ProductCard
 * renders them identically to real API data.
 */
const PLACEHOLDER_PRODUCTS: Product[] = [
  { id: 1,  name: 'Urban Puffer Jacket',    price: '89.99',  average_rating: 4.8, review_count: 0, slug: 'product-1', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[0], seller: { id: 1, name: 'StreetWear Co.' },   created_at: '' },
  { id: 2,  name: 'Knit Cardigan Set',      price: '54.99',  average_rating: 4.9, review_count: 0, slug: 'product-2', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[1], seller: { id: 2, name: 'Soft Threads' },     created_at: '' },
  { id: 3,  name: 'Leather Crossbody Bag',  price: '39.99',  average_rating: 4.7, review_count: 0, slug: 'product-3', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[2], seller: { id: 3, name: 'Carry Studio' },     created_at: '' },
  { id: 4,  name: 'Kids Graphic Hoodie',    price: '29.99',  average_rating: 4.8, review_count: 0, slug: 'product-4', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[3], seller: { id: 4, name: 'Little Wears' },     created_at: '' },
  { id: 5,  name: 'Slim Fit Chinos',        price: '64.99',  average_rating: 4.6, review_count: 0, slug: 'product-5', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[0], seller: { id: 1, name: 'StreetWear Co.' },   created_at: '' },
  { id: 6,  name: 'Floral Summer Dress',    price: '49.99',  average_rating: 4.9, review_count: 0, slug: 'product-6', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[1], seller: { id: 5, name: 'Bloom Boutique' },   created_at: '' },
  { id: 7,  name: 'Classic Watch Strap',    price: '19.99',  average_rating: 4.7, review_count: 0, slug: 'product-7', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[2], seller: { id: 3, name: 'Carry Studio' },     created_at: '' },
  { id: 8,  name: 'Toddler Canvas Shoes',   price: '24.99',  average_rating: 4.8, review_count: 0, slug: 'product-8', description: '', stock: 10, is_active: true, image_url: CATEGORY_IMAGES[3], seller: { id: 4, name: 'Little Wears' },     created_at: '' },
];

export default function FeaturedProducts() {

  return (
    <section id="featured" className="bg-white py-16">
      <div className="container-main">

        {/* ── Header ── */}
        <div className="mb-12 text-center">
          <p className="text-body text-muted">Featured Products</p>
          <h2 className="mt-1 text-h2 font-bold text-dark">BESTSELLER PRODUCTS</h2>
          <p className="mt-3 text-body text-muted">
            Explore top-rated items and trending favorites.
          </p>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ── Browse More Button ── */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-block rounded border-2 border-primary bg-primary px-8 py-3 font-bold text-white transition-colors hover:bg-white hover:text-primary uppercase tracking-wide"
          >
            Browse More
          </Link>
        </div>

      </div>
    </section>
  );
}
