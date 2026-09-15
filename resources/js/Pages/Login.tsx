import { useState, FormEvent } from 'react';
import { Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Layout from '../Components/layout/Layout';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Store, Sparkles } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  const handleDemoLogin = (role: string) => {
    setDemoLoading(role);
    router.post('/demo-login', { role }, {
      onFinish: () => setDemoLoading(null),
    });
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-success-50 py-12 px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* ── Header ── */}
          <div className="text-center mb-8">
            <h1 className="text-h2 text-dark mb-2">Welcome back</h1>
            <p className="text-body-lg text-muted">
              Sign in to your Lumon account
            </p>
          </div>

          {/* ── Recruiter Demo Access ── */}
          <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-2xl p-5 mb-6 border border-primary-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary" />
              <span className="text-body font-bold text-dark">
                Recruiter? Try instantly
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDemoLogin('buyer')}
                disabled={demoLoading !== null || processing}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-body font-semibold text-dark shadow-card border border-gray-100 transition-all hover:shadow-card-lg hover:border-primary-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} className="text-primary" />
                {demoLoading === 'buyer' ? (
                  <span className="animate-pulse">Signing in…</span>
                ) : (
                  'Demo Buyer'
                )}
              </button>
              <button
                onClick={() => handleDemoLogin('seller')}
                disabled={demoLoading !== null || processing}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-body font-semibold text-dark shadow-card border border-gray-100 transition-all hover:shadow-card-lg hover:border-success-400 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Store size={16} className="text-success" />
                {demoLoading === 'seller' ? (
                  <span className="animate-pulse">Signing in…</span>
                ) : (
                  'Demo Seller'
                )}
              </button>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-caption text-muted uppercase tracking-wider">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Login Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-card-lg border border-gray-100 p-6 space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-body font-semibold text-dark mb-1.5"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
                />
                <input
                  id="login-email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.email ? 'border-danger' : 'border-gray-200'
                  } bg-light py-3 pl-11 pr-4 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-caption text-danger">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-body font-semibold text-dark mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.password ? 'border-danger' : 'border-gray-200'
                  } bg-light py-3 pl-11 pr-11 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-caption text-danger">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={processing || demoLoading !== null}
              className="w-full rounded-xl bg-primary py-3 text-body font-bold text-white shadow-sm transition-all hover:bg-primary-500 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* ── Register Link ── */}
          <p className="text-center mt-6 text-body text-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-500 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
