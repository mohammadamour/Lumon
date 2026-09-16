import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Heart, User, Menu, X, Plus, LogOut, ChevronDown } from 'lucide-react';
import { PageProps } from '@/types';
import { useCartStore } from '../../store/useCartStore';

const NAV_LINKS = [
  { label: 'Home',     to: '/',        type: 'route' },
  { label: 'Shop',     to: '/products', type: 'route' },
  { label: 'Featured', to: '/#featured', type: 'anchor', anchor: 'featured' },
  { label: 'About Us', to: '/#about',   type: 'anchor', anchor: 'about' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { url, props } = usePage<PageProps>();
  const user = props.auth?.user ?? null;
  const isSeller = user?.role === 'seller';
  const { openDrawer, getItemCount } = useCartStore();
  const cartItemsCount = getItemCount();

  // --- scroll shadow ---
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // --- close menus on navigation ---
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [url]);

  // --- close user menu on outside click ---
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  // --- anchor-scroll helper ---
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { anchor?: string; to: string; type: string; label: string }) => {
    e.preventDefault();

    // Get the current path without query strings
    const currentPath = url.split('?')[0];

    if (currentPath === '/') {
      // Already on home — just scroll
      const el = link.anchor ? document.getElementById(link.anchor) : null;
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home first, scroll after paint
      router.visit('/', {
        onFinish: () => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              const el = link.anchor ? document.getElementById(link.anchor) : null;
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          });
        },
      });
    }
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    router.post('/logout', {}, {
      onFinish: () => router.visit('/'),
    });
  };

  // --- active helper ---
  const isActive = (link: { type: string; to: string; label: string }) => {
    if (link.type === 'route') {
      const currentPath = url.split('?')[0];
      return currentPath === link.to;
    }
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-nav'
          : 'bg-white'
      }`}
    >
      <nav className="container-main flex h-16 items-center justify-between gap-4">
        {/* ─── Logo ─── */}
        <Link
          href="/"
          className="flex items-center gap-2 text-h4 font-bold tracking-tight text-dark transition-colors hover:text-primary"
        >
          Lumon
        </Link>

        {/* ─── Desktop Nav Links ─── */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.type === 'anchor' ? (
                <a
                  href={link.to}
                  onClick={(e) => handleAnchorClick(e, link)}
                  className="rounded-lg px-3.5 py-2 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.to}
                  className={`rounded-lg px-3.5 py-2 text-body font-medium transition-colors ${
                    isActive(link)
                      ? 'bg-primary-50 text-primary'
                      : 'text-muted hover:bg-primary-50 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* ─── Desktop Right Actions ─── */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Wishlist */}
          {user && (
            <Link
              href="/wishlist"
              className="relative rounded-lg p-2 text-muted transition-colors hover:bg-primary-50 hover:text-primary"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.8} />
            </Link>
          )}

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative rounded-lg p-2 text-muted transition-colors hover:bg-primary-50 hover:text-primary"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} strokeWidth={1.8} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartItemsCount}
              </span>
            )}
          </button>

          {user ? (
            <>
              {/* Seller: Add a Product */}
              {isSeller && (
                <Link
                  href="/products/create"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-body font-semibold text-white shadow-sm transition-all hover:bg-primary-500 hover:shadow-md active:scale-[0.98]"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Add a Product
                </Link>
              )}

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen((v) => !v);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={14} strokeWidth={2} />
                  </div>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 animate-slide-down rounded-xl border border-light-200 bg-white py-1.5 shadow-card-lg">
                    {isSeller && (
                      <Link
                        href="/my-products"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-body text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                      >
                        My Products
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-body text-danger transition-colors hover:bg-danger-50"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-body font-medium text-primary transition-colors hover:bg-primary-50"
              >
                <User size={16} strokeWidth={2} />
                Login
              </Link>
              <span className="text-muted-light">/</span>
              <Link
                href="/register"
                className="rounded-lg px-3.5 py-2 text-body font-medium text-primary transition-colors hover:bg-primary-50"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* ─── Mobile Hamburger ─── */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-primary-50 hover:text-primary md:hidden"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ─── Mobile Menu ─── */}
      {mobileOpen && (
        <div className="animate-slide-down border-t border-light-200 bg-white md:hidden">
          <div className="container-main space-y-1 py-4">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.type === 'anchor' ? (
                  <a
                    href={link.to}
                    onClick={(e) => handleAnchorClick(e, link)}
                    className="block rounded-lg px-3 py-2.5 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.to}
                    className={`block rounded-lg px-3 py-2.5 text-body font-medium transition-colors ${
                      isActive(link)
                        ? 'bg-primary-50 text-primary'
                        : 'text-muted hover:bg-primary-50 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <hr className="my-2 border-light-200" />

            {/* Mobile wishlist */}
            {user && (
              <Link
                href="/wishlist"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
              >
                <Heart size={18} strokeWidth={1.8} />
                Wishlist
              </Link>
            )}

            {/* Mobile cart */}
            <button
              onClick={openDrawer}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} strokeWidth={1.8} />
                Cart
              </div>
              {cartItemsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                {isSeller && (
                  <Link
                    href="/products/create"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-body font-medium text-primary transition-colors hover:bg-primary-50"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                    Add a Product
                  </Link>
                )}
                {isSeller && (
                  <Link
                    href="/my-products"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-body font-medium text-muted transition-colors hover:bg-primary-50 hover:text-primary"
                  >
                    My Products
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-body font-medium text-danger transition-colors hover:bg-danger-50"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-body font-medium text-primary transition-colors hover:bg-primary-50"
                >
                  <User size={16} strokeWidth={2} />
                  Login
                </Link>
                <span className="text-muted-light">/</span>
                <Link
                  href="/register"
                  className="rounded-lg px-3 py-2.5 text-body font-medium text-primary transition-colors hover:bg-primary-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
