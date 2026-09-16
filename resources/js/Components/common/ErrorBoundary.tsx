import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Catches uncaught React rendering errors and shows a
 * recoverable fallback UI instead of a blank white page.
 *
 * WHY THIS EXISTS:
 * When React encounters an error during rendering (e.g. accessing
 * `item.product.name` when `item.product` is undefined), the ENTIRE
 * component tree unmounts and the user sees a blank white screen.
 * This boundary catches those errors and renders a "something went
 * wrong" message with a retry button instead.
 *
 * We intentionally use a CLASS component here because React's
 * `componentDidCatch` / `getDerivedStateFromError` lifecycle hooks
 * are only available on class components (not hooks).
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-sm text-gray-500">
              An unexpected error occurred. You can try again or go back to the home page.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-24 overflow-auto rounded-lg bg-gray-50 p-3 text-left text-xs text-gray-600 border border-gray-200">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                Try Again
              </button>
              <a
                href="/"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
