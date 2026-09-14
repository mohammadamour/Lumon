import React from 'react';
import { Github, Globe, Briefcase } from 'lucide-react';

export default function NewsletterSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 sm:py-32 px-4 overflow-hidden">
      
      {/* Background Images for Mobile and Desktop */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: "url('/images/newsletter-bg-mobile.png')" }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
        style={{ backgroundImage: "url('/images/newsletter-bg.png')" }}
      />
      
      {/* Subtle overlay to ensure text remains readable */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl w-full mx-auto">
        
        {/* Header Text */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Join Our Newsletter
        </h2>
        
        {/* Subheader Text */}
        <p className="text-sm sm:text-base md:text-lg text-white mb-10 max-w-lg mx-auto font-medium">
          Get the latest updates on new arrivals, exclusive discounts, and special offers delivered directly to your inbox.
        </p>

        {/* Input & Subscribe Button */}
        <form className="flex max-w-xl mx-auto shadow-2xl mb-24 rounded border border-white/20 overflow-hidden" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full flex-1 px-4 sm:px-6 py-4 text-gray-900 bg-white focus:outline-none placeholder-gray-500"
            required
          />
          <button 
            type="submit"
            className="bg-[#23A6F0] hover:bg-[#1a85c2] text-white font-bold px-6 sm:px-10 py-4 transition-colors shrink-0"
          >
            Subscribe
          </button>
        </form>

        {/* Connect With Me / Social Icons */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl sm:text-3xl font-bold text-white mb-8 tracking-wide">
            Connect With Me
          </h3>
          <div className="flex gap-8 sm:gap-10 justify-center">
            <a 
              href="https://github.com/mohammadamour/Lumon" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="GitHub Repository"
            >
              <Github size={38} strokeWidth={1.5} />
            </a>
            <a 
              href="https://mohammadamour.github.io/Mohammad-Altayeb/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="Personal Website"
            >
              <Globe size={38} strokeWidth={1.5} />
            </a>
            <a 
              href="https://mostaql.com/u/Mohammad_Amour" 
              target="_blank" 
              rel="noreferrer" 
              className="text-white hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="Mostaql Profile"
            >
              <Briefcase size={38} strokeWidth={1.5} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
