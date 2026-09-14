import { Link } from '@inertiajs/react';
import { Star, ShoppingBag } from 'lucide-react';

/**
 * ProductCard — reusable product card used in FeaturedProducts (home) and Shop page.
 *
 * Props:
 *   product: {
 *     id, name, price, rating, sellerName, image, slug
 *   }
 *
 * All fields fall back to static placeholders until the backend is seeded.
 */
export default function ProductCard({ product = {} }) {
  const {
    id = 1,
    name = 'Classic Comfort Tee',
    price = '29.99',
    rating = 4.8,
    sellerName = 'Lumon Store',
    image = '/category-men.png',
    slug = '#',
  } = product;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Quick action overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          <button 
            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 font-semibold py-2.5 rounded-xl shadow flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-white transition-colors"
            onClick={(e) => e.preventDefault()} // Prevent link click when clicking button
          >
            <ShoppingBag size={18} />
            Quick Add
          </button>
        </div>
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
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-700">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-extrabold text-blue-600">
            ${price}
          </span>
        </div>
      </div>
    </Link>
  );
}
