import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  UserCircle, 
  LogOut, 
  Plus, 
  DollarSign, 
  Search,
  Wallet,
  Settings,
  Menu,
  X,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlusCircle,
  FileText,
  UserPlus,
  Eye,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Send,
  Mail,
  Phone,
  MapPin,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  CreditCard,
  Shield,
  Save,
  Globe,
  Lock,
  Bell,
  Briefcase,
  FileCheck,
  Filter,
  RefreshCcw,
  Zap,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  Image,
  FileWarning,
  KeyRound
} from 'lucide-react';
import { MockService } from '../../services/mockStore';
import { User, Group, AdminProfile, Transaction, DashboardView, Message, SystemSettings, Agent, FieldSubmission, KYCDocument } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  
  // Agent / Partners State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [viewingAgent, setViewingAgent] = useState<Agent | null>(null);
  const [agentSubmissions, setAgentSubmissions] = useState<FieldSubmission[]>([]);
  const [isAddAgentModalOpen, setIsAddAgentModalOpen] = useState(false); // New state for Add Agent modal
  const [newAgentForm, setNewAgentForm] = useState({ fullName: '', email: '', phone: '', zone: '' }); // New state for new agent form
  const [isAgentResetPasswordModalOpen, setIsAgentResetPasswordModalOpen] = useState(false);
  const [selectedAgentForPasswordReset, setSelectedAgentForPasswordReset] = useState<Agent | null>(null);
  const [newAgentPasswordInput, setNewAgentPasswordInput] = useState('');


  // Group View State
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  const [viewingGroupMembers, setViewingGroupMembers] = useState<User[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form States
  const [newUser, setNewUser] = useState({ username: '', password: '', fullName: '', depositAmount: 0 });
  const [newGroup, setNewGroup] = useState({ name: '', description: '', targetAmount: 0 });
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<AdminProfile>>({ 
    fullName: '', 
    email: '', 
    phoneNumber: '', 
    address: '', 
    profilePictureUrl: '' 
  });

  // Deposit Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedUserForDeposit, setSelectedUserForDeposit] = useState<User | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [depositNote, setDepositNote] = useState<string>('');

  // Add Member to Group Modal State
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedGroupForMember, setSelectedGroupForMember] = useState<Group | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // User Details Modal State
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState<Transaction[]>([]);

  // Statistics State
  const [stats, setStats] = useState<any>(null);
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);

  // Filter States
  const [transactionFilterType, setTransactionFilterType] = useState<string>('all');
  const [transactionFilterStatus, setTransactionFilterStatus] = useState<string>('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  
  // Clients Pagination & Search State
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // KYC State
  const [kycSubmissions, setKycSubmissions] = useState<User[]>([]);
  const [isKYCDetailModalOpen, setIsKYCDetailModalOpen] = useState(false);
  const [selectedUserForKYC, setSelectedUserForKYC] = useState<User | null>(null);
  const [selectedUserKYCDocuments, setSelectedUserKYCDocuments] = useState<KYCDocument[]>([]);
  const [kycRejectionReason, setKycRejectionReason] = useState('');
  const [kycFilterStatus, setKycFilterStatus] = useState<string>('all');
  const [kycSearchTerm, setKycSearchTerm] = useState('');

  // Password Reset State
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Admin Deposits for Profile View
  const [adminDeposits, setAdminDeposits] = useState<Transaction[]>([]);


  useEffect(() => {
    // Load initial data
    const currentAdminProfile = MockService.getAdminProfile();
    setUsers(MockService.getUsers());
    setGroups(MockService.getGroups());
    setTransactions(MockService.getTransactions());
    setAdminProfile(currentAdminProfile);
    setSettings(MockService.getSystemSettings());
    setAgents(MockService.getAgents());
    setProfileForm({
      fullName: currentAdminProfile.fullName,
      email: currentAdminProfile.email,
      phoneNumber: currentAdminProfile.phoneNumber,
      address: currentAdminProfile.address,
      profilePictureUrl: currentAdminProfile.profilePictureUrl
    });
    setStats(MockService.getGlobalStats());
    setPendingSubmissionsCount(MockService.getPendingSubmissionsCount());
    setKycSubmissions(MockService.getKYCSubmissions());
    setAdminDeposits(MockService.getAdminDeposits()); // Fetch admin deposits
  }, []);

  useEffect(() => {
    // Refresh stats when transactions or users change
    if(currentView === 'statistics' || currentView === 'overview') {
      setStats(MockService.getGlobalStats());
      setPendingSubmissionsCount(MockService.getPendingSubmissionsCount());
    }
    if (currentView === 'kyc') {
      setKycSubmissions(MockService.getKYCSubmissions());
    }
    if (currentView === 'profile') { // Refresh admin deposits when viewing profile
      setAdminDeposits(MockService.getAdminDeposits());
    }
    if (currentView === 'agents') { // Refresh agents list when viewing agents
      setAgents(MockService.getAgents());
    }
  }, [currentView, transactions, users, agents]); // Added agents to dependency array

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, currentView]);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(newUser.username && newUser.fullName) {
      const created = MockService.addUser(newUser);
      setUsers([...users, created]);
      setNewUser({ username: '', password: '', fullName: '', depositAmount: 0 });
      alert('Client créé avec succès!');
    }
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if(newGroup.name) {
      const created = MockService.addGroup(newGroup);
      setGroups([...groups, created]);
      setNewGroup({ name: '', description: '', targetAmount: 0 });
      alert('Groupe créé avec succès!');
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = MockService.updateAdminProfile(profileForm);
    setAdminProfile(updated);
    setIsEditProfile(false);
    alert('Profil mis à jour!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      const updated = MockService.updateSystemSettings(settings);
      setSettings(updated);
      alert('Paramètres du système mis à jour avec succès !');
    }
  };

  const handleNavClick = (view: DashboardView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    // Reset specific view states
    setViewingGroup(null);
    setViewingAgent(null);
    // Reset pagination when switching views
    setCurrentPage(1);
    setUserSearchTerm('');
    setKycSearchTerm('');
    setKycFilterStatus('all');
  };

  const openDepositModal = (user: User) => {
    setSelectedUserForDeposit(user);
    setDepositAmount('');
    setDepositNote('');
    setIsDepositModalOpen(true);
  };

  const handleSubmitDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (selectedUserForDeposit && amount > 0) {
      const success = MockService.makeDeposit(selectedUserForDeposit.id, amount, depositNote);
      if (success) {
        // Refresh Data
        setUsers(MockService.getUsers());
        setTransactions(MockService.getTransactions()); // Refresh transaction history
        setAdminDeposits(MockService.getAdminDeposits()); // Refresh admin deposits
        setIsDepositModalOpen(false);
        setSelectedUserForDeposit(null);
        setDepositAmount('');
        setDepositNote('');
        alert(`Dépôt de ${amount.toLocaleString()} FCFA effectué pour ${selectedUserForDeposit.fullName}`);
      }
    } else {
      alert("Veuillez entrer un montant valide.");
    }
  };

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
        setGroups(MockService.getGroups()); // Refresh groups to see updated count
        
        // If we are currently viewing this group, refresh the members list too
        if (viewingGroup && viewingGroup.id === selectedGroupForMember.id) {
           setViewingGroupMembers(MockService.getGroupMembers(selectedGroupForMember.id));
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

  // Handle viewing group details
  const handleViewGroup = (group: Group) => {
    setViewingGroup(group);
    setViewingGroupMembers(MockService.getGroupMembers(group.id));
    setGroupMessages(MockService.getGroupMessages(group.id));
  };

  const handleBackToGroups = () => {
    setViewingGroup(null);
    setViewingGroupMembers([]);
    setGroupMessages([]);
  };

  // Handle viewing agent details
  const handleViewAgent = (agent: Agent) => {
    setViewingAgent(agent);
    setAgentSubmissions(MockService.getAgentSubmissions(agent.id));
  };

  const handleBackToAgents = () => {
    setViewingAgent(null);
    setAgentSubmissions([]);
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAgentForm.fullName && newAgentForm.email && newAgentForm.phone && newAgentForm.zone) {
      const createdAgent = MockService.addAgent(newAgentForm);
      setAgents([...agents, createdAgent]);
      setNewAgentForm({ fullName: '', email: '', phone: '', zone: '' });
      setIsAddAgentModalOpen(false);
      alert('Agent ajouté avec succès !');
    } else {
      alert('Veuillez remplir tous les champs pour ajouter un agent.');
    }
  };

  const handleToggleAgentStatus = (agent: Agent) => {
    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Voulez-vous vraiment ${newStatus === 'inactive' ? 'suspendre' : 'activer'} l'agent ${agent.fullName} ?`)) {
      const success = MockService.toggleAgentStatus(agent.id);
      if (success) {
        setAgents(MockService.getAgents()); // Refresh agents list
        alert(`Statut de l'agent ${agent.fullName} mis à jour à "${newStatus}".`);
      } else {
        alert("Erreur lors de la mise à jour du statut de l'agent.");
      }
    }
  };

  const openAgentResetPasswordModal = (agent: Agent) => {
    setSelectedAgentForPasswordReset(agent);
    setNewAgentPasswordInput('');
    setIsAgentResetPasswordModalOpen(true);
  };

  const handleAgentResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgentForPasswordReset && newAgentPasswordInput.trim()) {
      const success = MockService.resetAgentPassword(selectedAgentForPasswordReset.id, newAgentPasswordInput);
      if (success) {
        setIsAgentResetPasswordModalOpen(false);
        setSelectedAgentForPasswordReset(null);
        setNewAgentPasswordInput('');
        alert(`Le mot de passe de l'agent ${selectedAgentForPasswordReset.fullName} a été réinitialisé avec succès !`);
      } else {
        alert("Erreur lors de la réinitialisation du mot de passe de l'agent.");
      }
    }
  };


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewingGroup && chatInput.trim()) {
      MockService.addMessage(
        viewingGroup.id,
        adminProfile?.fullName || 'Admin',
        chatInput,
        true // isAdmin
      );
      setGroupMessages(MockService.getGroupMessages(viewingGroup.id));
      setChatInput('');
    }
  };

  const openUserDetailModal = (user: User) => {
    setSelectedUserForDetail(user);
    setSelectedUserTransactions(MockService.getUserTransactions(user.id));
    setIsUserDetailModalOpen(true);
  };

  const toggleUserLoanEligibility = (user: User) => {
    if(window.confirm(`Voulez-vous ${user.loanEligible ? 'retirer' : 'accorder'} l'éligibilité au prêt pour ${user.fullName} ?`)) {
      MockService.toggleLoanEligibility(user.id);
      setUsers(MockService.getUsers());
      setTransactions(MockService.getTransactions()); // Refresh transaction history
      // Refresh stats if we are on stats page (though we are likely on users page)
      if (currentView === 'statistics') setStats(MockService.getGlobalStats());
    }
  };

  // Filter Logic for Transactions
  const getFilteredTransactions = () => {
    return transactions.filter(tx => {
      const matchType = transactionFilterType === 'all' || tx.type === transactionFilterType;
      const matchStatus = transactionFilterStatus === 'all' || tx.status === transactionFilterStatus;
      const matchSearch = transactionSearch === '' || 
        tx.userFullName.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        tx.id.toLowerCase().includes(transactionSearch.toLowerCase());
      return matchType && matchStatus && matchSearch;
    });
  };

  // Logic for Clients Pagination
  const getPaginatedUsers = () => {
    // 1. Filter
    const filtered = users.filter(user => 
      user.fullName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    // 2. Paginate
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { filtered, currentItems, totalPages };
  };

  const { filtered: filteredUsers, currentItems: currentUsers, totalPages: totalUserPages } = getPaginatedUsers();

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber >= 1 && pageNumber <= totalUserPages) {
      setCurrentPage(pageNumber);
    }
  };

  // KYC Logic
  const getFilteredKYCSubmissions = () => {
    return kycSubmissions.filter(user => {
      const matchStatus = kycFilterStatus === 'all' || user.kycStatus === kycFilterStatus;
      const matchSearch = kycSearchTerm === '' ||
        user.fullName.toLowerCase().includes(kycSearchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(kycSearchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });
  };

  const openKYCDetailModal = (user: User) => {
    setSelectedUserForKYC(user);
    setSelectedUserKYCDocuments(MockService.getKYCDocumentsForUser(user.id));
    setKycRejectionReason('');
    setIsKYCDetailModalOpen(true);
  };

  const handleUpdateKYCStatus = (status: 'verified' | 'rejected') => {
    if (selectedUserForKYC) {
      const reason = status === 'rejected' ? kycRejectionReason : undefined;
      const success = MockService.updateKYCStatus(selectedUserForKYC.id, status, reason);
      if (success) {
        setUsers(MockService.getUsers()); // Refresh users to update KYC status
        setKycSubmissions(MockService.getKYCSubmissions()); // Refresh KYC list
        setIsKYCDetailModalOpen(false);
        alert(`Statut KYC de ${selectedUserForKYC.fullName} mis à jour à "${status}".`);
      } else {
        alert("Erreur lors de la mise à jour du statut KYC.");
      }
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


  const renderContent = () => {
    switch(currentView) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
                  <p className="text-gray-500 text-sm">Bienvenue, {adminProfile?.fullName}</p>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentView('users')}
                    className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Nouveau Client
                  </button>
                  <button 
                    onClick={() => setCurrentView('users')}
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{MockService.getTotalDeposits().toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></p>
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalAdminDepositsAmount.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></p>
                </div>
              </div>

              {/* Alert / Pending Card */}
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('agents')}>
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
                   <button onClick={() => setCurrentView('transactions')} className="text-sm text-gray-700 hover:text-gray-800 font-medium">Voir tout</button>
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
                           {tx.type === 'loan_eligibility' || tx.type === 'status_change' ? '-' : `${tx.amount.toLocaleString()} FCFA`}
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
                         <p className="text-sm font-bold text-gray-900">{user.depositAmount.toLocaleString()} FCFA</p>
                         <p className="text-xs text-green-600">Solde initial</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="bg-gray-50 px-6 py-3 text-center border-t border-gray-100">
                    <button onClick={() => setCurrentView('users')} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Gérer tous les clients</button>
                 </div>
               </div>
            </div>
          </div>
        );

      case 'agents':
         if (viewingAgent) {
           return (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleBackToAgents}
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{viewingAgent.fullName}</h2>
                    <p className="text-gray-500 text-sm">Zone: {viewingAgent.zone} • ID: {viewingAgent.id}</p>
                  </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                         <FileCheck className="h-5 w-5 text-gray-700" />
                         Rapports de Terrain envoyés par {viewingAgent.fullName}
                      </h3>
                      <span className="text-sm text-gray-500">{agentSubmissions.length} formulaires</span>
                   </div>
                   <div className="overflow-x-auto">
                      {agentSubmissions.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Formulaire</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Rencontré</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails Collecte</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Lieu</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {agentSubmissions.map((sub) => (
                              <tr key={sub.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                     sub.type === 'new_registration' ? 'bg-blue-100 text-blue-800' : 
                                     sub.type === 'daily_collection' ? 'bg-green-100 text-green-800' :
                                     'bg-purple-100 text-purple-800'
                                   }`}>
                                      {sub.type.replace('_', ' ')}
                                   </span>
                                   {sub.notes && (
                                     <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{sub.notes}</p>
                                   )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="text-sm font-medium text-gray-900">{sub.clientName}</div>
                                   <div className="text-xs text-gray-500">{sub.clientPhone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   {sub.amount ? (
                                     <span className="text-sm font-bold text-gray-800">{sub.amount.toLocaleString()} FCFA</span>
                                   ) : (
                                     <span className="text-sm text-gray-400">-</span>
                                   )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="flex items-center text-sm text-gray-500 gap-1">
                                      <Calendar className="h-3 w-3" /> {sub.submissionDate.split(' ')[0]}
                                   </div>
                                   <div className="flex items-center text-xs text-gray-400 gap-1 mt-0.5">
                                      <MapPin className="h-3 w-3" /> {sub.location}
                                   </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                   {sub.status === 'approved' ? (
                                     <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                       <CheckCircle className="h-4 w-4" /> Approuvé
                                     </span>
                                   ) : sub.status === 'pending' ? (
                                     <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
                                       <AlertCircle className="h-4 w-4" /> En attente
                                     </span>
                                   ) : (
                                     <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                                       <XCircle className="h-4 w-4" /> Rejeté
                                     </span>
                                   )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          Cet agent n'a encore envoyé aucun formulaire.
                        </div>
                      )}
                   </div>
                </div>
             </div>
           );
         }
        return (
          <div className="space-y-8">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-800">Gestion des Agents</h2> {/* Renamed title */}
               <button 
                 onClick={() => setIsAddAgentModalOpen(true)} // Open modal
                 className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 flex items-center gap-2"
               >
                 <Plus className="h-4 w-4" /> Nouvel Agent
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                              <Briefcase className="h-6 w-6" />
                           </div>
                           <div>
                              <h3 className="font-bold text-gray-900">{agent.fullName}</h3>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {agent.status}
                              </span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                           <MapPin className="h-4 w-4 text-gray-700" />
                           <span>Zone: <strong>{agent.zone}</strong></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 gap-2">
                           <Phone className="h-4 w-4 text-gray-400" />
                           <span>{agent.phone}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mt-2">
                           <p className="text-xs text-gray-500">Activité Totale</p>
                           <p className="text-lg font-bold text-gray-800">{agent.totalFormsSubmitted} Formulaires</p>
                        </div>
                     </div>

                     <div className="flex gap-2 mt-4">
                       <button 
                         onClick={() => handleViewAgent(agent)}
                         className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                       >
                          <FileText className="h-4 w-4" />
                          Voir activité terrain
                       </button>
                       <button 
                         onClick={() => handleToggleAgentStatus(agent)}
                         className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                           agent.status === 'active' 
                             ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                             : 'bg-green-100 text-green-700 hover:bg-green-200'
                         }`}
                         title={agent.status === 'active' ? 'Suspendre l\'agent' : 'Activer l\'agent'}
                       >
                         {agent.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                       </button>
                       <button 
                         onClick={() => openAgentResetPasswordModal(agent)}
                         className="px-3 py-2 rounded-lg font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors text-sm"
                         title="Réinitialiser le mot de passe"
                       >
                         <KeyRound className="h-4 w-4" />
                       </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <h2 className="text-2xl font-bold text-gray-800">Analyses Statistiques</h2>
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 flex items-center gap-2 shadow-sm">
                 <Calendar className="h-4 w-4" />
                 Mise à jour: {new Date().toLocaleDateString()}
               </div>
             </div>

             {/* KPIs Top Row */}
             {stats && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-6 rounded-xl shadow-lg text-white">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-gray-300 text-sm font-medium">Solde Total Géré</p>
                       <h3 className="text-2xl font-bold mt-1">{MockService.getTotalDeposits().toLocaleString()}</h3>
                     </div>
                     <div className="bg-gray-600/30 p-2 rounded-lg">
                       <Wallet className="h-6 w-6 text-white" />
                     </div>
                   </div>
                   <div className="flex items-center text-xs text-gray-300 bg-gray-800/20 w-fit px-2 py-1 rounded">
                     <TrendingUp className="h-3 w-3 mr-1" /> +12% ce mois
                   </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-gray-500 text-sm font-medium">Éligibles Crédit</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.eligibleUsersCount}</h3>
                     </div>
                     <div className="bg-blue-100 p-2 rounded-lg">
                       <CreditCard className="h-6 w-6 text-blue-600" />
                     </div>
                   </div>
                   <p className="text-xs text-blue-600 font-medium">Potentiels Emprunteurs</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-gray-500 text-sm font-medium">Taux de Succès</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.successRate}%</h3>
                     </div>
                     <div className="bg-gray-200 p-2 rounded-lg">
                       <Target className="h-6 w-6 text-gray-700" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Sur {stats.totalTransactions} transactions</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm text-gray-500 font-medium">Groupes Tontine</p>
                       <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalGroups}</h3>
                     </div>
                     <div className="bg-gray-200 p-2 rounded-lg">
                       <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Actifs en cours</p>
                 </div>
               </div>
             )}

             {/* New Financial KPIs */}
             {stats && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm text-gray-500 font-medium">Total Bénéfice</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalProfit.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></h3>
                     </div>
                     <div className="bg-green-100 p-2 rounded-lg">
                       <TrendingUp className="h-6 w-6 text-green-600" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Commissions + Intérêts</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm text-gray-500 font-medium">Commissions Tontine</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalTontineCommission.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></h3>
                     </div>
                     <div className="bg-orange-100 p-2 rounded-lg">
                       <Banknote className="h-6 w-6 text-orange-600" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Sur les dépôts</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm text-gray-500 font-medium">Intérêts de Prêt</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalLoanInterest.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></h3>
                     </div>
                     <div className="bg-purple-100 p-2 rounded-lg">
                       <CreditCard className="h-6 w-6 text-purple-600" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Revenus des crédits</p>
                 </div>

                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="text-sm text-gray-500 font-medium">Frais de Retrait</p>
                       <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalWithdrawalFees.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA</span></h3>
                     </div>
                     <div className="bg-red-100 p-2 rounded-lg">
                       <DollarSign className="h-6 w-6 text-red-600" />
                     </div>
                   </div>
                   <p className="text-xs text-gray-400">Sur les retraits</p>
                 </div>
               </div>
             )}

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Breakdown - Left */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                       <BarChart3 className="h-5 w-5 text-gray-500" />
                       Flux Financiers
                     </h3>
                  </div>
                  
                  {stats && (
                    <div className="space-y-6">
                       {/* Agent vs Direct Stats */}
                       <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                             <p className="text-sm text-blue-600 font-medium mb-1">Via Agents Terrain</p>
                             <p className="text-xl font-bold text-blue-800">{stats.totalCollectedByAgents.toLocaleString()} FCFA</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                             <p className="text-sm text-green-600 font-medium mb-1">Dépôts Directs</p>
                             <p className="text-xl font-bold text-green-800">{(stats.totalDepositsValue - stats.totalCollectedByAgents).toLocaleString()} FCFA</p>
                          </div>
                       </div>

                       {/* Deposit Bar */}
                       <div>
                         <div className="flex justify-between text-sm mb-1">
                           <span className="font-medium text-gray-700">Volume Global Dépôts</span>
                           <span className="font-bold text-green-600">{stats.totalDepositsValue.toLocaleString()} FCFA</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                           <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
                         </div>
                       </div>

                       {/* Withdrawal Bar */}
                       <div>
                         <div className="flex justify-between text-sm mb-1">
                           <span className="font-medium text-gray-700">Volume Global Retraits</span>
                           <span className="font-bold text-orange-600">{stats.totalWithdrawalsValue.toLocaleString()} FCFA</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                           <div className="bg-orange-500 h-4 rounded-full" style={{ width: '35%' }}></div>
                         </div>
                       </div>

                       {/* Growth Chart (Custom CSS) */}
                       <div className="pt-6 border-t border-gray-100 mt-6">
                          <h4 className="text-sm font-semibold text-gray-600 mb-4">Évolution des Inscriptions (6 derniers mois)</h4>
                          <div className="flex items-end justify-between h-40 gap-2">
                             {stats.growthData.map((data: any, i: number) => (
                               <div key={i} className="flex flex-col items-center w-full">
                                  <div 
                                    className="w-full max-w-[40px] bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors relative group"
                                    style={{ height: `${data.users * 10}%` }}
                                  >
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      {data.users}
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  )}
                </div>

                {/* Top Users & Distribution - Right */}
                <div className="space-y-6">
                   {/* Top Depositors */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-gray-700" />
                        Top Épargnants
                      </h3>
                      <div className="space-y-4">
                        {stats && stats.topDepositors.map((user: User, index: number) => (
                          <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                             <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                               index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                               index === 1 ? 'bg-gray-200 text-gray-700' :
                               'bg-orange-100 text-orange-800'
                             }`}>
                               {index + 1}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
                               <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-bold text-green-600">{user.depositAmount.toLocaleString()}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   {/* Status Distribution */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                         <PieChart className="h-5 w-5 text-gray-700" />
                         Répartition
                      </h3>
                      <div className="flex items-center justify-center py-4">
                         <div className="relative w-32 h-32 rounded-full border-[8px] border-gray-700 flex items-center justify-center shadow-inner">
                            <span className="text-2xl font-bold text-gray-800">100%</span>
                         </div>
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        Tous les clients sont <span className="text-gray-800 font-bold">Actifs</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'settings':
        return (
           <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-800">Paramètres Système</h2>
               <button 
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-sm"
               >
                 <Save className="h-4 w-4" />
                 Enregistrer
               </button>
            </div>
            
            {settings && (
              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* General Settings */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
                       <Globe className="h-5 w-5 text-gray-700" />
                       Général & Contact
                    </h3>
                    <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Plateforme</label>
                         <input 
                           type="text" 
                           value={settings.siteName}
                           onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                           className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                         />
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email Support</label>
                           <input 
                             type="email" 
                             value={settings.supportEmail}
                             onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                             className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone Support</label>
                           <input 
                             type="text" 
                             value={settings.supportPhone}
                             onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                             className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                           />
                         </div>
                       </div>
                       <div className="pt-2">
                          <label className="flex items-center cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={settings.maintenanceMode}
                               onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                               className="sr-only peer"
                             />
                             <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                             <span className="ms-3 text-sm font-medium text-gray-700">Mode Maintenance</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1 ml-14">Si activé, seuls les administrateurs pourront accéder au site.</p>
                       </div>
                    </div>
                 </div>

                 {/* Financial Settings */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
                       <DollarSign className="h-5 w-5 text-gray-700" />
                       Configuration Financière
                    </h3>
                    <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Devise par défaut</label>
                         <select 
                           value={settings.defaultCurrency}
                           onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                           className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                         >
                           <option value="FCFA">FCFA (XOF)</option>
                           <option value="EUR">Euro (€)</option>
                           <option value="USD">Dollar ($)</option>
                         </select>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Taux d'intérêt Prêt (%)</label>
                           <div className="relative">
                             <input 
                               type="number" 
                               step="0.1"
                               value={settings.loanInterestRate}
                               onChange={(e) => setSettings({...settings, loanInterestRate: parseFloat(e.target.value)})}
                               className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                             />
                             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Commission Tontine (%)</label>
                           <div className="relative">
                             <input 
                               type="number" 
                               step="0.1"
                               value={settings.tontineCommission}
                               onChange={(e) => setSettings({...settings, tontineCommission: parseFloat(e.target.value)})}
                               className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                             />
                             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                           </div>
                         </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Taux de frais de retrait (%)</label>
                           <div className="relative">
                             <input 
                               type="number" 
                               step="0.1"
                               value={settings.withdrawalFeeRate}
                               onChange={(e) => setSettings({...settings, withdrawalFeeRate: parseFloat(e.target.value)})}
                               className="w-full p-2.5 pr-8 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                             />
                             <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                           </div>
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Security & System */}
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
                       <Shield className="h-5 w-5 text-gray-700" />
                       Sécurité & Notifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Lock className="h-4 w-4 text-gray-400" /> Politique de mot de passe</h4>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Longueur minimum du mot de passe</label>
                             <input 
                               type="number" 
                               value={settings.minPasswordLength}
                               onChange={(e) => setSettings({...settings, minPasswordLength: parseInt(e.target.value)})}
                               className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                             />
                          </div>
                          <div>
                            <label className="flex items-center cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={settings.enableTwoFactor}
                                 onChange={(e) => setSettings({...settings, enableTwoFactor: e.target.checked})}
                                 className="sr-only peer"
                               />
                               <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                               <span className="ms-3 text-sm font-medium text-gray-700">Authentification à deux facteurs (2FA)</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-14">Obligatoire pour tous les comptes administrateurs.</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Bell className="h-4 w-4 text-gray-400" /> Notifications</h4>
                          <div>
                            <label className="flex items-center cursor-pointer">
                               <input 
                                 type="checkbox" 
                                 checked={settings.emailNotifications}
                                 onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                                 className="sr-only peer"
                               />
                               <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
                               <span className="ms-3 text-sm font-medium text-gray-700">Notifications Email</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1 ml-14">Recevoir des alertes lors de nouvelles inscriptions ou transactions suspectes.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </form>
            )}
           </div>
        );

      case 'users':
        return (
          <div className="space-y-8">
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
                  onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Nom d'utilisateur (Pseudo)" 
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Mot de passe" 
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  required
                />
                <input 
                  type="number" 
                  placeholder="Dépôt initial (FCFA)" 
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none w-full"
                  value={newUser.depositAmount || ''}
                  onChange={e => setNewUser({...newUser, depositAmount: Number(e.target.value)})}
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
                        setCurrentPage(1); // Reset to page 1 on search
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
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde (FCFA)</th>
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors shadow-sm text-xs sm:text-sm font-medium ${
                                user.loanEligible 
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
                         <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
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
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                             >
                                <span className="sr-only">Précédent</span>
                                <ChevronLeft className="h-5 w-5" />
                             </button>
                             
                             {/* Generate Page Numbers */}
                             {Array.from({ length: totalUserPages }, (_, i) => i + 1).map((number) => (
                               <button
                                  key={number}
                                  onClick={() => handlePageChange(number)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === number
                                      ? 'z-10 bg-gray-100 border-gray-500 text-gray-700'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                               >
                                  {number}
                               </button>
                             ))}

                             <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalUserPages}
                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalUserPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                             >
                                <span className="sr-only">Suivant</span>
                                <ChevronRight className="h-5 w-5" />
                             </button>
                          </nav>
                       </div>
                    </div>
                    {/* Mobile Pagination simplified */}
                    <div className="flex items-center justify-between w-full sm:hidden">
                       <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                       >
                          Précédent
                       </button>
                       <span className="text-sm text-gray-700">
                          Page {currentPage} / {totalUserPages}
                       </span>
                       <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalUserPages}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalUserPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                       >
                          Suivant
                       </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        );

      case 'groups':
        // Detail View
        if (viewingGroup) {
          return (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToGroups}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{viewingGroup.name}</h2>
                  <p className="text-gray-500 text-sm">Détails et membres du groupe</p>
                </div>
              </div>

              {/* Group Info Cards */}
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
                  <p className="text-xl font-bold text-gray-900">{viewingGroup.targetAmount.toLocaleString()} FCFA</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{viewingGroup.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Members Table */}
                 <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Membres du groupe</h3>
                      <button 
                          onClick={() => openAddMemberModal(viewingGroup)}
                          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
                        >
                          <UserPlus className="h-4 w-4" />
                          Ajouter
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                      {viewingGroupMembers.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adhésion</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {viewingGroupMembers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold mr-3">
                                        {user.fullName.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                      </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{user.depositAmount.toLocaleString()} FCFA</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          Aucun membre dans ce groupe pour le moment.
                        </div>
                      )}
                    </div>
                 </div>

                 {/* Group Chat Section */}
                 <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2 rounded-t-xl">
                      <MessageSquare className="h-5 w-5 text-gray-700" />
                      <h3 className="font-semibold text-gray-800">Discussion de Groupe</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                      {groupMessages.length > 0 ? (
                        groupMessages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                              msg.isAdmin 
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
              </div>
            </div>
          );
        }

      case 'transactions':
        const filteredTransactions = getFilteredTransactions();
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Historique des Transactions</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               {/* Filters/Header */}
               <div className="px-6 py-6 border-b border-gray-100 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-gray-800">Mouvements financiers</h3>
                   <span className="text-sm text-gray-500">{filteredTransactions.length} résultats</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                   <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Rechercher (Nom, ID)..." 
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent" 
                      />
                   </div>
                   
                   <div className="relative">
                      <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        value={transactionFilterType}
                        onChange={(e) => setTransactionFilterType(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="all">Tous les types</option>
                        <option value="deposit">Dépôts</option>
                        <option value="withdrawal">Retraits</option>
                        <option value="loan_eligibility">Crédit / Éligibilité</option>
                      </select>
                   </div>

                   <div className="relative">
                      <Zap className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select 
                        value={transactionFilterStatus}
                        onChange={(e) => setTransactionFilterStatus(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="success">Succès</option>
                        <option value="failed">Échec</option>
                      </select>
                   </div>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails/Raison</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredTransactions.map((tx) => (
                       <tr key={tx.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.userFullName}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                           {tx.type === 'deposit' && (
                             <div className="flex items-center gap-2 text-green-600">
                               <ArrowUpRight className="h-4 w-4" />
                               <span>Dépôt</span>
                             </div>
                           )}
                           {tx.type === 'withdrawal' && (
                             <div className="flex items-center gap-2 text-orange-600">
                               <ArrowDownLeft className="h-4 w-4" />
                               <span>Retrait</span>
                             </div>
                           )}
                           {tx.type === 'loan_eligibility' && (
                             <div className="flex items-center gap-2 text-blue-600">
                               <Shield className="h-4 w-4" />
                               <span>Éligibilité</span>
                             </div>
                           )}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                           {tx.type === 'loan_eligibility' ? '-' : `${tx.amount.toLocaleString()} FCFA`}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                           {tx.status === 'success' ? (
                             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               <CheckCircle className="h-3 w-3" /> Succès
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                               <XCircle className="h-3 w-3" /> Échec
                             </span>
                           )}
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                           {tx.reason ? (
                             <span className={`flex items-center gap-1 ${tx.status === 'failed' ? 'text-red-500' : 'text-gray-500'}`}>
                               {tx.status === 'failed' ? <AlertCircle className="h-3 w-3 flex-shrink-0" /> : <FileText className="h-3 w-3 flex-shrink-0" />} 
                               {tx.reason}
                             </span>
                           ) : '-'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Mon Profil Admin</h2>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-800 h-24 sm:h-32 relative">
                <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-8">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-full p-1 shadow-md">
                     {adminProfile?.profilePictureUrl ? (
                       <img 
                         src={adminProfile.profilePictureUrl} 
                         alt="Admin Profile" 
                         className="h-full w-full rounded-full object-cover" 
                         onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/gray/white?text=Admin"; }}
                       />
                     ) : (
                       <div className="h-full w-full bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                       </div>
                     )}
                  </div>
                </div>
              </div>
              <div className="pt-14 sm:pt-16 px-6 sm:px-8 pb-8">
                {isEditProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Nom Complet</label>
                       <input 
                        type="text" 
                        value={profileForm.fullName}
                        onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-gray-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Email</label>
                       <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-gray-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                       <input 
                        type="text" 
                        value={profileForm.phoneNumber}
                        onChange={e => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-gray-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700">Adresse</label>
                       <input 
                        type="text" 
                        value={profileForm.address}
                        onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-gray-500"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700">URL Photo de Profil</label>
                       <input 
                        type="text" 
                        value={profileForm.profilePictureUrl}
                        onChange={e => setProfileForm({...profileForm, profilePictureUrl: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-gray-500"
                        placeholder="Ex: https://example.com/ma-photo.jpg"
                       />
                     </div>
                     <div className="flex gap-4 pt-4">
                       <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 text-sm font-medium">Enregistrer</button>
                       <button type="button" onClick={() => setIsEditProfile(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 text-sm font-medium">Annuler</button>
                     </div>
                  </form>
                ) : (
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{adminProfile?.fullName}</h1>
                    <p className="text-gray-700 font-medium text-sm">{adminProfile?.role.toUpperCase()}</p>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <UserCircle className="h-5 w-5 mr-3" />
                        <span>@{adminProfile?.username}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <Mail className="h-5 w-5 mr-3" />
                        <span>{adminProfile?.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <Phone className="h-5 w-5 mr-3" />
                        <span>{adminProfile?.phoneNumber || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>{adminProfile?.address || 'Non renseigné'}</span>
                      </div>
                    </div>

                    {/* Admin Deposits List in Profile */}
                    <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-gray-700" /> Mes Dépôts (Admin)
                      </h3>
                      {adminDeposits.length > 0 ? (
                        <div className="space-y-3">
                          {adminDeposits.map((tx) => (
                            <div key={tx.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-md shadow-sm border border-gray-100">
                              <div className="flex items-center gap-2">
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                                <div>
                                  <p className="font-medium text-gray-900">Dépôt à {tx.userFullName}</p>
                                  <p className="text-xs text-gray-500">{tx.date.split(' ')[0]}</p>
                                </div>
                              </div>
                              <span className="font-bold text-green-600">+{tx.amount.toLocaleString()} FCFA</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">Aucun dépôt effectué par l'admin pour le moment.</p>
                      )}
                      <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                        <p className="text-base font-bold text-gray-800">Total: {stats?.totalAdminDepositsAmount.toLocaleString()} FCFA</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsEditProfile(true)}
                      className="mt-8 w-full border border-gray-800 text-gray-800 rounded-lg py-2 hover:bg-gray-100 transition-colors text-sm font-medium"
                    >
                      Modifier le profil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'kyc':
        const filteredKYCSubmissions = getFilteredKYCSubmissions();
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">Vérification KYC (Connaître Votre Client)</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-6 border-b border-gray-100 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Soumissions KYC</h3>
                  <span className="text-sm text-gray-500">{filteredKYCSubmissions.length} résultats</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher (Nom, ID)..."
                      value={kycSearchTerm}
                      onChange={(e) => setKycSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={kycFilterStatus}
                      onChange={(e) => setKycFilterStatus(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="verified">Vérifié</option>
                      <option value="rejected">Rejeté</option>
                      <option value="not_submitted">Non soumis</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut KYC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Soumission</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Vérification</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKYCSubmissions.length > 0 ? (
                      filteredKYCSubmissions.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.kycStatus === 'verified' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3" /> Vérifié
                              </span>
                            )}
                            {user.kycStatus === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertCircle className="h-3 w-3" /> En attente
                              </span>
                            )}
                            {user.kycStatus === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3" /> Rejeté
                              </span>
                            )}
                            {user.kycStatus === 'not_submitted' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <FileWarning className="h-3 w-3" /> Non soumis
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.kycSubmissionDate || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.kycVerifiedDate || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {user.kycStatus !== 'not_submitted' && (
                              <button
                                onClick={() => openKYCDetailModal(user)}
                                className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors shadow-sm text-xs sm:text-sm font-medium border border-gray-200"
                                title="Voir les documents KYC"
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> Voir
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                          Aucune soumission KYC trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Vue non trouvée</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && selectedUserForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Wallet className="h-6 w-6 text-gray-700" />
                Faire un dépôt
              </h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitDeposit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-1">Bénéficiaire</p>
                <p className="text-lg font-bold text-gray-800">{selectedUserForDeposit.fullName}</p>
                <p className="text-xs text-gray-500">ID: {selectedUserForDeposit.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant à déposer (FCFA)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-lg"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif / Référence (Optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={depositNote}
                    onChange={(e) => setDepositNote(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Ex: Dépôt espèce guichet"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                >
                  Confirmer le dépôt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {isUserDetailModalOpen && selectedUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
             {/* Header */}
             <div className="bg-gray-800 px-6 py-6 flex justify-between items-start">
               <div className="flex items-center gap-4">
                 <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-gray-800 text-2xl font-bold shadow-md">
                   {selectedUserForDetail.fullName.charAt(0)}
                 </div>
                 <div className="text-white">
                   <h3 className="text-2xl font-bold">{selectedUserForDetail.fullName}</h3>
                   <p className="text-gray-300 text-sm">@{selectedUserForDetail.username}</p>
                   <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold bg-gray-700 text-white border border-gray-600">
                     {selectedUserForDetail.status ? selectedUserForDetail.status.toUpperCase() : 'ACTIF'}
                   </span>
                 </div>
               </div>
               <button 
                onClick={() => setIsUserDetailModalOpen(false)} 
                className="text-gray-300 hover:text-white bg-gray-700 p-2 rounded-full hover:bg-gray-800 transition-colors"
               >
                <X className="h-5 w-5" />
               </button>
             </div>

             {/* Content */}
             <div className="p-6 bg-gray-50">
               
               {/* Info Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 {/* Contact Card */}
                 <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                   <h4 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                     <UserCircle className="h-4 w-4 text-gray-700" /> Informations Personnelles
                   </h4>
                   <div className="space-y-3 text-sm">
                     <div className="flex items-start gap-3">
                       <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                       <div>
                         <span className="block text-gray-500 text-xs">Email</span>
                         <span className="text-gray-700">{selectedUserForDetail.email || 'Non renseigné'}</span>
                       </div>
                     </div>
                     <div className="flex items-start gap-3">
                       <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                       <div>
                         <span className="block text-gray-500 text-xs">Téléphone</span>
                         <span className="text-gray-700">{selectedUserForDetail.phoneNumber || 'Non renseigné'}</span>
                       </div>
                     </div>
                     <div className="flex items-start gap-3">
                       <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                       <div>
                         <span className="block text-gray-500 text-xs">Adresse</span>
                         <span className="text-gray-700">{selectedUserForDetail.address || 'Non renseigné'}</span>
                       </div>
                     </div>
                     <div className="flex items-start gap-3 pt-2 border-t border-gray-100 mt-2">
                        <CreditCard className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <span className="block text-gray-500 text-xs">Statut Crédit</span>
                          {selectedUserForDetail.loanEligible ? (
                            <span className="text-green-600 font-medium">Éligible au prêt</span>
                          ) : (
                            <span className="text-gray-500">Non éligible</span>
                          )}
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Balance Card */}
                 <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                   <h4 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                     <Wallet className="h-4 w-4 text-gray-700" /> Solde du Compte
                   </h4>
                   <div className="flex flex-col h-full justify-center pb-4">
                     <span className="text-gray-500 text-sm mb-1">Solde Actuel</span>
                     <span className="text-3xl font-bold text-gray-800 tracking-tight">
                       {selectedUserForDetail.depositAmount.toLocaleString()} <span className="text-lg text-gray-600">FCFA</span>
                     </span>
                     <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm">
                       <span className="text-gray-500">Membre depuis</span>
                       <span className="font-medium text-gray-700">{selectedUserForDetail.joinedDate}</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Recent Transactions Snippet */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                 <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h4 className="text-gray-800 font-semibold flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-gray-700" /> Dernières Transactions
                    </h4>
                    <span className="text-xs text-gray-500">5 dernières</span>
                 </div>
                 <div className="divide-y divide-gray-100">
                   {selectedUserTransactions.length > 0 ? (
                     selectedUserTransactions.slice(0, 5).map(tx => (
                       <div key={tx.id} className="px-5 py-3 flex justify-between items-center hover:bg-gray-50">
                         <div className="flex items-center gap-3">
                           <div className={`p-1.5 rounded-full ${tx.type === 'deposit' ? 'bg-green-100 text-green-600' : tx.type === 'loan_eligibility' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                             {tx.type === 'deposit' ? <ArrowUpRight className="h-3 w-3" /> : tx.type === 'loan_eligibility' ? <Shield className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                           </div>
                           <div>
                             <p className="text-sm font-medium text-gray-900 capitalize">
                               {tx.type === 'deposit' ? 'Dépôt' : tx.type === 'loan_eligibility' ? 'Statut Crédit' : 'Retrait'}
                             </p>
                             <p className="text-xs text-gray-500">{tx.date}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : tx.type === 'loan_eligibility' ? 'text-gray-600' : 'text-orange-600'}`}>
                             {tx.type === 'loan_eligibility' ? 'Admin' : (tx.type === 'deposit' ? '+' : '-') + tx.amount.toLocaleString() + ' FCFA'}
                           </p>
                           <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {tx.status === 'success' ? 'Succès' : 'Échec'}
                           </span>
                         </div>
                       </div>
                     ))
                   ) : (
                     <div className="p-4 text-center text-gray-500 text-sm">Aucune transaction enregistrée.</div>
                   )}
                 </div>
               </div>

             </div>
             <div className="bg-gray-100 px-6 py-4 flex justify-end">
               <button 
                onClick={() => setIsUserDetailModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
               >
                 Fermer
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddMemberModalOpen && selectedGroupForMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-gray-700" />
                Ajouter un membre
              </h3>
              <button onClick={() => setIsAddMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddMemberToGroup} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                 <p className="text-sm text-gray-500 mb-1">Groupe Cible</p>
                 <p className="text-lg font-bold text-gray-800">{selectedGroupForMember.name}</p>
                 <p className="text-xs text-gray-500">{selectedGroupForMember.memberCount} membres actuels</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionner un client</label>
                <div className="relative">
                   <select 
                     value={selectedMemberId} 
                     onChange={(e) => setSelectedMemberId(e.target.value)}
                     className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-base"
                     required
                   >
                     <option value="" disabled>-- Choisir un membre --</option>
                     {users.map(user => (
                       <option key={user.id} value={user.id}>
                         {user.fullName} ({user.username})
                       </option>
                     ))}
                   </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {isAddAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-gray-700" />
                Ajouter un nouvel Agent
              </h3>
              <button onClick={() => setIsAddAgentModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.fullName}
                  onChange={(e) => setNewAgentForm({...newAgentForm, fullName: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Nom complet de l'agent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newAgentForm.email}
                  onChange={(e) => setNewAgentForm({...newAgentForm, email: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.phone}
                  onChange={(e) => setNewAgentForm({...newAgentForm, phone: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Ex: 07 00 00 00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zone d'opération</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.zone}
                  onChange={(e) => setNewAgentForm({...newAgentForm, zone: e.target.value})}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Ex: Marché Adjamé"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddAgentModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                >
                  Ajouter l'Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Detail Modal */}
      {isKYCDetailModalOpen && selectedUserForKYC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-gray-800 text-2xl font-bold shadow-md">
                  {selectedUserForKYC.fullName.charAt(0)}
                </div>
                <div className="text-white">
                  <h3 className="text-2xl font-bold">{selectedUserForKYC.fullName}</h3>
                  <p className="text-gray-300 text-sm">Vérification d'identité (KYC)</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedUserForKYC.kycStatus === 'verified' ? 'bg-green-600 text-white' :
                    selectedUserForKYC.kycStatus === 'pending' ? 'bg-yellow-600 text-white' :
                    selectedUserForKYC.kycStatus === 'rejected' ? 'bg-red-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {selectedUserForKYC.kycStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsKYCDetailModalOpen(false)}
                className="text-gray-300 hover:text-white bg-gray-700 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Documents Section */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                    <Image className="h-4 w-4 text-gray-700" /> Documents Soumis
                  </h4>
                  {selectedUserKYCDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUserKYCDocuments.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                          <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                            <img src={doc.documentUrl} alt={doc.type} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 capitalize">{doc.type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">Soumis le: {doc.submissionDate.split(' ')[0]}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                              doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {doc.status.toUpperCase()}
                            </span>
                          </div>
                          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                            <Eye className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">Aucun document soumis.</div>
                  )}
                </div>

                {/* Review Actions */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                      <Fingerprint className="h-4 w-4 text-gray-700" /> Actions de Vérification
                    </h4>
                    {selectedUserForKYC.kycStatus === 'pending' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Raison du rejet (si applicable)</label>
                          <textarea
                            rows={3}
                            value={kycRejectionReason}
                            onChange={(e) => setKycRejectionReason(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
                            placeholder="Ex: Document illisible, informations manquantes..."
                          ></textarea>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdateKYCStatus('rejected')}
                            disabled={!kycRejectionReason.trim()}
                            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-4 w-4 inline-block mr-2" /> Rejeter
                          </button>
                          <button
                            onClick={() => handleUpdateKYCStatus('verified')}
                            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 inline-block mr-2" /> Approuver
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-8">
                        Ce statut KYC ne nécessite pas d'action de vérification.
                        {selectedUserForKYC.kycStatus === 'rejected' && selectedUserKYCDocuments[0]?.rejectionReason && (
                          <p className="mt-4 text-red-600 font-medium">Raison du rejet: {selectedUserKYCDocuments[0].rejectionReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <p>Dernière mise à jour: {selectedUserForKYC.kycVerifiedDate || selectedUserForKYC.kycSubmissionDate || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 px-6 py-4 flex justify-end">
              <button
                onClick={() => setIsKYCDetailModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isResetPasswordModalOpen && selectedUserForPasswordReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-gray-700" />
                Réinitialiser le mot de passe
              </h3>
              <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-1">Utilisateur</p>
                <p className="text-lg font-bold text-gray-800">{selectedUserForPasswordReset.fullName}</p>
                <p className="text-xs text-gray-500">ID: {selectedUserForPasswordReset.username}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-lg"
                    placeholder="Entrez le nouveau mot de passe"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agent Password Reset Modal */}
      {isAgentResetPasswordModalOpen && selectedAgentForPasswordReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <KeyRound className="h-6 w-6 text-gray-700" />
                Réinitialiser le mot de passe de l'agent
              </h3>
              <button onClick={() => setIsAgentResetPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAgentResetPasswordSubmit} className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-500 mb-1">Agent</p>
                <p className="text-lg font-bold text-gray-800">{selectedAgentForPasswordReset.fullName}</p>
                <p className="text-xs text-gray-500">ID: {selectedAgentForPasswordReset.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newAgentPasswordInput}
                    onChange={(e) => setNewAgentPasswordInput(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500 text-lg"
                    placeholder="Entrez le nouveau mot de passe"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAgentResetPasswordModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Sidebar - Responsive */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 md:z-auto
        w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2 justify-center w-full">
            <img 
              src="/logo.png" 
              alt="Mosolocoop" 
              className="h-10 w-auto object-contain rounded-md"
              onError={(e) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = "https://placehold.co/150x50/white/black?text=MosoloCoop";
              }}
            />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-200 hover:text-white absolute right-4">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'overview' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <LayoutDashboard className="h-5 w-5" /> Vue d'ensemble
          </button>
          
          <button 
            onClick={() => handleNavClick('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'users' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Users className="h-5 w-5" /> Clients
          </button>

          <button 
            onClick={() => handleNavClick('groups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'groups' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Layers className="h-5 w-5" /> Groupes
          </button>

          <button 
            onClick={() => handleNavClick('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'agents' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Briefcase className="h-5 w-5" /> Agents {/* Renamed from Partenaires */}
          </button>

          <button 
            onClick={() => handleNavClick('kyc')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'kyc' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Fingerprint className="h-5 w-5" /> Vérification KYC
          </button>

          <button 
            onClick={() => handleNavClick('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'transactions' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <History className="h-5 w-5" /> Historique
          </button>
          
          <button 
            onClick={() => handleNavClick('statistics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'statistics' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <BarChart3 className="h-5 w-5" /> Statistiques
          </button>
          
          <button 
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'settings' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <Settings className="h-5 w-5" /> Paramètres
          </button>

          <button 
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'profile' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-100 hover:bg-gray-800 hover:text-white'}`}
          >
            <UserCircle className="h-5 w-5" /> Mon Profil
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-900/50 hover:text-red-100 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex-none bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-30">
           <div className="flex items-center gap-2">
             <img 
               src="/logo.png" 
               alt="Mosolocoop" 
               className="h-8 w-auto object-contain rounded-md bg-white p-0.5" 
               onError={(e) => {
                 e.currentTarget.onerror = null; 
                 e.currentTarget.src = "https://placehold.co/100x40/white/black?text=MosoloCoop";
               }}
             />
           </div>
           <button 
             className="p-2 hover:bg-gray-800 rounded-md transition-colors" 
             onClick={() => setIsMobileMenuOpen(true)}
           >
             <Menu className="h-6 w-6" />
           </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;