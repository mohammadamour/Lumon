import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products?sort_by=created_at&sort_order=desc');
                setProducts(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900 z-0"></div>
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 px-8 py-24 sm:px-16 sm:py-32 lg:px-24 flex flex-col items-start justify-center text-left max-w-3xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-300 text-sm font-semibold mb-6 border border-primary-500/30">
                        New Collection 2026
                    </span>
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Elevate your lifestyle with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-300">premium goods.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                        Discover our curated selection of high-quality products designed to bring elegance and functionality to your everyday life.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/products" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center shadow-lg shadow-primary-500/30 transform hover:-translate-y-1">
                            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                        <Link to="/categories" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold transition-all duration-300">
                            Explore Categories
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Zap, title: "Lightning Fast", desc: "Same-day delivery on selected items across the country." },
                    { icon: ShieldCheck, title: "Secure Checkout", desc: "Your payment information is encrypted and 100% safe." },
                    { icon: Truck, title: "Free Returns", desc: "Not satisfied? Return it within 30 days, no questions asked." }
                ].map((feature, i) => (
                    <div key={i} className="flex items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 p-3 bg-primary-50 text-primary-600 rounded-xl mr-5">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* Trending Products */}
            <section>
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Now</h2>
                        <p className="text-slate-500">Handpicked items just for you.</p>
                    </div>
                    <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center group">
                        View All <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 h-80">
                                <div className="bg-slate-200 h-48 rounded-t-2xl"></div>
                                <div className="p-5 space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-6 bg-slate-200 rounded w-1/4 mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.slice(0, 8).map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-lg">No products found. Make sure your Laravel server is running!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
