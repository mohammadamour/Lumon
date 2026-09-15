import React, { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';

const testimonials = [
  {
    quote: "Lumon has completely transformed how I manage my independent store. The tools provided are absolutely unmatched and the support is phenomenal.",
    name: "Regina Miles",
    role: "Designer",
    image: "/images/Testimony headshot1.avif",
    rating: 5,
  },
  {
    quote: "I've discovered so many unique, high-quality products here. The checkout process is seamless and the shipping is fast. Highly recommended!",
    name: "Alexia Johnson",
    role: "Verified Buyer",
    image: "/images/Testimony headshot2.avif",
    rating: 5,
  },
  {
    quote: "The best marketplace for independent creators. I feel supported, and my sales have skyrocketed since joining Lumon's ecosystem.",
    name: "Marcus Chen",
    role: "Store Owner",
    image: "/images/Testimony headshot3.avif",
    rating: 4.5,
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Helper to render half and full stars
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} size={22} className="fill-yellow-400 text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalf key={i} size={22} className="fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={22} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <section className="bg-blue-600 py-24 px-4 overflow-hidden relative">
      <div className="container-main relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="uppercase text-sm font-bold tracking-widest text-blue-100 block">
            Testimonials
          </span>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[480px] sm:h-[400px] md:h-[350px] max-w-4xl mx-auto flex items-center justify-center">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 z-0 pointer-events-none'
              }`}
            >
              {/* Quote */}
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-relaxed mb-8 max-w-3xl mx-auto">
                "{t.quote}"
              </h3>

              {/* Headshot */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-blue-400/30 mb-5 shadow-xl shrink-0">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-full h-full object-cover object-center bg-blue-200"
                />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {renderStars(t.rating)}
              </div>

              {/* Author */}
              <div className="text-white">
                <p className="font-bold text-lg mb-0.5">{t.name}</p>
                <p className="text-blue-200 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8 md:mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none ${
                idx === currentIndex ? 'bg-white' : 'bg-blue-400/50 hover:bg-blue-300'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
