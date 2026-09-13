import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

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
      className="group flex flex-col overflow-hidden bg-white"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/5] overflow-hidden bg-light-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1.5 pt-4 pb-2 px-2 sm:gap-1 sm:pt-3 sm:pb-1 sm:px-1">
        {/* Seller name */}
        <p className="text-sm text-muted truncate sm:text-caption">{sellerName}</p>

        {/* Product title */}
        <h3 className="text-base font-bold text-dark truncate sm:text-body">{name}</h3>

        {/* Price + Rating on same line */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-dark sm:text-body">
            ${price}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted sm:text-caption">
            <Star size={14} className="fill-warning text-warning sm:h-3 sm:w-3" strokeWidth={0} />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
