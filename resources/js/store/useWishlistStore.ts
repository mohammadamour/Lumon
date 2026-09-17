import { create } from 'zustand';
import axios from '../lib/axios';
import { useToastStore } from './useToastStore';

interface WishlistState {
  ids: Set<number>;
  isLoading: boolean;
  
  fetchIds: () => Promise<void>;
  toggle: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
}

/**
 * useWishlistStore — Manages the user's wishlisted product IDs.
 * Uses a Set for O(1) fast lookup to determine if a heart should be filled.
 * Includes optimistic updates so clicking the heart feels instant.
 */
export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set(),
  isLoading: false,

  fetchIds: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get('/api/wishlist/ids');
      set({ ids: new Set(res.data) });
    } catch (err) {
      // Guest users or error
    } finally {
      set({ isLoading: false });
    }
  },

  toggle: async (productId: number) => {
    const currentIds = get().ids;
    const wasWishlisted = currentIds.has(productId);

    // 1. Optimistic Update (instant UI change)
    const newIds = new Set(currentIds);
    if (wasWishlisted) {
      newIds.delete(productId);
    } else {
      newIds.add(productId);
    }
    set({ ids: newIds });
    if (!wasWishlisted) {
      useToastStore.getState().addToast('Added to wishlist ❤️', 'success');
    } else {
      useToastStore.getState().addToast('Removed from wishlist', 'info');
    }

    // 2. Server Sync
    try {
      await axios.post('/api/wishlist', { product_id: productId });
    } catch (err: any) {
      // 3. Revert on failure (e.g., if guest user)
      // In a real app, you might show a toast saying "Please login" here
      set({ ids: currentIds });
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
          window.location.href = '/login';
      }
    }
  },

  isWishlisted: (productId: number) => get().ids.has(productId),
}));
