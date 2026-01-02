import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png'; // Assure-toi que ce fichier existe bien

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Mosolo */}
          <div className="flex items-center gap-3 z-50">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Mosolocoop"
                className="h-14 sm:h-16 w-14 sm:w-16 object-cover rounded-full border-2 border-gray-300 shadow-md"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://placehold.co/80x80?text=Logo";
                }}
              />
            </Link>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-600 leading-tight">
                Mosolo Coop <span className="text-gray-900">Tontine</span>
              </p>
              <p className="text-xs text-gray-400">
                <a
                  href="https://abidusage.github.io/kabidusageportofolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  Développé par Sage Kabidu
                </a>
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8 text-sm font-medium text-gray-600">
              <a href="#services" className="hover:text-gray-700 transition-colors">Services</a>
              <a href="#about" className="hover:text-gray-700 transition-colors">À propos</a>
              <a href="#contact" className="hover:text-gray-700 transition-colors">Contact</a>
            </div>

            <Link
              to="/login"
              className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm"
            >
              <LogIn className="h-4 w-4" />
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-700 p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
          <a
            href="#services"
            className="block py-2 text-base font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 px-3 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </a>
          <a
            href="#about"
            className="block py-2 text-base font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 px-3 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            À propos
          </a>
          <a
            href="#contact"
            className="block py-2 text-base font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-50 px-3 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
          <div className="pt-2 border-t border-gray-100 mt-2">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Connexion
            </Link>
          </div>
          <div className="text-center text-xs text-gray-500 mt-4">
            <a
              href="https://abidusage.github.io/kabidusageportofolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Développé par Sage Kabidu
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
