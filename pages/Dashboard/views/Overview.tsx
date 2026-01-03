import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    Users,
    Layers,
    Banknote,
    Bell,
    Activity,
    ArrowUpRight,
    Shield,
    RefreshCcw,
    ArrowDownLeft,
    UserPlus,
    Plus,
    Wallet
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { User, Group, Transaction, AdminProfile } from '../../../types';

const Overview: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
    const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

    useEffect(() => {
        setStats(MockService.getGlobalStats());
        setUsers(MockService.getUsers());
        setGroups(MockService.getGroups());
        setTransactions(MockService.getTransactions());
        setPendingSubmissionsCount(MockService.getPendingSubmissionsCount());
        setAdminProfile(MockService.getAdminProfile());
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
                    <p className="text-gray-500 text-sm">Bienvenue, {adminProfile?.fullName}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Nouveau Client
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                    >
                        <Wallet className="h-4 w-4" /> Dépôt Rapide
                    </button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
                        <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Solde Total</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{MockService.getTotalDeposits().toLocaleString()} <span className="text-sm font-normal text-gray-500">FC</span></p>
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Clients Actifs</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
                        <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Groupes Tontine</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{groups.length}</p>
                    </div>
                </div>

                {/* New KPI Card for Total Admin Deposits */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 sm:p-4 bg-blue-100 rounded-lg">
                        <Banknote className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Dépôts Admin</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalAdminDepositsAmount.toLocaleString()} <span className="text-sm font-normal text-gray-500">FC</span></p>
                    </div>
                </div>

                {/* New KPI Card for Total Penalties */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 sm:p-4 bg-red-100 rounded-lg">
                        <ArrowDownLeft className="h-6 w-6 sm:h-8 sm:w-8 text-red-700" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pénalités Non-Paiement</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalPenaltiesAmount?.toLocaleString()} <span className="text-sm font-normal text-gray-500">FC</span></p>
                    </div>
                </div>

                {/* Alert / Pending Card */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/agents')}>
                    <div className="p-3 sm:p-4 bg-yellow-100 rounded-lg relative">
                        <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700" />
                        {pendingSubmissionsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">En Attente</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {pendingSubmissionsCount}
                            <span className="text-xs font-normal text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">Actions requises</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activity Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Activity className="h-5 w-5 text-gray-500" /> Dernières Transactions
                        </h3>
                        <button onClick={() => navigate('/dashboard/transactions')} className="text-sm text-gray-700 hover:text-gray-800 font-medium">Voir tout</button>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {transactions.slice(0, 5).map((tx) => (
                            <div key={tx.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : tx.type === 'loan_eligibility' ? 'bg-blue-100 text-blue-600' : tx.type === 'status_change' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {tx.type === 'deposit' ? <ArrowUpRight className="h-4 w-4" /> : tx.type === 'loan_eligibility' ? <Shield className="h-4 w-4" /> : tx.type === 'status_change' ? <RefreshCcw className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{tx.userFullName}</p>
                                        <p className="text-xs text-gray-500">{tx.date.split(' ')[0]} • {tx.type === 'deposit' ? 'Dépôt' : tx.type === 'withdrawal' ? 'Retrait' : tx.type === 'loan_eligibility' ? 'Crédit' : 'Statut'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-bold ${tx.status === 'failed' ? 'text-gray-400 line-through' : (tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900')}`}>
                                        {tx.type === 'loan_eligibility' || tx.type === 'status_change' ? '-' : `${tx.amount.toLocaleString()} FC`}
                                    </p>
                                    <span className={`text-[10px] ${tx.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.status === 'success' ? 'Validé' : 'Échoué'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* New Members / Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-gray-500" /> Nouveaux Clients
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {users.slice(-4).reverse().map((user) => (
                            <div key={user.id} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                        {user.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">Inscrit le {user.joinedDate}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{user.depositAmount.toLocaleString()} FC</p>
                                    <p className="text-xs text-green-600">Solde initial</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                        <button onClick={() => navigate('/dashboard/users')} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Gérer tous les clients</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
