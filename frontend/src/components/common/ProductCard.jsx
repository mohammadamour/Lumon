/**
 * ProductCard — displays a single product (Phase 2)
 *
 * Will be rebuilt with real data in Phase 2.
 * Simplified design: no color swatches, single price.
 */
export default function ProductCard({ product }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-lg">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-light-100">
        {product?.image ? (
          <img
            src={product.image}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-light">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-h4 text-dark truncate">{product?.name || 'Product Name'}</h3>
        <p className="mt-1 text-body text-muted line-clamp-2">
          {product?.description || 'Product description goes here.'}
        </p>
        <p className="mt-3 text-h4 font-bold text-primary">
          ${product?.price || '0.00'}
        </p>
      </div>
    </div>
  );
}
