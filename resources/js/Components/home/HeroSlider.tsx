import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

const SLIDES = [
  {
    id: 1,
    subtitle: 'SUMMER 2024',
    title: 'START SHOPPING AT LUMON NOW',
    description: 'Find everyday items designed for quality, comfort, and performance.',
    buttonText: 'SHOP NOW',
    buttonLink: '/products',
  },
  {
    id: 2,
    subtitle: 'FOR SELLERS',
    title: 'HAVE A PRODUCT TO SELL?',
    description: 'Start selling your products on Lumon and reach thousands of customers worldwide.',
    buttonText: 'START SELLING',
    buttonLink: '/register',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-primary-400">
      {/* Background Image - same for both slides */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.png)' }}
      />
      
      {/* Optional Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Slides */}
      <div 
        className="relative flex h-full w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="h-full w-full flex-shrink-0 flex items-center">
            <div className="container-main w-full">
              <div className="max-w-xl text-white">
                <p className="mb-6 font-bold tracking-wider text-sm md:text-base uppercase">
                  {slide.subtitle}
                </p>
                <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-[64px]">
                  {slide.title}
                </h1>
                <p className="mb-8 max-w-md text-lg md:text-xl text-white/90">
                  {slide.description}
                </p>
                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center justify-center rounded bg-success px-10 py-4 text-center font-bold text-white transition-colors hover:bg-success-600 uppercase tracking-wide"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full text-white transition-colors hover:bg-white/20 md:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft size={64} strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full text-white transition-colors hover:bg-white/20 md:right-8"
        aria-label="Next slide"
      >
        <ChevronRight size={64} strokeWidth={1} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all ${
              currentSlide === index ? 'w-8 bg-white' : 'w-4 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
