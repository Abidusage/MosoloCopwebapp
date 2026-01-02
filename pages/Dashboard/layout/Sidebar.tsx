import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Layers,
    UserCircle,
    LogOut,
    Zap,
    History,
    BarChart3,
    Settings,
    Briefcase,
    Fingerprint,
    FileWarning,
    X
} from 'lucide-react';

interface SidebarProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const navItems = [
        { path: 'overview', icon: LayoutDashboard, label: "Vue d'ensemble" },
        { path: 'users', icon: Users, label: "Clients" },
        { path: 'groups', icon: Layers, label: "Groupes" },
        { path: 'agents', icon: Briefcase, label: "Agents" },
        { path: 'kyc', icon: Fingerprint, label: "Vérification KYC" },
        { path: 'penalties', icon: FileWarning, label: "Pénalités" },
    ];

    const transactionItems = [
        { path: 'transaction_management', icon: Zap, label: "Gestion Transactions" },
        { path: 'transactions', icon: History, label: "Historique Complet" },
    ];

    const systemItems = [
        { path: 'statistics', icon: BarChart3, label: "Statistiques" },
        { path: 'settings', icon: Settings, label: "Paramètres" },
        { path: 'profile', icon: UserCircle, label: "Mon Profil" },
    ];

    return (
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
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}
            `}
                    >
                        <item.icon className="h-5 w-5" /> {item.label}
                    </NavLink>
                ))}

                <div className="border-t border-gray-800 my-2"></div>

                {transactionItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}
            `}
                    >
                        <item.icon className="h-5 w-5" /> {item.label}
                    </NavLink>
                ))}

                <div className="border-t border-gray-800 my-2"></div>

                {systemItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${isActive ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}
            `}
                    >
                        <item.icon className="h-5 w-5" /> {item.label}
                    </NavLink>
                ))}
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
    );
};

export default Sidebar;
