import React, { useState, useEffect } from 'react';
import {
    FileCheck,
    Check,
    X,
    Search,
    Eye
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { KycRequest } from '../../../types';

const KYC: React.FC = () => {
    const [kycRequests, setKycRequests] = useState<KycRequest[]>([]);
    const [kycSearchTerm, setKycSearchTerm] = useState('');
    const [kycFilterStatus, setKycFilterStatus] = useState('all');

    // Modal for viewing document
    const [viewingRequest, setViewingRequest] = useState<KycRequest | null>(null);

    const refreshKyc = () => {
        setKycRequests(MockService.getKycRequests());
    };

    useEffect(() => {
        refreshKyc();
    }, []);

    const handleApproveKyc = (id: string) => {
        if (window.confirm("Approuver ce dossier KYC ?")) {
            const success = MockService.approveKycRequest(id);
            if (success) {
                refreshKyc();
                setViewingRequest(null);
                alert("Dossier approuvé.");
            }
        }
    };

    const handleRejectKyc = (id: string) => {
        const reason = prompt("Motif du rejet :");
        if (reason) {
            const success = MockService.rejectKycRequest(id, reason);
            if (success) {
                refreshKyc();
                setViewingRequest(null);
                alert("Dossier rejeté.");
            }
        }
    };

    const filteredKyc = kycRequests.filter(req => {
        const matchesSearch = req.fullName.toLowerCase().includes(kycSearchTerm.toLowerCase()) ||
            req.userId.toLowerCase().includes(kycSearchTerm.toLowerCase());
        const matchesStatus = kycFilterStatus === 'all' || req.status === kycFilterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Vérifications KYC</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FileCheck className="h-5 w-5 text-gray-600" /> Dossiers soumis
                        </h3>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-auto">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Chercher un utilisateur..."
                                value={kycSearchTerm}
                                onChange={(e) => setKycSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        <select
                            value={kycFilterStatus}
                            onChange={(e) => setKycFilterStatus(e.target.value)}
                            className="p-2 border rounded-lg text-sm focus:outline-none bg-white"
                        >
                            <option value="all">Tous</option>
                            <option value="pending">En attente</option>
                            <option value="approved">Approuvé</option>
                            <option value="rejected">Rejeté</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredKyc.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Document</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredKyc.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{req.documentType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {req.status === 'approved' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approuvé</span>
                                            ) : req.status === 'rejected' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejeté</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">En attente</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            <button
                                                onClick={() => setViewingRequest(req)}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="Voir le document"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveKyc(req.id)}
                                                        className="text-green-600 hover:text-green-800"
                                                        title="Approuver"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectKyc(req.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Rejeter"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            Aucune demande trouvée.
                        </div>
                    )}
                </div>
            </div>

            {/* Document Viewer Modal */}
            {viewingRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Vérification Document</h3>
                                <p className="text-sm text-gray-500">{viewingRequest.fullName} - {viewingRequest.documentType}</p>
                            </div>
                            <button onClick={() => setViewingRequest(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-200 p-4 flex items-center justify-center overflow-auto">
                            <div className="bg-white p-2 shadow-lg max-w-full">
                                {/* Mock Image Placeholder */}
                                <div className="w-full h-96 bg-gray-300 flex items-center justify-center text-gray-500">
                                    [Image du Document Simulé]
                                </div>
                            </div>
                        </div>
                        {viewingRequest.status === 'pending' && (
                            <div className="p-4 border-t border-gray-100 bg-white rounded-b-xl flex justify-end gap-3">
                                <button
                                    onClick={() => handleRejectKyc(viewingRequest.id)}
                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                                >
                                    Rejeter
                                </button>
                                <button
                                    onClick={() => handleApproveKyc(viewingRequest.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
                                >
                                    Approuver le document
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYC;
