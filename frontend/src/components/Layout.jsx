import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { ShoppingCart, User, LogOut } from 'lucide-react';

export default function Layout() {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-tight">
                                BagistoClone
                            </Link>
                        </div>
                        
                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
                            <Link to="/products" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Shop</Link>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center space-x-6">
                            <Link to="/cart" className="text-slate-500 hover:text-primary-600 relative transition-colors">
                                <ShoppingCart className="h-6 w-6" />
                                {/* Badge could go here */}
                            </Link>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-medium text-slate-700">Hi, {user.name}</span>
                                    <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors">
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} BagistoClone. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
