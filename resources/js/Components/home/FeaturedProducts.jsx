import { Link } from '@inertiajs/react';
import ProductCard from '../common/ProductCard';

// 4 category images, each used twice across 8 cards
const CATEGORY_IMAGES = [
  '/category-men.png',
  '/category-women.png',
  '/category-accessory.png',
  '/category-kid.webp',
];

const PLACEHOLDER_PRODUCTS = [
  { id: 1,  name: 'Urban Puffer Jacket',    price: '89.99',  rating: 4.8, sellerName: 'StreetWear Co.',   image: CATEGORY_IMAGES[0], slug: 'product-1' },
  { id: 2,  name: 'Knit Cardigan Set',      price: '54.99',  rating: 4.9, sellerName: 'Soft Threads',     image: CATEGORY_IMAGES[1], slug: 'product-2' },
  { id: 3,  name: 'Leather Crossbody Bag',  price: '39.99',  rating: 4.7, sellerName: 'Carry Studio',     image: CATEGORY_IMAGES[2], slug: 'product-3' },
  { id: 4,  name: 'Kids Graphic Hoodie',    price: '29.99',  rating: 4.8, sellerName: 'Little Wears',     image: CATEGORY_IMAGES[3], slug: 'product-4' },
  { id: 5,  name: 'Slim Fit Chinos',        price: '64.99',  rating: 4.6, sellerName: 'StreetWear Co.',   image: CATEGORY_IMAGES[0], slug: 'product-5' },
  { id: 6,  name: 'Floral Summer Dress',    price: '49.99',  rating: 4.9, sellerName: 'Bloom Boutique',   image: CATEGORY_IMAGES[1], slug: 'product-6' },
  { id: 7,  name: 'Classic Watch Strap',    price: '19.99',  rating: 4.7, sellerName: 'Carry Studio',     image: CATEGORY_IMAGES[2], slug: 'product-7' },
  { id: 8,  name: 'Toddler Canvas Shoes',   price: '24.99',  rating: 4.8, sellerName: 'Little Wears',     image: CATEGORY_IMAGES[3], slug: 'product-8' },
];

export default function FeaturedProducts() {
  const row1 = PLACEHOLDER_PRODUCTS.slice(0, 4);
  const row2 = PLACEHOLDER_PRODUCTS.slice(4, 8);

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

        {/* ── Row 1 ── */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {row1.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ── Row gap ── */}
        <div className="mt-10" />

        {/* ── Row 2 ── */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {row2.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* ── Browse More Button ── */}
        <div className="mt-14 text-center">
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
