import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ProductCard from '../common/ProductCard';
import ProductCardSkeleton from '../common/ProductCardSkeleton';
import axios from '../../lib/axios';
import type { Product } from '@/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/products', { params: { per_page: 8 } })
      .then(res => {
        setProducts(res.data.data);
      })
      .catch(err => console.error("Failed to fetch featured products:", err))
      .finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products available.</p>
          )}
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
