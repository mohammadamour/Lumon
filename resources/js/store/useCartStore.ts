import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../lib/axios';
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
          // Map DB items back to CartItem
          if (res.data?.data?.items) {
            set({ items: res.data.data.items });
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

        // Sync to server
        try {
          const res = await axios.post('/api/cart', { product_id: product.id, quantity });
          if (res.data?.data?.items) {
             set({ items: res.data.data.items });
          }
        } catch (error) {
          // If 401, they are a guest. The optimistic update holds the cart.
          // In a real app we might revert the optimistic update on other errors.
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
            if (res.data?.data?.items) {
               set({ items: res.data.data.items });
            }
          } catch (error) {
             // Revert on error if needed
          }
        }
      },

      removeItem: async (productId) => {
        const currentItems = get().items;
        const item = currentItems.find(i => i.product.id === productId);

        // Optimistic update
        set({
          items: currentItems.filter(i => i.product.id !== productId)
        });

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
    }
  )
);
