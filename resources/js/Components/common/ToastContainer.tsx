import { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { useToastStore, Toast, ToastType } from '../../store/useToastStore';

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

const COLOR_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ICON_COLOR_MAP: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

const PROGRESS_COLOR_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-400',
  error: 'bg-red-400',
  warning: 'bg-amber-400',
  info: 'bg-blue-400',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animate the progress bar from 100% to 0% over the toast duration
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [toast.duration]);

  return (
    <div
      className={`relative flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg backdrop-blur-sm animate-slide-up overflow-hidden ${COLOR_MAP[toast.type]}`}
    >
      {/* Icon */}
      <span className={`mt-0.5 shrink-0 ${ICON_COLOR_MAP[toast.type]}`}>
        {ICON_MAP[toast.type]}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-snug pr-4">{toast.message}</p>

      {/* Close */}
      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/5">
        <div
          className={`h-full transition-none ${PROGRESS_COLOR_MAP[toast.type]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * ToastContainer — Renders all active toasts stacked in the bottom-right.
 * Place this once inside Layout.tsx.
 */
export default function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
