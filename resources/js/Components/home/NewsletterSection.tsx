import React from 'react';
import { Globe, Briefcase } from 'lucide-react';

const Github = ({ size = 24, strokeWidth = 2, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function NewsletterSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-gray-50">
      
      {/* Content */}
      <div className="text-center max-w-2xl w-full mx-auto">
        
        {/* Header Text */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Join Our Newsletter
        </h2>
        
        {/* Subheader Text */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-10 max-w-lg mx-auto font-medium">
          Get the latest updates on new arrivals, exclusive discounts, and special offers delivered directly to your inbox.
        </p>

        {/* Input & Subscribe Button */}
        <form className="flex max-w-xl mx-auto shadow-sm mb-12 rounded border border-gray-200 overflow-hidden bg-white" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full flex-1 px-4 sm:px-6 py-4 text-gray-900 bg-transparent focus:outline-none placeholder-gray-400"
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
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 tracking-wide">
            Connect With Me
          </h3>
          <div className="flex gap-8 sm:gap-10 justify-center">
            <a 
              href="https://github.com/mohammadamour/Lumon" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="GitHub Repository"
            >
              <Github size={32} strokeWidth={1.5} />
            </a>
            <a 
              href="https://mohammadamour.github.io/Mohammad-Altayeb/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="Personal Website"
            >
              <Globe size={32} strokeWidth={1.5} />
            </a>
            <a 
              href="https://mostaql.com/u/Mohammad_Amour" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-600 hover:text-[#23A6F0] transition-all transform hover:scale-110"
              aria-label="Mostaql Profile"
            >
              <Briefcase size={32} strokeWidth={1.5} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
