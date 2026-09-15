import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import axios from '../../lib/axios';

/**
 * FilterSidebar — category + price range filters for the Shop page.
 *
 * Props:
 *   params   — current URL query params object
 *   setParam — function to update a single param
 *   removeParam — function to remove a single param
 *   clearAll — function to clear all filters
 */
export default function FilterSidebar({ params, setParam, removeParam, clearAll, layout = 'both' }) {
  const [categories, setCategories] = useState([]);
  const [minPrice, setMinPrice] = useState(params.min_price || '');
  const [maxPrice, setMaxPrice] = useState(params.max_price || '');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    axios.get('/api/categories').then((res) => {
      setCategories(res.data.data || []);
    });
  }, []);

  // Sync local price inputs with URL params when params change externally
  useEffect(() => {
    setMinPrice(params.min_price || '');
    setMaxPrice(params.max_price || '');
  }, [params.min_price, params.max_price]);

  const handleCategoryClick = (slug) => {
    if (params.category === slug) {
      removeParam('category');
    } else {
      setParam('category', slug);
    }
  };

  const applyPriceFilter = () => {
    if (minPrice) setParam('min_price', minPrice);
    else removeParam('min_price');

    if (maxPrice) {
      // Use a slight delay so both params update
      const url = new URL(window.location);
      if (minPrice) url.searchParams.set('min_price', minPrice);
      else url.searchParams.delete('min_price');
      if (maxPrice) url.searchParams.set('max_price', maxPrice);
      else url.searchParams.delete('max_price');
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url);
      // Force re-read
      setParam('max_price', maxPrice);
    } else {
      removeParam('max_price');
    }
  };

  const hasAnyFilter = params.category || params.min_price || params.max_price || params.search;

  const filterContent = (
    <div className="space-y-6">
      {/* ── Categories ── */}
      <div>
        <h3 className="text-body font-bold text-dark mb-3">Categories</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-body transition-colors ${
                params.category === cat.slug
                  ? 'bg-primary-50 text-primary font-semibold'
                  : 'text-muted hover:bg-light-100 hover:text-dark'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.product_count != null && (
                <span
                  className={`text-caption font-medium ml-2 shrink-0 ${
                    params.category === cat.slug
                      ? 'text-primary-400'
                      : 'text-muted-light'
                  }`}
                >
                  {cat.product_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div>
        <h3 className="text-body font-bold text-dark mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
              className="w-full rounded-lg border border-gray-200 bg-light px-3 py-2 text-body text-dark placeholder:text-muted-light outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              placeholder="Min"
              min="0"
            />
          </div>
          <span className="text-muted-light">—</span>
          <div className="flex-1">
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
              className="w-full rounded-lg border border-gray-200 bg-light px-3 py-2 text-body text-dark placeholder:text-muted-light outline-none focus:border-primary focus:ring-2 focus:ring-primary-100"
              placeholder="Max"
              min="0"
            />
          </div>
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-2 w-full rounded-lg bg-light-100 py-2 text-caption font-semibold text-muted transition-colors hover:bg-primary-50 hover:text-primary"
        >
          Apply Price
        </button>
      </div>

      {/* ── Clear All ── */}
      {hasAnyFilter && (
        <button
          onClick={clearAll}
          className="w-full rounded-lg border border-danger/20 py-2.5 text-body font-semibold text-danger transition-colors hover:bg-danger-50"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {(layout === 'mobile' || layout === 'both') && (
        <>
          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-body font-semibold text-dark shadow-card transition-all hover:shadow-card-lg lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasAnyFilter && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                !
              </span>
            )}
          </button>

          {/* ── Mobile Drawer ── */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-card-lg animate-slide-down overflow-y-auto">
                <div className="flex items-center justify-between border-b border-light-200 px-5 py-4">
                  <h2 className="text-h4 text-dark">Filters</h2>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-1.5 text-muted hover:bg-light-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-5">{filterContent}</div>
              </div>
            </div>
          )}
        </>
      )}

      {(layout === 'desktop' || layout === 'both') && (
        /* ── Desktop Sidebar ── */
        <aside className="hidden lg:block w-60 shrink-0">
          <div className="sticky top-20 rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
            {filterContent}
          </div>
        </aside>
      )}
    </>
  );
}
