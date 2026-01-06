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
import { Penalty, User } from '../../../types';

const Penalties: React.FC = () => {
    const [penalties, setPenalties] = useState<Penalty[]>([]);
    const [penaltySearchTerm, setPenaltySearchTerm] = useState('');
    const [penaltyFilterStatus, setPenaltyFilterStatus] = useState('all');

    // History State
    const [historyTimeFilter, setHistoryTimeFilter] = useState<'today' | 'yesterday' | 'week'>('today');

    // Create Penalty Modal
    const [isCreatePenaltyModalOpen, setIsCreatePenaltyModalOpen] = useState(false);
    const [newPenalty, setNewPenalty] = useState({ userId: '', amount: 0, reason: '' });
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [modalSearchTerm, setModalSearchTerm] = useState('');

    const refreshPenalties = () => {
        setPenalties(MockService.getPenalties());
    };

    useEffect(() => {
        refreshPenalties();
    }, []);

    const openCreatePenaltyModal = () => {
        setAvailableUsers(MockService.getUsers());
        setModalSearchTerm('');
        setNewPenalty({ userId: '', amount: 0, reason: '' });
        setIsCreatePenaltyModalOpen(true);
    };

    const handleCreatePenalty = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPenalty.userId && newPenalty.amount > 0 && newPenalty.reason) {
            MockService.addPenalty({
                userId: newPenalty.userId,
                amount: newPenalty.amount,
                reason: newPenalty.reason,
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
        const matchesStatus = penaltyFilterStatus === 'all' ||
            (penaltyFilterStatus === 'paid' ? p.status === 'resolved' : p.status === 'active');
        return matchesSearch && matchesStatus;
    });

    const getHistoryPenalties = () => {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        return penalties.filter(p => {
            if (p.status !== 'resolved' || !p.resolvedDate) return false;

            if (historyTimeFilter === 'today') return p.resolvedDate === today;
            if (historyTimeFilter === 'yesterday') return p.resolvedDate === yesterday;
            if (historyTimeFilter === 'week') {
                const resDate = new Date(p.resolvedDate);
                return resDate >= weekAgo && resDate <= now;
            }
            return false;
        }).sort((a, b) => (b.resolvedDate || '').localeCompare(a.resolvedDate || ''));
    };

    const historyPenalties = getHistoryPenalties();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Pénalités</h2>
                <button
                    onClick={openCreatePenaltyModal}
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
                                            {penalty.status === 'resolved' ? (
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
                                            {penalty.status === 'active' && (
                                                <button
                                                    onClick={() => handlePayPenalty(penalty.id)}
                                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline transition-colors"
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
                            Aucune pénalité active trouvée.
                        </div>
                    )}
                </div>
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/30">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-bold text-gray-800">Historique des Paiements</h3>
                    </div>
                    <div className="flex gap-1 bg-white p-1 rounded-lg border shadow-xs">
                        {(['today', 'yesterday', 'week'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setHistoryTimeFilter(filter)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${historyTimeFilter === filter ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {filter === 'today' ? "Aujourd'hui" : filter === 'yesterday' ? "Hier" : "Cette Semaine"}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {historyPenalties.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50/50">
                                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Motif</th>
                                    <th className="px-6 py-3 text-right">Montant</th>
                                    <th className="px-6 py-3 text-center">Date Paiement</th>
                                    <th className="px-6 py-3 text-right">Par</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {historyPenalties.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{p.userFullName}</div>
                                            <div className="text-[10px] text-gray-400 font-mono">{p.id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{p.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-green-600">
                                            {p.amount.toLocaleString()} FC
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2 py-1 rounded font-medium">{p.resolvedDate}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-[10px] text-gray-400">
                                            {p.resolvedBy || 'Système'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-2">
                            <CheckCircle className="h-10 w-10 opacity-20" />
                            <p className="text-sm">Aucun paiement enregistré pour cette période.</p>
                        </div>
                    )}
                </div>
            </div>

            {isCreatePenaltyModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Appliquer une Pénalité</h3>
                            <button onClick={() => setIsCreatePenaltyModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePenalty} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher le client</label>
                                <div className="relative mb-2">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Nom ou ID..."
                                        value={modalSearchTerm}
                                        onChange={(e) => setModalSearchTerm(e.target.value)}
                                        className="w-full pl-9 p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    />
                                </div>
                                <div className="max-h-40 overflow-y-auto border rounded-lg divide-y bg-gray-50">
                                    {availableUsers
                                        .filter(u =>
                                            u.fullName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                                            u.id.toLowerCase().includes(modalSearchTerm.toLowerCase())
                                        )
                                        .map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => setNewPenalty({ ...newPenalty, userId: user.id })}
                                                className={`p-2 flex items-center justify-between cursor-pointer transition-colors ${newPenalty.userId === user.id ? 'bg-red-50 border-red-200' : 'hover:bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-[10px]">
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-900">{user.fullName}</p>
                                                        <p className="text-[10px] text-gray-500">{user.id}</p>
                                                    </div>
                                                </div>
                                                {newPenalty.userId === user.id && <CheckCircle className="h-4 w-4 text-red-600" />}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FC)</label>
                                <input
                                    type="number"
                                    value={newPenalty.amount || ''}
                                    onChange={(e) => setNewPenalty({ ...newPenalty, amount: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-bold"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motif de l'infraction</label>
                                <textarea
                                    value={newPenalty.reason}
                                    onChange={(e) => setNewPenalty({ ...newPenalty, reason: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                                    rows={2}
                                    required
                                    placeholder="Ex: Retard de paiement cycle mars"
                                />
                            </div>

                            <p className="text-[10px] text-gray-500 italic">
                                {newPenalty.userId ? `Appliquer à: ${availableUsers.find(u => u.id === newPenalty.userId)?.fullName}` : 'Veuillez sélectionner un membre.'}
                            </p>

                            <button
                                type="submit"
                                disabled={!newPenalty.userId || !newPenalty.amount}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Appliquer la pénalité
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Penalties;
