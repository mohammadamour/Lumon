import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
    // Generate a placeholder image based on the product ID for some visual variety
    const imageUrl = `https://picsum.photos/seed/${product.id}/400/300`;

    return (
        <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-600 rounded-full shadow-sm">
                        {product.category?.name || 'Category'}
                    </span>
                </div>
            </div>
            
            <div className="p-5">
                <Link to={`/products/${product.slug}`}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1 hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-slate-900">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    <button className="flex items-center justify-center bg-slate-50 hover:bg-primary-50 text-slate-700 hover:text-primary-600 p-2.5 rounded-xl transition-colors group/btn">
                        <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
