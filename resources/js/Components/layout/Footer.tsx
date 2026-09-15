import React from 'react';
import { Link } from '@inertiajs/react';
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

export default function Footer() {
  return (
    <footer className="bg-[#23A6F0] text-white pt-16">
      <div className="container-main">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Logo, Note & Socials (Takes 2 cols on md for better spacing) */}
          <div className="md:col-span-2 pr-0 md:pr-12">
            <Link href="/" className="text-3xl font-extrabold tracking-widest text-white mb-6 inline-block">
              LUMON
            </Link>
            <h4 className="text-xl font-bold mb-4">Note</h4>
            <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
              This is a portfolio website. It is not a real store, none of the data or products are real, and it is made purely for practice purposes.
            </p>
            <div className="flex gap-5">
              <a 
                href="https://github.com/mohammadamour/Lumon" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                aria-label="GitHub Repository"
              >
                <Github size={28} />
              </a>
              <a 
                href="https://mohammadamour.github.io/Mohammad-Altayeb/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                aria-label="Personal Website"
              >
                <Globe size={28} />
              </a>
              <a 
                href="https://mostaql.com/u/Mohammad_Amour" 
                target="_blank" 
                rel="noreferrer" 
                className="text-white hover:text-gray-200 transition-transform transform hover:scale-110"
                aria-label="Mostaql Profile"
              >
                <Briefcase size={28} />
              </a>
            </div>
          </div>

          {/* Column 2: Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Company info</h4>
            <ul className="flex flex-col gap-4 text-sm font-bold text-white/90">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Carrier</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">We are hiring</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div>
            <h4 className="text-xl font-bold mb-6">Features</h4>
            <ul className="flex flex-col gap-4 text-sm font-bold text-white/90">
              <li><Link href="#" className="hover:text-white transition-colors">Business Marketing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">User Analytic</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Live Chat</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Unlimited Support</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar with slightly darker background */}
      <div className="bg-black/5">
        <div className="container-main py-6 text-center sm:text-left text-sm font-bold text-white flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>
            Made by Mohammad <a href="https://mohammadamour.github.io/Mohammad-Altayeb/" target="_blank" rel="noreferrer" className="underline hover:text-gray-200 transition-colors">Al-amour</a>
          </p>
          <p>All Right Reserved</p>
        </div>
      </div>
    </footer>
  );
}
