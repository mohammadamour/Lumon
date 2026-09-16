import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showValue?: boolean;
}

/**
 * StarRating — read-only star display with partial fill support.
 */
export default function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  showValue = false,
}: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              {/* Empty star (background) */}
              <Star
                size={size}
                className="absolute inset-0 text-gray-200"
                strokeWidth={1.5}
              />
              {/* Filled star (clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  size={size}
                  className="fill-yellow-400 text-yellow-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-sm font-semibold text-gray-700 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
