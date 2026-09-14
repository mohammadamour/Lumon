import React from 'react';
import { Store, Search, LayoutDashboard, Heart } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Multi-Vendor Marketplace',
    description: 'Empowering independent sellers to easily list their products and reach a wider audience.'
  },
  {
    icon: Search,
    title: 'Advanced Search & Sort',
    description: 'Find exactly what you need with our intuitive filtering and dynamic sorting options.'
  },
  {
    icon: LayoutDashboard,
    title: 'Easy Product Management',
    description: 'Sellers get a dedicated dashboard to manage their inventory, pricing, and orders effortlessly.'
  },
  {
    icon: Heart,
    title: 'Favorites & Wishlists',
    description: 'Save products you love and curate your personal wishlist for future purchases.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why Choose Lumon?
          </h2>
          <p className="text-lg text-gray-600">
            Lumon connects buyers with passionate independent sellers. We believe great products should be accessible to everyone, and every seller deserves a fair, transparent marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group p-8 bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
