import React, { useState, useEffect, useRef } from 'react';
import {
    Users,
    Layers,
    Plus,
    Search,
    ArrowLeft,
    Edit,
    Trash2,
    MessageSquare,
    Send,
    UserPlus,
    ArrowUp,
    ArrowDown,
    Award,
    CheckCircle,
    RefreshCcw,
    X,
    AlertCircle,
    Calendar,
    DollarSign,
    Banknote,
    BarChart3,
    History,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { MockService } from '../../../services/mockStore';
import { User, Group, Transaction, Message } from '../../../types';
import ContributionsTable from '../../../components/ContributionsTable';

const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Group View State
    const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
    const [viewingGroupMembers, setViewingGroupMembers] = useState<User[]>([]);
    const [groupMessages, setGroupMessages] = useState<Message[]>([]);
    const [chatInput, setChatInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Sorting Lists
    const [groupListSortKey, setGroupListSortKey] = useState<keyof Group | null>('createdAt');
    const [groupListSortDirection, setGroupListSortDirection] = useState<'asc' | 'desc'>('desc');

    const [groupMemberSortKey, setGroupMemberSortKey] = useState<keyof User | null>('joinedDate');
    const [groupMemberSortDirection, setGroupMemberSortDirection] = useState<'asc' | 'desc'>('asc');

    const [groupContributionSortKey, setGroupContributionSortKey] = useState<keyof Transaction | null>('date');
    const [groupContributionSortDirection, setGroupContributionSortDirection] = useState<'asc' | 'desc'>('desc');

    // New Group Form
    const [newGroup, setNewGroup] = useState({ name: '', description: '', targetAmount: 0 });

    // Modals
    const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
    const [editingGroupForm, setEditingGroupForm] = useState<Partial<Group>>({ name: '', description: '', targetAmount: 0 });
    const [isConfirmDeleteGroupModalOpen, setIsConfirmDeleteGroupModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [selectedGroupForMember, setSelectedGroupForMember] = useState<Group | null>(null);
    const [selectedMemberId, setSelectedMemberId] = useState<string>('');

    // Pagination
    const [groupMembersCurrentPage, setGroupMembersCurrentPage] = useState(1);
    const [groupMembersPerPage] = useState(5);
    const [groupMemberSearchTerm, setGroupMemberSearchTerm] = useState('');

    // Contribution History handled by shared component


    const refreshGroups = () => {
        setGroups(MockService.getGroups());
        setTransactions(MockService.getTransactions());
    };

    useEffect(() => {
        refreshGroups();
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [groupMessages]);

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (newGroup.name) {
            MockService.addGroup(newGroup);
            refreshGroups();
            setNewGroup({ name: '', description: '', targetAmount: 0 });
            alert('Groupe créé avec succès!');
        }
    };

    const handleViewGroup = (group: Group) => {
        setViewingGroup(group);
        refreshGroupData(group);
        setEditingGroupForm({
            name: group.name,
            description: group.description,
            targetAmount: group.targetAmount
        });
        setGroupMembersCurrentPage(1);
        setGroupMemberSearchTerm('');
        setGroupMemberSortKey('joinedDate');
        setGroupMemberSortDirection('asc');
    };

    const refreshGroupData = (group: Group) => {
        const currentGroupMembers = MockService.getGroupMembers(group.id);
        // Initial sort logic can be applied here if needed, but useEffect handles re-sort usually
        // We will just set them and let the render logic sort them or sort them here immediately
        const sortedMembers = sortMembers(currentGroupMembers, 'joinedDate', 'asc');
        setViewingGroupMembers(sortedMembers);
        setGroupMessages(MockService.getGroupMessages(group.id));
    }

    const sortMembers = (members: User[], key: keyof User | null, direction: 'asc' | 'desc') => {
        return [...members].sort((a, b) => {
            if (!key) return 0;
            const aValue = a[key];
            const bValue = b[key];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
                return direction === 'asc' ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1);
            }
            return 0;
        });
    }

    // Effect to re-sort members when sort keys change
    useEffect(() => {
        if (viewingGroup) {
            const currentGroupMembers = MockService.getGroupMembers(viewingGroup.id);
            const sorted = sortMembers(currentGroupMembers, groupMemberSortKey, groupMemberSortDirection);
            setViewingGroupMembers(sorted);
        }
    }, [groupMemberSortKey, groupMemberSortDirection, viewingGroup]);
    // Dependency on viewingGroup ensures it runs when switching groups too, but we handled that in handleViewGroup. 
    // Ideally, refreshGroupData should just set raw members and we sort in render or memo. But state is fine.

    const handleBackToGroups = () => {
        setViewingGroup(null);
        setViewingGroupMembers([]);
        setGroupMessages([]);
        refreshGroups(); // Refresh main list just in case
    };

    // Group Actions
    const openEditGroupModal = () => {
        if (viewingGroup) {
            setEditingGroupForm({
                name: viewingGroup.name,
                description: viewingGroup.description,
                targetAmount: viewingGroup.targetAmount
            });
            setIsEditGroupModalOpen(true);
        }
    };

    const handleUpdateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (viewingGroup && editingGroupForm.name && editingGroupForm.targetAmount) {
            const success = MockService.updateGroup(viewingGroup.id, editingGroupForm);
            if (success) {
                refreshGroups();
                setViewingGroup({ ...viewingGroup, ...editingGroupForm } as Group);
                setIsEditGroupModalOpen(false);
                alert('Groupe mis à jour avec succès !');
            } else {
                alert("Erreur lors de la mise à jour du groupe.");
            }
        } else {
            alert("Veuillez remplir tous les champs requis.");
        }
    };

    const openConfirmDeleteGroupModal = (group: Group) => {
        setGroupToDelete(group);
        setIsConfirmDeleteGroupModalOpen(true);
    };

    const handleDeleteGroup = () => {
        if (groupToDelete) {
            const success = MockService.deleteGroup(groupToDelete.id);
            if (success) {
                refreshGroups();
                handleBackToGroups();
                setIsConfirmDeleteGroupModalOpen(false);
                setGroupToDelete(null);
                alert('Groupe supprimé avec succès !');
            } else {
                alert("Erreur lors de la suppression du groupe.");
            }
        }
    };

    // Member Actions
    const openAddMemberModal = (group: Group) => {
        setSelectedGroupForMember(group);
        setSelectedMemberId('');
        setIsAddMemberModalOpen(true);
    }

    const handleAddMemberToGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGroupForMember && selectedMemberId) {
            const success = MockService.addMemberToGroup(selectedGroupForMember.id, selectedMemberId);
            if (success) {
                if (viewingGroup && viewingGroup.id === selectedGroupForMember.id) {
                    refreshGroupData(viewingGroup);
                }
                setIsAddMemberModalOpen(false);
                setSelectedGroupForMember(null);
                setSelectedMemberId('');
                alert('Membre ajouté au groupe avec succès !');
            } else {
                alert("Ce client est déjà membre de ce groupe ou une erreur est survenue.");
            }
        } else {
            alert("Veuillez sélectionner un client.");
        }
    }

    const handleRemoveMemberFromGroup = (groupId: string, userId: string, userName: string) => {
        if (window.confirm(`Voulez-vous vraiment retirer ${userName} de ce groupe ?`)) {
            const success = MockService.removeMemberFromGroup(groupId, userId);
            if (success) {
                if (viewingGroup) refreshGroupData(viewingGroup);
                alert(`${userName} a été retiré du groupe.`);
            } else {
                alert("Erreur lors du retrait du membre.");
            }
        }
    };

    const handleToggleTontineBeneficiary = (userId: string, userFullName: string) => {
        if (window.confirm(`Voulez-vous vraiment marquer ${userFullName} comme ayant bénéficié de la tontine ?`)) {
            const success = MockService.toggleTontineBeneficiaryStatus(userId);
            if (success) {
                if (viewingGroup) refreshGroupData(viewingGroup);
                alert(`${userFullName} a été marqué comme bénéficiaire de la tontine.`);
            } else {
                alert("Erreur lors de la mise à jour du statut de bénéficiaire.");
            }
        }
    };

    // Chat
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (viewingGroup && chatInput.trim()) {
            MockService.addMessage(
                viewingGroup.id,
                'Admin', // Hardcoded as strictly Admin context
                chatInput,
                true // isAdmin
            );
            setGroupMessages(MockService.getGroupMessages(viewingGroup.id));
            setChatInput('');
        }
    };

    // Helper for Sorting
    const getSortedGroups = () => {
        if (!groupListSortKey) return groups;
        return [...groups].sort((a, b) => {
            const aValue = a[groupListSortKey];
            const bValue = b[groupListSortKey];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return groupListSortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return groupListSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });
    };

    const handleGroupListSort = (key: keyof Group) => {
        if (groupListSortKey === key) {
            setGroupListSortDirection(groupListSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setGroupListSortKey(key);
            setGroupListSortDirection('asc');
        }
    };

    const handleGroupMemberSort = (key: keyof User) => {
        if (groupMemberSortKey === key) {
            setGroupMemberSortDirection(groupMemberSortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setGroupMemberSortKey(key);
            setGroupMemberSortDirection('asc');
        }
        setGroupMembersCurrentPage(1);
    };

    // Render Logic
    const getPaginatedAndFilteredGroupMembers = () => {
        const filtered = viewingGroupMembers.filter(member =>
            member.fullName.toLowerCase().includes(groupMemberSearchTerm.toLowerCase()) ||
            member.id.toLowerCase().includes(groupMemberSearchTerm.toLowerCase())
        );

        const indexOfLastItem = groupMembersCurrentPage * groupMembersPerPage;
        const indexOfFirstItem = indexOfLastItem - groupMembersPerPage;
        const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(filtered.length / groupMembersPerPage);

        return { currentItems, totalPages, filteredLength: filtered.length };
    };


    if (viewingGroup) {
        // Logic for Next/Last Beneficiary
        const nonBenefitedMembers = [...viewingGroupMembers]
            .filter(member => !member.hasBenefitedFromTontine)
            .sort((a, b) => a.joinedDate.localeCompare(b.joinedDate));

        const nextBeneficiary = nonBenefitedMembers.length > 0 ? nonBenefitedMembers[0] : null;
        const secondBeneficiary = nonBenefitedMembers.length > 1 ? nonBenefitedMembers[1] : null;

        const { currentItems: paginatedGroupMembers, totalPages: totalGroupMembersPages, filteredLength: filteredGroupMembersLength } = getPaginatedAndFilteredGroupMembers();

        // Calculate contribution statistics
        const groupMemberDepositTransactions = transactions
            .filter(tx =>
                tx.type === 'deposit' &&
                viewingGroupMembers.some(member => member.id === tx.userId)
            );

        const totalGroupDeposits = groupMemberDepositTransactions
            .filter(tx => tx.status === 'success')
            .reduce((sum, tx) => sum + tx.amount, 0);

        return (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={handleBackToGroups}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 flex-1">{viewingGroup.name}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={openEditGroupModal}
                            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors shadow-sm"
                        >
                            <Edit className="h-4 w-4" /> Modifier
                        </button>
                        <button
                            onClick={() => openConfirmDeleteGroupModal(viewingGroup)}
                            className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors shadow-sm"
                        >
                            <Trash2 className="h-4 w-4" /> Supprimer
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="h-5 w-5 text-gray-700" />
                            <span className="text-gray-500 text-sm font-medium">Date de création</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{viewingGroup.createdAt}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="h-5 w-5 text-gray-700" />
                            <span className="text-gray-500 text-sm font-medium">Membres</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{viewingGroup.memberCount} Participants</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="h-5 w-5 text-gray-700" />
                            <span className="text-gray-500 text-sm font-medium">Objectif Cible</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{viewingGroup.targetAmount.toLocaleString()} FC</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{viewingGroup.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2 rounded-t-xl">
                            <MessageSquare className="h-5 w-5 text-gray-700" />
                            <h3 className="font-semibold text-gray-800">Discussion de Groupe</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {groupMessages.length > 0 ? (
                                groupMessages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${msg.isAdmin
                                            ? 'bg-gray-800 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="text-xs font-semibold text-gray-600">{msg.senderName}</span>
                                            <span className="text-[10px] text-gray-400">• {msg.timestamp.split(' ')[1]}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                                    <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
                                    <p>Aucun message pour le moment</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 border-t border-gray-100 bg-white rounded-b-xl">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Écrire un message..."
                                    className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim()}
                                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Users className="h-5 w-5" /> Membres du groupe ({filteredGroupMembersLength})
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un membre..."
                                        value={groupMemberSearchTerm}
                                        onChange={(e) => {
                                            setGroupMemberSearchTerm(e.target.value);
                                            setGroupMembersCurrentPage(1);
                                        }}
                                        className="w-full sm:w-auto pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-gray-500"
                                    />
                                </div>
                                <button
                                    onClick={() => openAddMemberModal(viewingGroup)}
                                    className="flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Ajouter un membre
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGroupMemberSort('fullName')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Nom du Client
                                                {groupMemberSortKey === 'fullName' && (
                                                    groupMemberSortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGroupMemberSort('joinedDate')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Date d'ajout
                                                {groupMemberSortKey === 'joinedDate' && (
                                                    groupMemberSortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        {/* Colonne 'Contribution Actuelle' supprimée */}
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleGroupMemberSort('hasBenefitedFromTontine')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Statut Tontine
                                                {groupMemberSortKey === 'hasBenefitedFromTontine' && (
                                                    groupMemberSortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedGroupMembers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        {user.fullName}
                                                        {user.hasBenefitedFromTontine && <Award className="h-4 w-4 text-yellow-500 ml-1 inline" title="A bénéficié de la tontine" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinedDate}</td>
                                            {/* Colonne 'Contribution Actuelle' supprimée */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {user.hasBenefitedFromTontine ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="h-3 w-3" /> Bénéficié
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <AlertCircle className="h-3 w-3" /> En attente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleToggleTontineBeneficiary(user.id, user.fullName)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs sm:text-sm font-medium ${user.hasBenefitedFromTontine
                                                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                        }`}
                                                    title={user.hasBenefitedFromTontine ? "Marquer comme en attente" : "Marquer comme bénéficiaire"}
                                                >
                                                    {user.hasBenefitedFromTontine ? <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4" /> : <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveMemberFromGroup(viewingGroup.id, user.id, user.fullName)}
                                                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs sm:text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
                                                    title="Retirer le membre"
                                                >
                                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        {filteredGroupMembersLength > 0 && (
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-sm text-gray-700">Page {groupMembersCurrentPage} / {totalGroupMembersPages}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setGroupMembersCurrentPage(p => Math.max(1, p - 1))} disabled={groupMembersCurrentPage === 1} className="p-1 border rounded bg-white disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
                                    <button onClick={() => setGroupMembersCurrentPage(p => Math.min(totalGroupMembersPages, p + 1))} disabled={groupMembersCurrentPage === totalGroupMembersPages} className="p-1 border rounded bg-white disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tontine Cycle Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-700" /> Historique du Cycle de Tontine
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-blue-600 font-medium mb-1">Prochain Bénéficiaire</p>
                            {nextBeneficiary ? (
                                <p className="text-xl font-bold text-blue-800">{nextBeneficiary.fullName}</p>
                            ) : (
                                <p className="text-lg text-gray-600">Tous les membres ont bénéficié.</p>
                            )}
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-purple-600 font-medium mb-1">Deuxième Bénéficiaire</p>
                            {secondBeneficiary ? (
                                <p className="text-xl font-bold text-purple-800">{secondBeneficiary.fullName}</p>
                            ) : (
                                <p className="text-lg text-gray-600">Pas de deuxième bénéficiaire en attente.</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 font-medium mb-1">Ordre des Bénéficiaires (basé sur la date d'ajout)</p>
                        {viewingGroupMembers.length > 0 ? (
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                {viewingGroupMembers
                                    .sort((a, b) => a.joinedDate.localeCompare(b.joinedDate))
                                    .map((member, index) => (
                                        <li key={member.id} className="flex items-center gap-2">
                                            <span className="font-medium">{index + 1}. {member.fullName}</span>
                                            {member.hasBenefitedFromTontine && <CheckCircle className="h-3 w-3 text-green-500" />}
                                        </li>
                                    ))}
                            </ol>
                        ) : (
                            <p className="text-gray-600">Aucun membre dans ce groupe pour définir l'ordre.</p>
                        )}
                    </div>
                </div>

                    <ContributionsTable transactions={groupMemberDepositTransactions} title="Historique des Contributions Journalières" showStats />


                {/* Edit Group Modal */}
                {
                    isEditGroupModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 p-6">
                                <h3 className="text-lg font-bold mb-4">Modifier le Groupe</h3>
                                <form onSubmit={handleUpdateGroup} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du groupe</label>
                                        <input className="w-full p-2 border rounded" value={editingGroupForm.name} onChange={e => setEditingGroupForm({ ...editingGroupForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cible (FC)</label>
                                        <input className="w-full p-2 border rounded" type="number" value={editingGroupForm.targetAmount} onChange={e => setEditingGroupForm({ ...editingGroupForm, targetAmount: parseFloat(e.target.value) })} />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsEditGroupModalOpen(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Add Member Modal */}
                {
                    isAddMemberModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 p-6">
                                <h3 className="text-lg font-bold mb-4">Ajouter un membre</h3>
                                <form onSubmit={handleAddMemberToGroup} className="space-y-4">
                                    <input
                                        className="w-full p-2 border rounded"
                                        placeholder="ID ou Nom du client..."
                                        value={selectedMemberId} // Note: simplified to just ID input for now, ideally a search select
                                        onChange={e => setSelectedMemberId(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500">Entrez l'ID du client à ajouter.</p>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="px-4 py-2 text-gray-600">Annuler</button>
                                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded">Ajouter</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div >
        );
    }

    // List View
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Groupes Tontine</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Créer un nouveau groupe
                </h3>
                <form onSubmit={handleCreateGroup} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Groupe</label>
                        <input
                            type="text"
                            value={newGroup.name}
                            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant Cible (FC)</label>
                        <input
                            type="number"
                            value={newGroup.targetAmount || ''}
                            onChange={(e) => setNewGroup({ ...newGroup, targetAmount: parseFloat(e.target.value) })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={newGroup.description}
                            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>
                    <button type="submit" className="bg-gray-800 text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                        Créer Groupe
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSortedGroups().map((group) => (
                    <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group flex flex-col items-center text-center cursor-pointer" onClick={() => handleViewGroup(group)}>
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 mb-4 group-hover:bg-gray-200 transition-colors">
                            <Layers className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">{group.description || "Aucune description"}</p>

                        <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{group.memberCount}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Membres</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-800">{group.targetAmount.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Cible</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default Groups;
