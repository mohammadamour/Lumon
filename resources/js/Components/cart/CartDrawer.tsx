import { Link } from '@inertiajs/react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import QuantitySelector from '../product/QuantitySelector';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, getSubtotal, getTax, getTotal } = useCartStore();

  if (!isDrawerOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeDrawer();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md h-full bg-white shadow-2xl animate-slide-left flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-2 text-h4 text-dark">
            <ShoppingBag size={24} />
            <h2>Your Cart</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
              {items.length}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Items ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                <p className="text-gray-500 mt-1">Looks like you haven&apos;t added anything yet.</p>
              </div>
              <button
                onClick={closeDrawer}
                className="mt-4 font-semibold text-primary hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                {/* Image */}
                <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-gray-900 line-clamp-2 text-sm">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 -mr-1 -mt-1 rounded-md transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-extrabold text-primary mt-1">
                      ${Number(item.product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="scale-90 origin-left">
                      <QuantitySelector
                        quantity={item.quantity}
                        max={item.product.stock}
                        onChange={(qty) => updateQuantity(item.product.id, qty)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer / Summary ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50 p-6">
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">${getTax().toFixed(2)}</span>
              </div>
              <div className="h-px w-full bg-gray-200 my-2" />
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-primary">${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-4 font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
