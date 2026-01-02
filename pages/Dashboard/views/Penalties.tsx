import React, { useState, useEffect } from 'react';
import {
    FileWarning,
    AlertCircle,
    CheckCircle,
    Search,
    Plus,
    X
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { Penalty } from '../../../types';

const Penalties: React.FC = () => {
    const [penalties, setPenalties] = useState<Penalty[]>([]);
    const [penaltySearchTerm, setPenaltySearchTerm] = useState('');
    const [penaltyFilterStatus, setPenaltyFilterStatus] = useState('all');

    // Create Penalty Modal
    const [isCreatePenaltyModalOpen, setIsCreatePenaltyModalOpen] = useState(false);
    const [newPenalty, setNewPenalty] = useState({ userId: '', amount: 0, reason: '' });

    const refreshPenalties = () => {
        setPenalties(MockService.getPenalties());
    };

    useEffect(() => {
        refreshPenalties();
    }, []);

    const handleCreatePenalty = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPenalty.userId && newPenalty.amount > 0 && newPenalty.reason) {
            MockService.addPenalty({
                id: `PEN-${Date.now()}`,
                userId: newPenalty.userId,
                userFullName: `Client ${newPenalty.userId}`, // Mock name resolution
                amount: newPenalty.amount,
                reason: newPenalty.reason,
                date: new Date().toISOString().split('T')[0],
                status: 'pending'
            });
            refreshPenalties();
            setNewPenalty({ userId: '', amount: 0, reason: '' });
            setIsCreatePenaltyModalOpen(false);
            alert("Pénalité appliquée avec succès.");
        }
    };

    const handlePayPenalty = (id: string) => {
        if (window.confirm("Marquer cette pénalité comme payée ?")) {
            MockService.payPenalty(id);
            refreshPenalties();
            alert("Pénalité marquée comme payée.");
        }
    };

    const filteredPenalties = penalties.filter(p => {
        const matchesSearch = p.userFullName.toLowerCase().includes(penaltySearchTerm.toLowerCase()) ||
            p.reason.toLowerCase().includes(penaltySearchTerm.toLowerCase());
        const matchesStatus = penaltyFilterStatus === 'all' || p.status === penaltyFilterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Pénalités</h2>
                <button
                    onClick={() => setIsCreatePenaltyModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" /> Appliquer une pénalité
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <FileWarning className="h-5 w-5 text-gray-500" />
                        <span className="font-medium text-gray-700">Liste des infractions</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-auto">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={penaltySearchTerm}
                                onChange={(e) => setPenaltySearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        <select
                            value={penaltyFilterStatus}
                            onChange={(e) => setPenaltyFilterStatus(e.target.value)}
                            className="p-2 border rounded-lg text-sm focus:outline-none bg-white"
                        >
                            <option value="all">Tous status</option>
                            <option value="pending">Impayé</option>
                            <option value="paid">Payé</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredPenalties.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPenalties.map((penalty) => (
                                    <tr key={penalty.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{penalty.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{penalty.userFullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{penalty.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-600">{penalty.amount.toLocaleString()} FC</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {penalty.status === 'paid' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3" /> Payé
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                                    <AlertCircle className="h-3 w-3" /> Impayé
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {penalty.status === 'pending' && (
                                                <button
                                                    onClick={() => handlePayPenalty(penalty.id)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    Marquer payé
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            Aucune pénalité trouvée.
                        </div>
                    )}
                </div>
            </div>

            {/* Create Penalty Modal */}
            {isCreatePenaltyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Nouvelle Pénalité</h3>
                            <button onClick={() => setIsCreatePenaltyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePenalty} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID Utilisateur</label>
                                <input
                                    type="text"
                                    value={newPenalty.userId}
                                    onChange={(e) => setNewPenalty({ ...newPenalty, userId: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FC)</label>
                                <input
                                    type="number"
                                    value={newPenalty.amount || ''}
                                    onChange={(e) => setNewPenalty({ ...newPenalty, amount: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                                <textarea
                                    value={newPenalty.reason}
                                    onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    rows={3}
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                                Appliquer
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Penalties;
