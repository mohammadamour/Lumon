import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { Store, Calendar, Package } from 'lucide-react';
import Layout from '../Components/layout/Layout';
import ProductCard from '../Components/common/ProductCard';
import axios from '../lib/axios';
import type { Product, PageProps } from '@/types';

interface SellerProfilePageProps extends PageProps {
  seller: {
    id: number;
    name: string;
    created_at: string;
  };
}

export default function SellerProfile() {
  const { seller } = usePage<SellerProfilePageProps>().props;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products', {
        params: { seller_id: seller.id, per_page: 12, page: pageNum },
      });

      if (pageNum === 1) {
        setProducts(res.data.data);
      } else {
        setProducts(prev => [...prev, ...res.data.data]);
      }
      setLastPage(res.data.meta.last_page);
    } catch (err) {
      console.error('Failed to fetch seller products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [seller.id]);

  const joinDate = new Date(seller.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const initials = seller.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <Head title={`${seller.name} — Lumon`} />

      <section className="bg-light min-h-screen">
        {/* Seller Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container-main py-10">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-extrabold text-primary">
                {initials}
              </div>

              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Store size={18} className="text-primary" />
                  <h1 className="text-2xl font-extrabold text-gray-900">{seller.name}</h1>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 justify-center sm:justify-start text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Joined {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package size={14} />
                    <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container-main py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Products by {seller.name}</h2>

          {loading && products.length === 0 && (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-4">
                <Package size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No products yet</h3>
              <p className="text-sm text-gray-500">This seller hasn't listed any products yet.</p>
            </div>
          )}

          {products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {page < lastPage && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      const next = page + 1;
                      setPage(next);
                      fetchProducts(next);
                    }}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
