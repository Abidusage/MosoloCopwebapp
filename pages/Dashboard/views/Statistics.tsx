import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { MockService } from '../../../services/mockStore';

const Statistics: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        setStats(MockService.getGlobalStats());
    }, []);

    // Loader si stats n'est pas encore disponible
    if (!stats) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Chargement des statistiques...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Statistiques Détaillées</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Entrées</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {(stats?.totalDepositsAmount ?? 0).toLocaleString()} FC
                            </h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <ArrowUpRight className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <TrendingUp className="h-3 w-3" /> +12% ce mois
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Sorties</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {(stats?.totalWithdrawalsAmount ?? 0).toLocaleString()} FC
                            </h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <ArrowDownLeft className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Mises à disposition tontine incluses</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Frais Collectés</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {((stats?.totalDepositsAmount ?? 0) * 0.02).toLocaleString()} FC
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Estimations (2%)</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Pénalités Non-Paiement</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                {(stats?.totalPenaltiesAmount ?? 0).toLocaleString()} FC
                            </h3>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <ArrowDownLeft className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Montant total des pénalités actives</p>
                </div>
            </div>

            {/* Visual Charts Placeholders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-500" /> Croissance des Dépôts
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-blue-50 rounded-t-sm relative group">
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-sm transition-all duration-500 group-hover:bg-blue-700"
                                    style={{ height: `${h}%` }}
                                ></div>
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded transition-opacity pointer-events-none">
                                    {(h * 10000).toLocaleString()} F
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400">
                        <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-gray-500" /> Répartition par Status
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                        <div className="relative h-48 w-48 rounded-full border-[16px] border-gray-100 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-[16px] border-green-500 border-r-transparent border-b-transparent transform rotate-45"></div>
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-gray-800">85%</span>
                                <span className="text-xs text-gray-500 uppercase">Actifs</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span> Actifs
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-3 h-3 rounded-full bg-gray-200"></span> Inactifs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
