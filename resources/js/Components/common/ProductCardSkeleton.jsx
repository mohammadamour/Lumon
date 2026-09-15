/**
 * ProductCardSkeleton — loading placeholder matching ProductCard dimensions.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/5] bg-gray-200" />

      {/* Info placeholder */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-6 w-12 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-5 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
