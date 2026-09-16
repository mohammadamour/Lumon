import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: number;
}

export default function WishlistButton({ productId, className = '', size = 20 }: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlistStore();
  const wishlisted = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent navigating if this is inside a Link
        e.stopPropagation();
        toggle(productId);
      }}
      className={`group flex items-center justify-center transition-all ${className}`}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={size}
        className={`transition-all duration-300 ${
          wishlisted
            ? 'fill-red-500 text-red-500 scale-110'
            : 'text-gray-400 group-hover:text-red-400'
        }`}
      />
    </button>
  );
}
