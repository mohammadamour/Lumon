import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  Package,
  Star,
  MessageSquare,
} from 'lucide-react';
import Layout from '../Components/layout/Layout';
import Breadcrumb from '../Components/common/Breadcrumb';
import ProductGallery from '../Components/product/ProductGallery';
import QuantitySelector from '../Components/product/QuantitySelector';
import StarRating from '../Components/common/StarRating';
import ProductCard from '../Components/common/ProductCard';
import type { Product, PageProps } from '@/types';

// ── Types for this page's Inertia props ──

interface ProductDetailPageProps extends PageProps {
  product: { data: Product };
  recommended: { data: Product[] };
}

// ── Tabs ──

type TabKey = 'description' | 'reviews';

// ── Component ──

export default function ProductDetail() {
  const { product: productWrapper, recommended } =
    usePage<ProductDetailPageProps>().props;
  const product = productWrapper.data;
  const recommendedProducts = recommended.data;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const isOutOfStock = product.stock <= 0;
  const sellerName = product.seller?.name || 'Lumon Store';
  const categoryName = product.category?.name || 'All Products';
  const categorySlug = product.category?.slug || '';

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Shop', href: '/products' },
    ...(categorySlug
      ? [{ label: categoryName, href: `/products?category=${categorySlug}` }]
      : []),
    { label: product.name },
  ];

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'description', label: 'Description', icon: <Package size={16} /> },
    { key: 'reviews', label: 'Reviews', icon: <MessageSquare size={16} /> },
  ];

  return (
    <Layout>
      <Head title={`${product.name} — Lumon`} />

      <section className="bg-light min-h-screen">
        <div className="container-main py-6">
          {/* ── Breadcrumb ── */}
          <Breadcrumb items={breadcrumbItems} />

          {/* ── Product Hero (2-column) ── */}
          <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: Image */}
            <ProductGallery
              imageUrl={product.image_url}
              productName={product.name}
            />

            {/* Right: Info */}
            <div className="flex flex-col gap-5">
              {/* Seller */}
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline w-fit"
              >
                <Store size={14} />
                {sellerName}
              </Link>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight lg:text-3xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <StarRating rating={product.average_rating} showValue />
                <span className="text-sm text-gray-500">
                  ({product.review_count}{' '}
                  {product.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              {/* Price + Stock */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-extrabold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
                {isOutOfStock ? (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    Out of Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    In Stock — {product.stock} left
                  </span>
                )}
              </div>

              {/* Divider */}
              <hr className="border-gray-100" />

              {/* Short description (first 200 chars) */}
              <p className="text-gray-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 mt-1">
                {!isOutOfStock && (
                  <QuantitySelector
                    quantity={quantity}
                    max={product.stock}
                    onChange={setQuantity}
                  />
                )}

                <button
                  disabled={isOutOfStock}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <ShoppingBag size={18} />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-2 grid grid-cols-3 gap-3">
                {[
                  { icon: <Truck size={18} />, text: 'Free Shipping' },
                  { icon: <ShieldCheck size={18} />, text: 'Secure Payment' },
                  { icon: <RotateCcw size={18} />, text: '30-Day Returns' },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-white border border-gray-100 p-3 text-center"
                  >
                    <span className="text-primary">{badge.icon}</span>
                    <span className="text-xs font-medium text-gray-600">
                      {badge.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-12">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6 rounded-2xl bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
              {activeTab === 'description' && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>

                  {/* Product specs */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      { label: 'Category', value: categoryName },
                      { label: 'Seller', value: sellerName },
                      { label: 'Stock', value: `${product.stock} units` },
                      {
                        label: 'Rating',
                        value:
                          product.average_rating > 0
                            ? `${product.average_rating.toFixed(1)} / 5`
                            : 'No ratings yet',
                      },
                    ].map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-xl bg-gray-50 px-4 py-3"
                      >
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                          {spec.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-800">
                          {spec.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-4">
                    <Star size={28} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    No reviews yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Be the first to review this product. Reviews will be
                    available in an upcoming update.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Recommended Products ── */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                  You May Also Like
                </h2>
                <Link
                  href={`/products?category=${categorySlug}`}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {recommendedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Bottom spacer */}
          <div className="h-12" />
        </div>
      </section>
    </Layout>
  );
}
