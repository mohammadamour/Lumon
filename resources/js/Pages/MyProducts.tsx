import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Star,
  AlertCircle,
} from 'lucide-react';
import Layout from '../Components/layout/Layout';
import axios from '../lib/axios';
import type { Product, PageProps, Pagination } from '@/types';

export default function MyProducts() {
  const { auth } = usePage<PageProps>().props;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/seller/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Failed to fetch seller products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Remove "${product.name}" from your listings? This will hide it from the shop.`)) return;
    setDeletingId(product.id);
    try {
      await axios.delete(`/api/seller/products/${product.id}`);
      setProducts(products.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Failed to delete product', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', classes: 'bg-red-50 text-red-600' };
    if (stock <= 5) return { label: `Low: ${stock} left`, classes: 'bg-amber-50 text-amber-600' };
    return { label: `${stock} in stock`, classes: 'bg-emerald-50 text-emerald-600' };
  };

  return (
    <Layout>
      <Head title="My Products — Lumon" />

      <section className="bg-light min-h-screen">
        <div className="container-main py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 lg:text-3xl">
                My Products
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your product listings — {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <Link
              href="/products/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98]"
            >
              <Plus size={18} />
              Add New Product
            </Link>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-4">
                <Package size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No products yet
              </h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                You haven't listed any products. Start building your store by adding your first product.
              </p>
              <Link
                href="/products/create"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800"
              >
                <Plus size={16} />
                Add Your First Product
              </Link>
            </div>
          )}

          {/* Product Table */}
          {!loading && products.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-100 bg-gray-50/60">
                    <tr>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Product</th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Rating</th>
                      <th className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => {
                      const stockBadge = getStockBadge(product.stock);
                      return (
                        <tr key={product.id} className="transition-colors hover:bg-gray-50/40">
                          {/* Product */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                {product.image_url ? (
                                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900 max-w-[200px]">{product.name}</p>
                                <p className="text-xs text-gray-400">{product.slug}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{product.category?.name || '—'}</span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-gray-900">${Number(product.price).toFixed(2)}</span>
                          </td>

                          {/* Stock */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${stockBadge.classes}`}>
                              {stockBadge.label}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {product.average_rating > 0 ? product.average_rating.toFixed(1) : '—'}
                              </span>
                              {product.review_count > 0 && (
                                <span className="text-xs text-gray-400">({product.review_count})</span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/products/${product.slug}`}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                                title="View"
                              >
                                <Eye size={16} />
                              </Link>
                              <Link
                                href={`/products/${product.slug}/edit`}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(product)}
                                disabled={deletingId === product.id}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                title="Remove listing"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
