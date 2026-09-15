import { Link } from '@inertiajs/react';
import { Star, ShoppingBag } from 'lucide-react';

/**
 * ProductCard — reusable product card used in FeaturedProducts (home) and Shop page.
 *
 * Props:
 *   product: {
 *     id, name, price, average_rating, review_count,
 *     seller: { id, name }, image_url, slug, stock
 *   }
 *
 * Gracefully handles missing data with fallbacks.
 */
interface ProductCardProps {
  product?: {
    id?: number;
    name?: string;
    price?: number | string;
    average_rating?: number;
    review_count?: number;
    seller?: { id?: number; name?: string };
    image_url?: string;
    slug?: string;
    stock?: number;
  };
}

export default function ProductCard({ product = {} }: ProductCardProps) {
  const {
    name = 'Product',
    price = '0.00',
    average_rating = 0,
    review_count = 0,
    seller = {},
    image_url,
    slug = '#',
    stock,
  } = product;

  const sellerName = seller?.name || 'Lumon Store';
  const isOutOfStock = stock !== undefined && stock <= 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-light">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div className="absolute top-3 left-3 rounded-lg bg-dark/80 px-2.5 py-1 text-caption font-bold text-white backdrop-blur-sm">
            Out of Stock
          </div>
        )}

        {/* Quick action overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <button
              className="w-full bg-white/95 backdrop-blur-sm text-gray-900 font-semibold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingBag size={18} />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate mb-1">
              {sellerName}
            </p>
            <h3 className="text-base font-bold text-gray-900 truncate">
              {name}
            </h3>
          </div>
          {average_rating > 0 && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-700">
                {Number(average_rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-extrabold text-blue-600">
            ${Number(price).toFixed(2)}
          </span>
          {review_count > 0 && (
            <span className="text-caption text-muted">
              {review_count} review{review_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
