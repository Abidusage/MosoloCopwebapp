import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Download,
    Search,
    ArrowUpRight,
    CheckCircle,
    XCircle,
    Clock,
    ArrowDownLeft,
    Shield,
    Filter,
    Calendar,
    Eye,
    X
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { Transaction } from '../../../types';

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

    // Filters
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTimeframe, setFilterTimeframe] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Standard is 10 for transaction lists

    // Modal
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        setTransactions(MockService.getTransactions());
    }, []);

    useEffect(() => {
        let result = transactions;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(t =>
                t.userFullName.toLowerCase().includes(lowerSearch) ||
                t.id.toLowerCase().includes(lowerSearch)
            );
        }

        if (filterType !== 'all') {
            result = result.filter(t => t.type === filterType);
        }

        if (filterStatus !== 'all') {
            result = result.filter(t => t.status === filterStatus);
        }

        // Timeframe filter logic would go here (requires date parsing)
        // For now assuming strings like "2023-01-01" or similar
        // Simple mock implementation used in Dashboard.tsx probably ignored exact date math
        // We will skip complex date math for MVP unless requested.

        setFilteredTransactions(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [transactions, search, filterType, filterStatus, filterTimeframe]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handleExport = () => {
        alert("Export en cours... (CSV généré)");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Historique des Transactions</h2>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <Download className="h-4 w-4" /> Exporter CSV
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-64">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher ID ou Nom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-500"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="p-2 border rounded-lg text-sm focus:outline-none bg-gray-50 hover:bg-white"
                        >
                            <option value="all">Tous les types</option>
                            <option value="deposit">Dépôts</option>
                            <option value="withdrawal">Retraits</option>
                            <option value="loan_eligibility">Crédits</option>
                            <option value="status_change">Admin</option>
                        </select>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border rounded-lg text-sm focus:outline-none bg-gray-50 hover:bg-white"
                    >
                        <option value="all">Tous status</option>
                        <option value="success">Validé</option>
                        <option value="pending">En attente</option>
                        <option value="failed">Échoué</option>
                    </select>

                    <select
                        value={filterTimeframe}
                        onChange={(e) => setFilterTimeframe(e.target.value)}
                        className="p-2 border rounded-lg text-sm focus:outline-none bg-gray-50 hover:bg-white"
                    >
                        <option value="all">Toute période</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">{tx.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.userFullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                {tx.type === 'deposit' ? (
                                                    <div className="p-1.5 bg-green-100 text-green-600 rounded">
                                                        <ArrowUpRight className="h-3 w-3" />
                                                    </div>
                                                ) : tx.type === 'withdrawal' ? (
                                                    <div className="p-1.5 bg-red-100 text-red-600 rounded">
                                                        <ArrowDownLeft className="h-3 w-3" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                                                        <Shield className="h-3 w-3" />
                                                    </div>
                                                )}
                                                <span className="capitalize">{tx.type === 'loan_eligibility' ? 'Crédit' : tx.type === 'status_change' ? 'Admin' : tx.type === 'deposit' ? 'Dépôt' : 'Retrait'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3 text-gray-400" /> {tx.date}
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {tx.amount > 0 ? `${tx.amount.toLocaleString()} FC` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {tx.status === 'success' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3" /> Validé
                                                </span>
                                            ) : tx.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <Clock className="h-3 w-3" /> En attente
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="h-3 w-3" /> Échoué
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedTransaction(tx)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                        Aucune transaction trouvée pour ces filtres.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredTransactions.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                        <span className="text-sm text-gray-700">
                            Page {currentPage} sur {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md bg-white disabled:opacity-50 hover:bg-gray-100 text-sm"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md bg-white disabled:opacity-50 hover:bg-gray-100 text-sm"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction Detail Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Détails de la transaction</h3>
                            <button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col items-center justify-center pb-4 border-b border-gray-100">
                                <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-2 ${selectedTransaction.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {selectedTransaction.status === 'success' ? <CheckCircle className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{selectedTransaction.amount.toLocaleString()} FC</p>
                                <p className="text-sm text-gray-500 capitalize">{selectedTransaction.type}</p>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">ID Transaction</span>
                                    <span className="text-sm font-mono font-medium text-gray-900">{selectedTransaction.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Client</span>
                                    <span className="text-sm font-medium text-gray-900">{selectedTransaction.userFullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Date & Heure</span>
                                    <span className="text-sm text-gray-900">{selectedTransaction.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Statut</span>
                                    <span className={`text-sm font-bold uppercase ${selectedTransaction.status === 'success' ? 'text-green-600' : 'text-red-600'
                                        }`}>{selectedTransaction.status}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedTransaction(null)}
                                className="w-full mt-4 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
