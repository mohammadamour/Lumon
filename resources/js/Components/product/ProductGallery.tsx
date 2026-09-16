import { useState, MouseEvent } from 'react';
import { ShoppingBag, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  imageUrl?: string;
  productName: string;
}

/**
 * ProductGallery — main product image with zoom-on-hover effect.
 * Shows a placeholder icon if no image is available.
 */
export default function ProductGallery({ imageUrl, productName }: ProductGalleryProps) {
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  if (!imageUrl) {
    return (
      <div className="relative aspect-square rounded-2xl bg-gray-100 flex items-center justify-center">
        <ShoppingBag size={80} strokeWidth={0.8} className="text-gray-300" />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-crosshair group"
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={imageUrl}
        alt={productName}
        className="h-full w-full object-cover object-center transition-transform duration-500"
        style={
          zoom
            ? {
                transform: 'scale(2)',
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
      />

      {/* Zoom hint */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <ZoomIn size={14} />
        Hover to zoom
      </div>
    </div>
  );
}
