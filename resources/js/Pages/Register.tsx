import { useState, FormEvent } from 'react';
import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Layout from '../Components/layout/Layout';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  Store,
} from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-success-50 py-12 px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* ── Header ── */}
          <div className="text-center mb-8">
            <h1 className="text-h2 text-dark mb-2">Create your account</h1>
            <p className="text-body-lg text-muted">
              Join Lumon to start shopping or selling
            </p>
          </div>

          {/* ── Register Form ── */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-card-lg border border-gray-100 p-6 space-y-5"
          >
            {/* ── Role Selector ── */}
            <div>
              <label className="block text-body font-semibold text-dark mb-2.5">
                I want to…
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setData('role', 'buyer')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${
                    data.role === 'buyer'
                      ? 'border-primary bg-primary-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <ShoppingBag
                    size={24}
                    className={
                      data.role === 'buyer' ? 'text-primary' : 'text-muted-light'
                    }
                  />
                  <span
                    className={`text-body font-semibold ${
                      data.role === 'buyer' ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    Buy Products
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setData('role', 'seller')}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${
                    data.role === 'seller'
                      ? 'border-success bg-success-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Store
                    size={24}
                    className={
                      data.role === 'seller'
                        ? 'text-success'
                        : 'text-muted-light'
                    }
                  />
                  <span
                    className={`text-body font-semibold ${
                      data.role === 'seller' ? 'text-success' : 'text-muted'
                    }`}
                  >
                    Sell Products
                  </span>
                </button>
              </div>
              {errors.role && (
                <p className="mt-1.5 text-caption text-danger">{errors.role}</p>
              )}
            </div>

            {/* ── Full Name ── */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-body font-semibold text-dark mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
                />
                <input
                  id="register-name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.name ? 'border-danger' : 'border-gray-200'
                  } bg-light py-3 pl-11 pr-4 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100`}
                  placeholder="John Doe"
                  autoComplete="name"
                  autoFocus
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-caption text-danger">{errors.name}</p>
              )}
            </div>

            {/* ── Email ── */}
            <div>
              <label
                htmlFor="register-email"
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
                  id="register-email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.email ? 'border-danger' : 'border-gray-200'
                  } bg-light py-3 pl-11 pr-4 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-caption text-danger">{errors.email}</p>
              )}
            </div>

            {/* ── Password ── */}
            <div>
              <label
                htmlFor="register-password"
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
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.password ? 'border-danger' : 'border-gray-200'
                  } bg-light py-3 pl-11 pr-11 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100`}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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

            {/* ── Confirm Password ── */}
            <div>
              <label
                htmlFor="register-password-confirm"
                className="block text-body font-semibold text-dark mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light pointer-events-none"
                />
                <input
                  id="register-password-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-light py-3 pl-11 pr-4 text-body text-dark placeholder:text-muted-light outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-100"
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={processing}
              className="w-full rounded-xl bg-primary py-3 text-body font-bold text-white shadow-sm transition-all hover:bg-primary-500 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* ── Login Link ── */}
          <p className="text-center mt-6 text-body text-muted">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
