import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Search,
    Check,
    X
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { DepositSubmission } from '../../../types';

const Agents: React.FC = () => {
    const [pendingSubmissions, setPendingSubmissions] = useState<DepositSubmission[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const refreshSubmissions = () => {
        setPendingSubmissions(MockService.getPendingSubmissions());
    };

    useEffect(() => {
        refreshSubmissions();
    }, []);

    const handleValidateSubmission = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir valider ce dépôt ?")) {
            const success = MockService.validateSubmission(id);
            if (success) {
                refreshSubmissions();
                alert("Dépôt validé avec succès.");
            } else {
                alert("Erreur lors de la validation.");
            }
        }
    };

    const handleRejectSubmission = (id: string) => {
        const reason = prompt("Motif du rejet :");
        if (reason) {
            const success = MockService.rejectSubmission(id, reason);
            if (success) {
                refreshSubmissions();
                alert("Dépôt rejeté.");
            } else {
                alert("Erreur lors du rejet.");
            }
        }
    };

    const filteredSubmissions = pendingSubmissions.filter(sub =>
        sub.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.amount.toString().includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Espace Validateurs</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-orange-50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" /> Dépôts en attente de validation
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Veuillez vérifier les preuves de paiement avant validation.</p>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredSubmissions.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent / Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preuve</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSubmissions.map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.agentName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">{submission.amount.toLocaleString()} FC</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {submission.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">Voir le reçu</td>
                                        {/* TODO: Implement receipt modal or viewing logic if data available */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            <button
                                                onClick={() => handleValidateSubmission(submission.id)}
                                                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors"
                                            >
                                                <Check className="h-4 w-4" /> Valider
                                            </button>
                                            <button
                                                onClick={() => handleRejectSubmission(submission.id)}
                                                className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 transition-colors"
                                            >
                                                <X className="h-4 w-4" /> Rejeter
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                            <CheckCircle className="h-12 w-12 text-green-500 mb-4 opacity-50" />
                            <h4 className="text-lg font-medium text-gray-900">Tout est à jour !</h4>
                            <p>Aucun dépôt en attente de validation.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agents;
