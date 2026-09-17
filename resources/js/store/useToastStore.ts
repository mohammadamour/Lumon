import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
}

/**
 * useToastStore — Global toast notification system.
 *
 * Any component can call `addToast('message', 'success')` and a
 * notification will pop up in the bottom-right corner. The toast
 * auto-dismisses after `duration` ms, or the user can click to close it.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random(); // unique even if called in same ms
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }));

    // Auto-dismiss
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
