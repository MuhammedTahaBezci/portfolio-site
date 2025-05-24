'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Image bileşenini kullanacağız
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/gallery', label: 'Galeri' },
    { href: '/exhibitions', label: 'Sergiler' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'Hakkımda' },
    { href: '/contact', label: 'İletişim' },
  ];

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary-600' : 'text-neutral-600 hover:text-primary-600';
  };

  return (
    <nav className="bg-neutral-background shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Logo buraya eklendi */}
              <Image
                src="/images/logo1.png" // Logo dosyanızın yolu, public klasöründeyse doğrudan adı yazılır
                alt="Muhammed Taha Bezci Logo"
                width={32} // Logonuzun genişliği
                height={32} // Logonuzun yüksekliği
                className="mr-2 rounded-full" // Logoya biraz marj ve yuvarlaklık ekledik
              />
              <span className="font-serif text-xl font-bold text-neutral-900">Muhammed Taha Bezci</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${isActive(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500"
              aria-expanded="false"
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href)}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}