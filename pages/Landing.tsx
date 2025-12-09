import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, TrendingUp, Users, ArrowRight, Banknote, Clock, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              L'avenir de votre épargne communautaire commence ici.
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Bienvenue chez <span className="font-bold text-white">Mosolocoop</span>. Nous réinventons la tontine et le micro-crédit pour vous offrir une sécurité financière absolue et une croissance garantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/login" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 md:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#about" className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 md:text-lg transition-all">
                En savoir plus
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About / Description Section */}
      <section id="about" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-sm sm:text-base text-gray-700 font-semibold tracking-wide uppercase">À Propos de Nous</h2>
            <p className="mt-2 text-3xl sm:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
              Plus qu'une banque, une communauté.
            </p>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
              Mosolocoop est une agence pionnière dans la digitalisation des tontines traditionnelles. Notre mission est de faciliter l'accès au micro-crédit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Sécurité Garantie</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Vos fonds sont protégés par des protocoles de sécurité bancaire. La transparence est au cœur de toutes nos opérations de tontine.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Force Communautaire</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Rejoignez des groupes dynamiques. Ensemble, nous créons un levier financier puissant pour réaliser vos projets personnels et professionnels.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <div className="bg-gray-200 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Micro-Crédit Flexible</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Obtenez des financements rapides avec des taux d'intérêt justes et adaptés à votre capacité de remboursement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">Nos Services Financiers</h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 sm:gap-8">
            <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-gray-200 rounded-lg">
                    <Banknote className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Tontine Rotative</h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Participez à des cycles d'épargne où chaque membre bénéficie de la cagnotte à tour de rôle. Idéal pour les gros achats planifiés.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center bg-gray-50 p-2 rounded-lg"><span className="w-2 h-2 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>Cycles hebdomadaires ou mensuels</li>
                <li className="flex items-center bg-gray-50 p-2 rounded-lg"><span className="w-2 h-2 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>Tirage au sort équitable</li>
              </ul>
            </div>

            <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-3 bg-gray-200 rounded-lg">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                 </div>
                 <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Épargne Projet</h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Mettez de l'argent de côté à votre rythme pour un objectif précis. Votre argent travaille pour vous pendant qu'il dort.
              </p>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="flex items-center bg-gray-50 p-2 rounded-lg"><span className="w-2 h-2 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>Retrait flexible</li>
                <li className="flex items-center bg-gray-50 p-2 rounded-lg"><span className="w-2 h-2 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>Suivi en temps réel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <img 
                src="/logo.png" 
                alt="Mosolocoop" 
                className="h-10 w-auto object-contain bg-white rounded-md p-0.5"
                onError={(e) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = "https://placehold.co/150x50/white/black?text=MosoloCoop";
                }}
              />
            </div>
            <p className="mt-2 text-sm">© 2024 Mosolocoop Inc. Tous droits réservés.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
             <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
             <a href="#" className="hover:text-white transition-colors">Conditions</a>
             <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;