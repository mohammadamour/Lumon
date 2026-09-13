import { Link } from 'react-router-dom';
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
      to={`/products/${slug}`}
      className="group flex flex-col overflow-hidden bg-white transition-shadow hover:shadow-card-lg"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-light-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-1 pt-3 pb-1 px-1">
        {/* Seller name */}
        <p className="text-caption text-muted truncate">{sellerName}</p>

        {/* Product title */}
        <h3 className="text-body font-bold text-dark truncate">{name}</h3>

        {/* Price + Rating on same line */}
        <div className="flex items-center justify-between">
          <span className="text-body font-bold text-dark">
            ${price}
          </span>
          <span className="flex items-center gap-1 text-caption text-muted">
            <Star size={12} className="fill-warning text-warning" strokeWidth={0} />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
