import ProductCard from '../common/ProductCard';

// Static placeholder data — will be replaced with API data once the DB is seeded
const PLACEHOLDER_PRODUCTS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: 'Classic Comfort Tee',
  price: '29.99',
  rating: 4.8,
  sellerName: 'Lumon Store',
  image: '/category-men.png',
  slug: `product-${i + 1}`,
}));

export default function FeaturedProducts() {
  return (
    <section id="featured" className="bg-white py-16">
      <div className="container-main">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <p className="text-body text-muted">Featured Products</p>
          <h2 className="mt-1 text-h2 font-bold text-dark">BESTSELLER PRODUCTS</h2>
          <p className="mt-3 text-body text-muted">
            Explore top-rated items and trending favorites.
          </p>
        </div>

        {/* ── Grid: 4 columns × 2 rows ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
