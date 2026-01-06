import React, { useState, useEffect } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Search,
    Check,
    X,
    UserPlus,
    Briefcase,
    Plus,
    FileText,
    Activity,
    MapPin,
    Smartphone,
    Mail,
    Filter
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { DepositSubmission, Agent, FieldSubmission } from '../../../types';

const Agents: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'validations' | 'management'>('management');
    const [pendingSubmissions, setPendingSubmissions] = useState<DepositSubmission[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Add Agent Modal State
    const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false);
    const [newAgentForm, setNewAgentForm] = useState({ fullName: '', username: '', email: '', phone: '', zone: '', password: '' });

    // Report Modal State
    const [viewingAgentReports, setViewingAgentReports] = useState<Agent | null>(null);
    const [agentSubmissions, setAgentSubmissions] = useState<FieldSubmission[]>([]);

    const refreshData = () => {
        setPendingSubmissions(MockService.getPendingSubmissions());
        setAgents(MockService.getAgents());
        if (viewingAgentReports) {
            setAgentSubmissions(MockService.getAgentSubmissions(viewingAgentReports.id));
        }
    };

    useEffect(() => {
        refreshData();
    }, [viewingAgentReports]);

    const handleAddAgent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newAgentForm.fullName && newAgentForm.username && newAgentForm.email && newAgentForm.phone && newAgentForm.zone && newAgentForm.password) {
            MockService.addAgent(newAgentForm);
            refreshData();
            setNewAgentForm({ fullName: '', username: '', email: '', phone: '', zone: '', password: '' });
            setIsAddAgentModalOpen(false);
            alert('Agent ajouté avec succès !');
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    };

    const handleViewReport = (agent: Agent) => {
        setViewingAgentReports(agent);
        setAgentSubmissions(MockService.getAgentSubmissions(agent.id));
    };

    const toggleAgentStatus = (agentId: string) => {
        if (window.confirm("Changer le statut de cet agent ?")) {
            MockService.toggleAgentStatus(agentId);
            refreshData();
        }
    };

    const filteredSubmissions = pendingSubmissions.filter(sub =>
        sub.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.amount.toString().includes(searchTerm)
    );

    const filteredAgents = agents.filter(agent =>
        agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Espace Agents & Validateurs</h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
                    <button
                        onClick={() => { setActiveTab('management'); setSearchTerm(''); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'management' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Gestion des Agents
                    </button>
                    <button
                        onClick={() => { setActiveTab('validations'); setSearchTerm(''); }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'validations' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Validations ({pendingSubmissions.length})
                    </button>
                </div>
            </div>

            {activeTab === 'management' ? (
                <div className="space-y-6">
                    {/* Agents Management Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="relative w-full sm:w-64">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Chercher un agent..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-gray-500"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddAgentModalOpen(true)}
                            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-sm font-medium"
                        >
                            <UserPlus className="h-4 w-4" /> Ajouter un Agent
                        </button>
                    </div>

                    {/* Agents Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rapports</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAgents.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold border-2 border-white shadow-sm">
                                                        {agent.fullName.charAt(0)}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-bold text-gray-900">{agent.fullName}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{agent.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-400" /> {agent.zone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5"><Smartphone className="h-3 w-3 text-gray-400" /> {agent.phone}</div>
                                                    <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 text-gray-400" /> {agent.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleViewReport(agent)}
                                                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                                >
                                                    <FileText className="h-4 w-4" /> Rapport Journalier
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {agent.status === 'active' ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Actif</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Inactif</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => toggleAgentStatus(agent.id)}
                                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${agent.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                                >
                                                    {agent.status === 'active' ? 'Suspendre' : 'Activer'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
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
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Valider ce dépôt ?")) {
                                                            MockService.validateSubmission(submission.id);
                                                            refreshData();
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-200 transition-colors"
                                                >
                                                    <Check className="h-4 w-4" /> Valider
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const r = prompt("Raison du rejet :");
                                                        if (r) {
                                                            MockService.rejectSubmission(submission.id, r);
                                                            refreshData();
                                                        }
                                                    }}
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
            )}

            {/* Add Agent Modal */}
            {isAddAgentModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200 overflow-hidden">
                        <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <UserPlus className="h-6 w-6" /> Nouvel Agent
                            </h3>
                            <button onClick={() => setIsAddAgentModalOpen(false)} className="hover:rotate-90 transition-transform">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAgent} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nom Complet</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAgentForm.fullName}
                                        onChange={e => setNewAgentForm({ ...newAgentForm, fullName: e.target.value })}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAgentForm.username}
                                        onChange={e => setNewAgentForm({ ...newAgentForm, username: e.target.value })}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                                    <input
                                        type="tel"
                                        required
                                        value={newAgentForm.phone}
                                        onChange={e => setNewAgentForm({ ...newAgentForm, phone: e.target.value })}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Zone</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAgentForm.zone}
                                        onChange={e => setNewAgentForm({ ...newAgentForm, zone: e.target.value })}
                                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newAgentForm.email}
                                    onChange={e => setNewAgentForm({ ...newAgentForm, email: e.target.value })}
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                                <input
                                    type="password"
                                    required
                                    value={newAgentForm.password}
                                    onChange={e => setNewAgentForm({ ...newAgentForm, password: e.target.value })}
                                    className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200">
                                    Enregistrer l'agent
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Agent Daily Report Modal */}
            {viewingAgentReports && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Rapport d'activité : {viewingAgentReports.fullName}</h3>
                                <p className="text-sm text-gray-500">Historique des soumissions terrain</p>
                            </div>
                            <button onClick={() => setViewingAgentReports(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {agentSubmissions.length > 0 ? (
                                <div className="space-y-4">
                                    {agentSubmissions.map((sub) => (
                                        <div key={sub.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${sub.type === 'new_registration' ? 'bg-blue-100 text-blue-700' : sub.type === 'daily_collection' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                                                            {sub.type === 'new_registration' ? 'Inscription' : sub.type === 'daily_collection' ? 'Collecte' : 'Demande Prêt'}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{sub.submissionDate}</span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-gray-900 mt-1">{sub.clientName}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> {sub.clientPhone}</span>
                                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {sub.location}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {sub.amount && <div className="text-xl font-bold text-gray-900">{sub.amount.toLocaleString()} FC</div>}
                                                    <div className={`text-xs font-bold mt-1 ${sub.status === 'approved' ? 'text-green-600' : sub.status === 'pending' ? 'text-orange-600' : 'text-red-600'}`}>
                                                        {sub.status.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                            {sub.notes && (
                                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic border-l-4 border-gray-200">
                                                    "{sub.notes}"
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-500">
                                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Aucune activité enregistrée pour cet agent.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end">
                            <button
                                onClick={() => setViewingAgentReports(null)}
                                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Fermer le rapport
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agents;
