import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';
import { useToastStore } from './useToastStore';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  isLoading: boolean;
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  
  // Cart operations
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearCart: () => void;

  // Computed getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
}

/**
 * isValidCartItems — Validates that server response items match the
 * CartItem shape the frontend expects ({ product: { id, name, ... }, quantity }).
 *
 * WHY THIS EXISTS:
 * The optimistic update always produces correctly-shaped items because
 * WE build them from a known Product object. But the server response
 * comes from CartItemResource → ProductResource, and if ANY part of
 * that chain is wrong (missing eager-load, serialization bug, etc.),
 * we get a shape mismatch. Without this check, we'd overwrite good
 * optimistic data with broken server data and crash the entire UI.
 *
 * This is a DEFENSIVE layer — if the server response is valid, we
 * use it (it has DB IDs we need). If it's not, we silently keep
 * the optimistic data and log a warning for debugging.
 */
function isValidCartItems(items: unknown): items is CartItem[] {
  if (!Array.isArray(items)) return false;
  return items.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof item.quantity === 'number' &&
      item.product &&
      typeof item.product === 'object' &&
      typeof item.product.id === 'number'
  );
}

/**
 * useCartStore — Hybrid cart state.
 * Uses local state with optimistic updates for responsiveness.
 * We persist to localStorage so guest users retain their cart.
 * If authenticated, we also fire API calls to keep the DB in sync.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      isLoading: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const res = await axios.get('/api/cart');
          const serverItems = res.data?.data?.items;
          if (isValidCartItems(serverItems)) {
            set({ items: serverItems });
          }
        } catch (err) {
          // If guest (401), we just rely on local state
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(i => i.product.id === product.id);

        // Optimistic update
        if (existingItem) {
          set({
            items: currentItems.map(i => 
              i.product.id === product.id 
                ? { ...i, quantity: i.quantity + quantity } 
                : i
            )
          });
        } else {
          set({ items: [...currentItems, { product, quantity }] });
        }

        set({ isDrawerOpen: true });
        useToastStore.getState().addToast(`Added "${product.name}" to cart`, 'success');

        // Sync to server
        try {
          const res = await axios.post('/api/cart', { product_id: product.id, quantity });
          const serverItems = res.data?.data?.items;
          if (isValidCartItems(serverItems)) {
            set({ items: serverItems });
          }
          // If invalid shape, we keep the optimistic update (it's correct)
        } catch (error) {
          // If 401, they are a guest. The optimistic update holds the cart.
        }
      },

      updateQuantity: async (productId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find(i => i.product.id === productId);
        
        if (!item) return;

        // Optimistic update
        set({
          items: currentItems.map(i => 
            i.product.id === productId ? { ...i, quantity } : i
          )
        });

        // Sync to server (if we have a cart item ID)
        if (item.id) {
          try {
            const res = await axios.put(`/api/cart/items/${item.id}`, { quantity });
            const serverItems = res.data?.data?.items;
            if (isValidCartItems(serverItems)) {
              set({ items: serverItems });
            }
          } catch (error) {
             // Revert on error if needed
          }
        }
      },

      removeItem: async (productId) => {
        const currentItems = get().items;
        const item = currentItems.find(i => i.product.id === productId);
        const itemName = item?.product?.name || 'Item';

        // Optimistic update
        set({
          items: currentItems.filter(i => i.product.id !== productId)
        });
        useToastStore.getState().addToast(`Removed "${itemName}" from cart`, 'info');

        if (item?.id) {
          try {
            await axios.delete(`/api/cart/items/${item.id}`);
          } catch (error) {
            // Error handling
          }
        }
      },

      clearCart: () => set({ items: [] }),

      // Computed properties
      getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getSubtotal: () => get().items.reduce((total, item) => {
        const price = typeof item.product.price === 'string' 
          ? parseFloat(item.product.price) 
          : item.product.price;
        return total + (price * item.quantity);
      }, 0),
      
      getTax: () => get().getSubtotal() * 0.08, // Flat 8% tax
      
      getTotal: () => get().getSubtotal() + get().getTax(),
    }),
    {
      name: 'lumon-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items to localStorage
      /**
       * When the store rehydrates from localStorage on page load,
       * validate the stored items. If they're corrupted (e.g. from
       * a previous bug that stored flat data), wipe them clean so
       * the app doesn't crash on render.
       */
      onRehydrateStorage: () => (state) => {
        if (state && !isValidCartItems(state.items)) {
          state.items = [];
        }
      },
    }
  )
);
