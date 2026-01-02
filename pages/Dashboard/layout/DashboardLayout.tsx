import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

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
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
