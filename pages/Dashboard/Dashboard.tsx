import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  UserCircle,
  LogOut,
  Settings as SettingsIcon,
  Menu,
  X,
  Briefcase,
  Zap,
  BarChart3,
  Fingerprint,
  FileWarning
} from 'lucide-react';
import { DashboardView } from '../../types';
import { useDashboardData } from '../../hooks/useDashboardData';

// Import Views
import Overview from './views/Overview';
import Groups from './views/Groups';
import UsersView from './views/Users';
import Agents from './views/Agents';
import Statistics from './views/Statistics';
import Settings from './views/Settings';
import KYC from './views/KYC';
import Penalties from './views/Penalties';
import Transactions from './views/Transactions';
import Profile from './views/Profile';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    refreshAll,
  } = useDashboardData();

  useEffect(() => {
    // When view changes, refresh global dashboard slices via the hook
    refreshAll();
  }, [currentView, refreshAll]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleNavClick = (view: DashboardView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };
  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <UsersView />;
      case 'groups':
        return <Groups />;
      case 'agents':
        return <Agents />;
      case 'kyc':
        return <KYC />;
      case 'penalties':
        return <Penalties />;
      case 'transaction_management':
        return <Transactions />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <div>Vue non trouvée</div>;
    };

  };


  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}







      {/* Sidebar - Responsive */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-auto
        w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2 justify-center w-full">
            <img
              src="/logo.png"
              alt="Mosolocoop"
              className="h-10 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/150x50/white/black?text=MosoloCoop";
              }}
            />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-200 hover:text-white absolute right-4">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'overview' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Vue d'ensemble
          </button>

          <button
            onClick={() => handleNavClick('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'users' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Users className="h-5 w-5" /> Clients
          </button>

          <button
            onClick={() => handleNavClick('groups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'groups' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Layers className="h-5 w-5" /> Groupes
          </button>

          <button
            onClick={() => handleNavClick('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'agents' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Briefcase className="h-5 w-5" /> Agents {/* Renamed from Partenaires */}
          </button>

          <button
            onClick={() => handleNavClick('kyc')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'kyc' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Fingerprint className="h-5 w-5" /> Vérification KYC
          </button>

          <button
            onClick={() => handleNavClick('penalties')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'penalties' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <FileWarning className="h-5 w-5" /> Pénalités
          </button>

          <div className="border-t border-gray-800 my-2"></div> {/* Separator */}

          <button
            onClick={() => handleNavClick('transaction_management')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'transaction_management' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Zap className="h-5 w-5" /> Gestion Transactions
          </button>

          {/* 'Historique Complet' removed per request */}

          <div className="border-t border-gray-800 my-2"></div> {/* Separator */}

          <button
            onClick={() => handleNavClick('statistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'statistics' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <BarChart3 className="h-5 w-5" /> Statistiques
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <SettingsIcon className="h-5 w-5" /> Paramètres
          </button>

          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'profile' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <UserCircle className="h-5 w-5" /> Mon Profil
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900/50 hover:text-red-100 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex-none bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-30">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Mosolocoop"
              className="h-8 w-auto object-contain rounded-md bg-white p-0.5"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/100x40/white/black?text=MosoloCoop";
              }}
            />
          </div>
          <button
            className="p-2 hover:bg-gray-800 rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;