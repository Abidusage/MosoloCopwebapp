import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    CreditCard,
    PlusCircle,
    KeyRound,
    Eye,
    ChevronLeft,
    ChevronRight,
    X,
    History
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { User, Transaction } from '../../../types';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Form States
    const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', depositAmount: 0 });

    // Modals
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [selectedUserForDeposit, setSelectedUserForDeposit] = useState<User | null>(null);
    const [depositAmount, setDepositAmount] = useState<string>('');
    const [depositNote, setDepositNote] = useState<string>('');
    const [depositPaymentMethod, setDepositPaymentMethod] = useState<string>('Orange Money');

    const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
    const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
    const [selectedUserTransactions, setSelectedUserTransactions] = useState<Transaction[]>([]);

    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<User | null>(null);
    const [newPasswordInput, setNewPasswordInput] = useState('');

    const refreshUsers = () => {
        setUsers(MockService.getUsers());
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    // Handlers
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUser.username && newUser.fullName) {
            MockService.addUser(newUser);
            refreshUsers();
            setNewUser({ username: '', password: '', fullName: '', depositAmount: 0 });
            alert('Client créé avec succès!');
        }
    };

    const toggleUserLoanEligibility = (user: User) => {
        if (window.confirm(`Voulez-vous ${user.loanEligible ? 'retirer' : 'accorder'} l'éligibilité au prêt pour ${user.fullName} ?`)) {
            MockService.toggleLoanEligibility(user.id);
            refreshUsers();
        }
    };

    const handleToggleUserStatus = (user: User) => {
        const newStatus = user.status === 'active' ? 'suspended' : 'active';
        if (window.confirm(`Voulez-vous vraiment ${newStatus === 'suspended' ? 'suspendre' : 'activer'} le compte de ${user.fullName} ?`)) {
            const success = MockService.toggleUserStatus(user.id);
            if (success) {
                refreshUsers();
                alert(`Statut du client ${user.fullName} mis à jour à "${newStatus}".`);
            } else {
                alert("Erreur lors de la mise à jour du statut du client.");
            }
        }
    };

    // Deposit Logic
    const openDepositModal = (user: User) => {
        setSelectedUserForDeposit(user);
        setDepositAmount('');
        setDepositNote('');
        setDepositPaymentMethod('Orange Money');
        setIsDepositModalOpen(true);
    };

    const handleSubmitDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = Number(depositAmount);
        if (selectedUserForDeposit && amount > 0) {
            const success = MockService.makeDeposit(selectedUserForDeposit.id, amount, depositNote, depositPaymentMethod);
            if (success) {
                refreshUsers();
                setIsDepositModalOpen(false);
                setSelectedUserForDeposit(null);
                setDepositAmount('');
                setDepositNote('');
                setDepositPaymentMethod('Orange Money');
                alert(`Dépôt de ${amount.toLocaleString()} FC effectué pour ${selectedUserForDeposit.fullName}`);
            }
        } else {
            alert("Veuillez entrer un montant valide.");
        }
    };

    // Password Reset Logic
    const openResetPasswordModal = (user: User) => {
        setSelectedUserForPasswordReset(user);
        setNewPasswordInput('');
        setIsResetPasswordModalOpen(true);
    };

    const handleResetPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUserForPasswordReset && newPasswordInput.trim()) {
            const success = MockService.resetUserPassword(selectedUserForPasswordReset.id, newPasswordInput);
            if (success) {
                setIsResetPasswordModalOpen(false);
                setSelectedUserForPasswordReset(null);
                setNewPasswordInput('');
                alert(`Le mot de passe de ${selectedUserForPasswordReset.fullName} a été réinitialisé avec succès !`);
            } else {
                alert("Erreur lors de la réinitialisation du mot de passe.");
            }
        }
    };

    // User Detail Logic
    const openUserDetailModal = (user: User) => {
        setSelectedUserForDetail(user);
        setSelectedUserTransactions(MockService.getUserTransactions(user.id));
        setIsUserDetailModalOpen(true);
    };

    // Pagination
    const getPaginatedUsers = () => {
        const filtered = users.filter(user =>
            user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
            user.id.toLowerCase().includes(userSearchTerm.toLowerCase())
        );

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filtered.length / itemsPerPage);

        return { filtered, currentItems, totalPages };
    };

    const { filtered: filteredUsers, currentItems: currentUsers, totalPages: totalUserPages } = getPaginatedUsers();

    const handleUserPageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalUserPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Clients</h2>

            {/* Create User Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Inscrire un nouveau client
                </h3>
                <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nom complet"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                        value={newUser.fullName}
                        onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur (Pseudo)"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                        value={newUser.username}
                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Dépôt initial (FC)"
                        className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                        value={newUser.depositAmount || ''}
                        onChange={e => setNewUser({ ...newUser, depositAmount: Number(e.target.value) })}
                    />
                    <button type="submit" className="md:col-span-2 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors w-full">
                        Enregistrer le client
                    </button>
                </form>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-lg font-semibold text-gray-800">Liste des clients</h3>
                    <div className="relative w-full sm:w-auto">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un client..."
                            value={userSearchTerm}
                            onChange={(e) => {
                                setUserSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full sm:w-auto pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant (ID)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde (FC)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">{user.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="h-3 w-3" /> Actif
                                                </span>
                                            ) : user.status === 'suspended' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    <XCircle className="h-3 w-3" /> Suspendu
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    <AlertCircle className="h-3 w-3" /> Inconnu
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                {user.joinedDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-bold">{user.depositAmount.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                            <button
                                                onClick={() => toggleUserLoanEligibility(user)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs sm:text-sm font-medium ${user.loanEligible
                                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'
                                                    }`}
                                                title={user.loanEligible ? "Désactiver le prêt" : "Rendre éligible au prêt"}
                                            >
                                                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                                                {user.loanEligible ? 'Eligible' : 'Crédit'}
                                            </button>

                                            <button
                                                onClick={() => openDepositModal(user)}
                                                className="inline-flex items-center gap-1.5 bg-gray-800 text-white px-3 py-1.5 rounded-md hover:bg-gray-900 transition-colors shadow-sm text-xs sm:text-sm font-medium"
                                                title="Faire un dépôt"
                                            >
                                                <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" /> Dépôt
                                            </button>
                                            <button
                                                onClick={() => handleToggleUserStatus(user)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs sm:text-sm font-medium ${user.status === 'active'
                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                    }`}
                                                title={user.status === 'active' ? 'Suspendre le client' : 'Activer le client'}
                                            >
                                                {user.status === 'active' ? <XCircle className="h-3 w-3 sm:h-4 sm:w-4" /> : <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                                                {user.status === 'active' ? 'Suspendre' : 'Activer'}
                                            </button>
                                            <button
                                                onClick={() => openResetPasswordModal(user)}
                                                className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-200 transition-colors shadow-sm text-xs sm:text-sm font-medium border border-orange-200"
                                                title="Réinitialiser le mot de passe"
                                            >
                                                <KeyRound className="h-3 w-3 sm:h-4 sm:w-4" /> Reset MDP
                                            </button>
                                            <button
                                                onClick={() => openUserDetailModal(user)}
                                                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm text-xs sm:text-sm font-medium border border-gray-200"
                                                title="Voir les détails"
                                            >
                                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> Voir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                        Aucun client trouvé pour cette recherche.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> sur <span className="font-medium">{filteredUsers.length}</span> résultats
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handleUserPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <span className="sr-only">Précédent</span>
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => handleUserPageChange(number)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                                                ? 'z-10 bg-gray-100 border-gray-500 text-gray-700'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handleUserPageChange(currentPage + 1)}
                                        disabled={currentPage === totalUserPages}
                                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalUserPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <span className="sr-only">Suivant</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && selectedUserForDeposit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Effectuer un Dépôt</h3>
                            <button onClick={() => setIsDepositModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitDeposit} className="p-6 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {selectedUserForDeposit.fullName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Bénéficiaire</p>
                                    <p className="font-bold text-gray-800">{selectedUserForDeposit.fullName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (FC)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none font-bold text-lg"
                                        placeholder="0"
                                        required
                                        autoFocus
                                    />
                                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">FC</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moyen de Paiement</label>
                                <select
                                    value={depositPaymentMethod}
                                    onChange={(e) => setDepositPaymentMethod(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                                >
                                    <option value="Orange Money">Orange Money</option>
                                    <option value="MTN Mobile Money">MTN Mobile Money</option>
                                    <option value="Espèces">Espèces (Cash)</option>
                                    <option value="Virement Bancaire">Virement Bancaire</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optionnel)</label>
                                <textarea
                                    value={depositNote}
                                    onChange={(e) => setDepositNote(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                                    placeholder="Ex: Dépôt mensuel tontine"
                                    rows={2}
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-green-600 text-white py-3.5 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                    <CheckCircle className="h-5 w-5" /> Confirmer le Dépôt
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {isUserDetailModalOpen && selectedUserForDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-none">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                                    {selectedUserForDetail.fullName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedUserForDetail.fullName}</h3>
                                    <p className="text-sm text-gray-500">ID: {selectedUserForDetail.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsUserDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Solde Actuel</p>
                                    <p className="text-2xl font-bold text-gray-900">{selectedUserForDetail.depositAmount.toLocaleString()} FC</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Date d'inscription</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedUserForDetail.joinedDate}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Nom d'utilisateur</p>
                                    <p className="text-lg font-semibold text-gray-800">@{selectedUserForDetail.username}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 mb-1">Statut</p>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase mt-1 ${selectedUserForDetail.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedUserForDetail.status === 'active' ? 'Actif' : 'Suspendu'}
                                    </span>
                                </div>
                            </div>

                            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <History className="h-5 w-5 text-gray-500" /> Historique des Transactions
                            </h4>

                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                {selectedUserTransactions.length > 0 ? (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedUserTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{tx.date}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap capitalize">
                                                        {tx.type === 'loan_eligibility' ? 'Éligibilité Crédit' : tx.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                                                    </td>
                                                    <td className={`px-4 py-3 text-sm font-bold text-right whitespace-nowrap ${tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'}`}>
                                                        {tx.amount > 0 ? `${tx.amount.toLocaleString()} FC` : '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {tx.status === 'success' ? 'Succès' : 'Échec'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        Aucune transaction trouvée pour ce client.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetPasswordModalOpen && selectedUserForPasswordReset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Réinitialiser Mot de Passe</h3>
                            <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleResetPasswordSubmit} className="p-6 space-y-4">
                            <div className="bg-orange-50 p-4 rounded-lg flex items-center gap-3">
                                <KeyRound className="h-6 w-6 text-orange-600" />
                                <div>
                                    <p className="text-sm text-gray-500">Compte concerné</p>
                                    <p className="font-bold text-gray-800">{selectedUserForPasswordReset.fullName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                <input
                                    type="text" // Visible for admin convenience as requested implies usually
                                    value={newPasswordInput}
                                    onChange={(e) => setNewPasswordInput(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                                    placeholder="Entrer le nouveau mot de passe"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                                    Confirmer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Users;
