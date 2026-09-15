import { useState, useEffect, useRef } from 'react';
import { Search, Package } from 'lucide-react';
import Layout from '../Components/layout/Layout';
import ProductCard from '../Components/common/ProductCard';
import ProductCardSkeleton from '../Components/common/ProductCardSkeleton';
import FilterSidebar from '../Components/shop/FilterSidebar';
import SortDropdown from '../Components/shop/SortDropdown';
import ActiveFilterChips from '../Components/shop/ActiveFilterChips';
import Pagination from '../Components/shop/Pagination';
import useQueryParams from '../hooks/useQueryParams';
import axios from '../lib/axios';

export default function Shop() {
  const { params, setParam, removeParam, clearAll } = useQueryParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(params.search || '');
  const abortRef = useRef(null);

  // Fetch products whenever params change
  useEffect(() => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    axios
      .get('/api/products', {
        params,
        signal: controller.signal,
      })
      .then((res) => {
        setProducts(res.data.data || []);
        setMeta(res.data.meta || null);
      })
      .catch((err) => {
        if (err.name !== 'CanceledError') {
          console.error('Failed to fetch products:', err);
          setProducts([]);
          setMeta(null);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  // Sync local search input when params.search changes externally
  useEffect(() => {
    setSearchInput(params.search || '');
  }, [params.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setParam('search', searchInput.trim());
    } else {
      removeParam('search');
    }
  };

  const totalResults = meta?.total ?? 0;

  return (
    <Layout>
      <section className="bg-light min-h-screen">
        {/* ── Header ── */}
        <div className="bg-white border-b border-light-200">
          <div className="container-main py-8">
            <h1 className="text-h2 text-dark mb-2">Shop</h1>
            <p className="text-body-lg text-muted">
              {loading
                ? 'Loading products…'
                : `${totalResults} product${totalResults !== 1 ? 's' : ''} found`}
            </p>

            {/* ── Search Bar ── */}
            <form onSubmit={handleSearch} className="mt-5 max-w-xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-light py-3 pl-11 pr-24 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                  placeholder="Search products…"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-1.5 text-caption font-bold text-white transition-colors hover:bg-primary-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="container-main py-8">
          {/* ── Toolbar (filters toggle + sort + active chips) ── */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <FilterSidebar
              params={params}
              setParam={setParam}
              removeParam={removeParam}
              clearAll={clearAll}
            />
            <div className="flex-1" />
            <SortDropdown params={params} setParam={setParam} />
          </div>

          <ActiveFilterChips
            params={params}
            removeParam={removeParam}
            clearAll={clearAll}
          />

          {/* ── Layout: Sidebar + Grid ── */}
          <div className="flex gap-8 mt-6">
            {/* Desktop Sidebar (rendered inside FilterSidebar) */}
            <FilterSidebar
              params={params}
              setParam={setParam}
              removeParam={removeParam}
              clearAll={clearAll}
            />

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                // Skeleton grid
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <Pagination meta={meta} setParam={setParam} />
                </>
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-light-100 mb-5">
                    <Package size={36} className="text-muted-light" />
                  </div>
                  <h3 className="text-h4 text-dark mb-2">No products found</h3>
                  <p className="text-body text-muted mb-6 max-w-sm">
                    Try adjusting your search or filters to find what you&apos;re
                    looking for.
                  </p>
                  <button
                    onClick={clearAll}
                    className="rounded-xl bg-primary px-6 py-2.5 text-body font-semibold text-white shadow-sm transition-all hover:bg-primary-500 hover:shadow-md"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
