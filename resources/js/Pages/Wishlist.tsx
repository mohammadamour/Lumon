import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';
import Layout from '../Components/layout/Layout';
import ProductCard from '../Components/common/ProductCard';
import axios from '../lib/axios';
import { Product } from '@/types';
import { useWishlistStore } from '../store/useWishlistStore';

export default function Wishlist() {
  const { ids, fetchIds } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist IDs and fetch product details
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      await fetchIds(); // Ensure we have the latest IDs from server
      
      try {
        // In a real app we'd have a specific /api/wishlist endpoint to get full products, 
        // but for now we'll fetch from /products?ids=... if the backend supports it,
        // or just fetch all and filter for the demo.
        // Assuming we need to just display something, let's fetch all products and filter locally for the portfolio.
        const res = await axios.get('/api/products');
        
        // Use Zustand store's current IDs because fetchIds() just ran
        const currentIds = useWishlistStore.getState().ids; 
        const wishlistedProducts = res.data.data.filter((p: Product) => currentIds.has(p.id));
        setProducts(wishlistedProducts);
      } catch (err) {
        console.error("Failed to load wishlist products", err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [fetchIds]);

  // Keep the list in sync if they unlike something from this page
  const displayProducts = products.filter(p => ids.has(p.id));

  return (
    <Layout>
      <Head title="My Wishlist — Lumon" />

      <div className="bg-light min-h-screen py-10">
        <div className="container-main">
          
          <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                <Heart className="text-red-500 fill-red-50" size={28} />
                My Wishlist
              </h1>
              <p className="mt-2 text-gray-500">
                {displayProducts.length} {displayProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200" />
              ))}
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center shadow-sm">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-300">
                <Heart size={48} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
              <p className="mt-2 max-w-md text-gray-500">
                Save your favorite items here so you don't lose track of them.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 font-bold text-white transition-all hover:bg-gray-800"
              >
                <ShoppingBag size={18} />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {displayProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
