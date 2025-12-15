import { User, Group, AdminProfile, Transaction, Message, SystemSettings, Agent, FieldSubmission, KYCDocument } from '../types';

// Initial Mock Data - IDs updated to 8 characters
let users: User[] = [
  { 
    id: 'US8492X1', 
    username: 'jean_d', 
    fullName: 'Jean Dupont', 
    depositAmount: 150000, 
    joinedDate: '2023-10-01',
    email: 'jean.dupont@example.com',
    phoneNumber: '+225 07 01 02 03',
    address: 'Abidjan, Cocody',
    status: 'active',
    loanEligible: true,
    kycStatus: 'verified',
    kycSubmissionDate: '2023-10-05',
    kycVerifiedDate: '2023-10-06'
  },
  { 
    id: 'US9382Y2', 
    username: 'marie_k', 
    fullName: 'Marie Koné', 
    depositAmount: 75000, 
    joinedDate: '2023-11-15',
    email: 'marie.kone@example.com',
    phoneNumber: '+225 05 04 05 06',
    address: 'Bouaké, Centre',
    status: 'active',
    loanEligible: false,
    kycStatus: 'pending',
    kycSubmissionDate: '2024-03-25'
  },
  { 
    id: 'US1129Z3', 
    username: 'paul_b', 
    fullName: 'Paul Biya', 
    depositAmount: 300000, 
    joinedDate: '2024-01-20',
    email: 'paul.biya@example.com',
    phoneNumber: '+237 6 99 99 99',
    address: 'Yaoundé, Bastos',
    status: 'active',
    loanEligible: true,
    kycStatus: 'not_submitted'
  },
  // Données supplémentaires pour la pagination
  { 
    id: 'US4455A4', 
    username: 'awa_s', 
    fullName: 'Awa Sanogo', 
    depositAmount: 45000, 
    joinedDate: '2024-02-05',
    email: 'awa.sanogo@example.com',
    phoneNumber: '+225 01 02 03 04',
    address: 'Abidjan, Yopougon',
    status: 'active',
    loanEligible: false,
    kycStatus: 'rejected',
    kycSubmissionDate: '2024-03-20',
    kycVerifiedDate: '2024-03-21'
  },
  { 
    id: 'US5566B5', 
    username: 'moussa_t', 
    fullName: 'Moussa Traoré', 
    depositAmount: 12000, 
    joinedDate: '2024-02-12',
    email: 'moussa.t@example.com',
    phoneNumber: '+225 07 08 09 10',
    address: 'Korhogo',
    status: 'active',
    loanEligible: false,
    kycStatus: 'not_submitted'
  },
  { 
    id: 'US6677C6', 
    username: 'fatou_d', 
    fullName: 'Fatou Diallo', 
    depositAmount: 250000, 
    joinedDate: '2024-03-01',
    email: 'fatou.d@example.com',
    phoneNumber: '+221 77 11 22 33',
    address: 'Dakar, Plateau',
    status: 'active',
    loanEligible: true,
    kycStatus: 'verified',
    kycSubmissionDate: '2024-03-02',
    kycVerifiedDate: '2024-03-03'
  },
  { 
    id: 'US7788D7', 
    username: 'kofi_a', 
    fullName: 'Kofi Annan', 
    depositAmount: 500000, 
    joinedDate: '2024-03-10',
    email: 'kofi.a@example.com',
    phoneNumber: '+233 24 55 66 77',
    address: 'Accra, Osu',
    status: 'active',
    loanEligible: true,
    kycStatus: 'pending',
    kycSubmissionDate: '2024-03-28'
  },
];

let groups: Group[] = [
  { id: 'GP102938', name: 'Tontine Business A', description: 'Groupe pour les commerçants du marché central.', memberCount: 12, targetAmount: 1000000, createdAt: '2023-09-01', memberIds: ['US8492X1', 'US9382Y2'] },
  { id: 'GP482910', name: 'Épargne Solidaire', description: 'Micro-crédit pour les petits projets agricoles.', memberCount: 8, targetAmount: 500000, createdAt: '2024-02-10', memberIds: ['US1129Z3'] },
];

let transactions: Transaction[] = [
  { id: 'TRX-001', userId: 'US8492X1', userFullName: 'Jean Dupont', type: 'deposit', amount: 50000, status: 'success', date: '2024-03-10 10:00', reason: 'Dépôt initial' },
  { id: 'TRX-002', userId: 'US9382Y2', userFullName: 'Marie Koné', type: 'withdrawal', amount: 20000, status: 'success', date: '2024-03-11 14:30' },
  { id: 'TRX-003', userId: 'US1129Z3', userFullName: 'Paul Biya', type: 'deposit', amount: 100000, status: 'failed', date: '2024-03-12 09:15', reason: 'Fonds insuffisants sur le moyen de paiement' },
  { id: 'TRX-004', userId: 'US8492X1', userFullName: 'Jean Dupont', type: 'withdrawal', amount: 500000, status: 'failed', date: '2024-03-13 11:20', reason: 'Solde disponible insuffisant' },
  { id: 'TRX-005', userId: 'US9382Y2', userFullName: 'Marie Koné', type: 'deposit', amount: 25000, status: 'success', date: '2024-03-14 08:45' },
  { id: 'TRX-006', userId: 'US1129Z3', userFullName: 'Paul Biya', type: 'withdrawal', amount: 10000, status: 'success', date: '2024-03-15 16:00' },
  { id: 'TRX-007', userId: 'US8492X1', userFullName: 'Jean Dupont', type: 'loan_eligibility', amount: 0, status: 'success', date: '2024-03-16 09:00', reason: 'Éligibilité activée par Admin' },
  { id: 'TRX-008', userId: 'US9382Y2', userFullName: 'Marie Koné', type: 'deposit', amount: 15000, status: 'success', date: '2024-03-20 11:30', reason: 'Collecte Agent Michel Yapo' },
  { id: 'TRX-009', userId: 'US8492X1', userFullName: 'Jean Dupont', type: 'deposit', amount: 10000, status: 'success', date: '2024-06-18 10:00', reason: 'Dépôt manuel admin' },
  { id: 'TRX-010', userId: 'US9382Y2', userFullName: 'Marie Koné', type: 'deposit', amount: 20000, status: 'success', date: '2024-06-17 11:00', reason: 'Dépôt manuel admin' },
  { id: 'TRX-011', userId: 'US1129Z3', userFullName: 'Paul Biya', type: 'deposit', amount: 5000, status: 'success', date: '2024-06-15 12:00', reason: 'Dépôt manuel admin' },
  { id: 'TRX-012', userId: 'US4455A4', userFullName: 'Awa Sanogo', type: 'deposit', amount: 30000, status: 'success', date: '2024-05-20 13:00', reason: 'Dépôt manuel admin' },
  { id: 'TRX-013', userId: 'US5566B5', userFullName: 'Moussa Traoré', type: 'deposit', amount: 10000, status: 'success', date: '2024-04-10 14:00', reason: 'Dépôt manuel admin' },
];

let messages: Message[] = [
  { id: 'msg-1', groupId: 'GP102938', userId: 'US8492X1', senderName: 'Jean Dupont', content: 'Bonjour à tous, quand est prévu le prochain tour ?', timestamp: '2024-03-14 09:30', isAdmin: false },
  { id: 'msg-2', groupId: 'GP102938', userId: 'US9382Y2', senderName: 'Marie Koné', content: 'Salut Jean, je pense que c\'est le 25 du mois.', timestamp: '2024-03-14 09:45', isAdmin: false },
  { id: 'msg-3', groupId: 'GP102938', userId: 'admin', senderName: 'Administrateur', content: 'Exactement, le tirage aura lieu le 25 à 14h.', timestamp: '2024-03-14 10:00', isAdmin: true },
];

let adminProfile: AdminProfile = {
  username: 'admin',
  email: 'admin@mosolocoop.com',
  fullName: 'Administrateur Principal',
  role: 'admin',
  phoneNumber: '+225 01 01 01 01', // Exemple de numéro de téléphone
  address: 'Abidjan, Cocody, Rue 123', // Exemple d'adresse
  profilePictureUrl: 'https://placehold.co/100x100/gray/white?text=Admin' // URL de photo de profil par défaut
};

let systemSettings: SystemSettings = {
  siteName: 'Mosolocoop',
  supportEmail: 'support@mosolocoop.com',
  supportPhone: '+225 01 02 03 04',
  maintenanceMode: false,
  defaultCurrency: 'FCFA',
  loanInterestRate: 5.5, // Pourcentage
  tontineCommission: 1.0, // Pourcentage
  agentCommission: 2.5, // Pourcentage commission agents
  minPasswordLength: 8,
  enableTwoFactor: false,
  emailNotifications: true,
  withdrawalFeeRate: 0.5, // Ajouté: 0.5% de frais de retrait
};

// Données Mock Agents
let agents: Agent[] = [
  { id: 'AGT-01', fullName: 'Michel Yapo', email: 'michel.yapo@mosolocoop.com', phone: '07 55 44 33', zone: 'Abobo Marché', status: 'active', totalFormsSubmitted: 145, joinedDate: '2023-08-10' },
  { id: 'AGT-02', fullName: 'Sarah Touré', email: 'sarah.toure@mosolocoop.com', phone: '05 22 11 00', zone: 'Cocody Riviera', status: 'active', totalFormsSubmitted: 89, joinedDate: '2023-12-05' },
];

// Données Mock Soumissions Terrain
let fieldSubmissions: FieldSubmission[] = [
  { 
    id: 'SUB-101', 
    agentId: 'AGT-01', 
    agentName: 'Michel Yapo', 
    clientName: 'Mme. Awa Bakayoko', 
    clientPhone: '01 02 03 04', 
    type: 'new_registration', 
    amount: 5000, 
    location: 'Abobo Gare', 
    submissionDate: '2024-03-20 10:15', 
    status: 'pending', 
    notes: 'Cliente intéressée par la tontine journalière.' 
  },
  { 
    id: 'SUB-102', 
    agentId: 'AGT-01', 
    agentName: 'Michel Yapo', 
    clientName: 'M. Kofi N\'Guessan', 
    clientPhone: '05 06 07 08', 
    type: 'daily_collection', 
    amount: 15000, 
    location: 'Abobo Marché', 
    submissionDate: '2024-03-20 11:30', 
    status: 'approved', 
    notes: 'Versement complet semaine 3.' 
  },
  { 
    id: 'SUB-103', 
    agentId: 'AGT-02', 
    agentName: 'Sarah Touré', 
    clientName: 'Boutique Zongo', 
    clientPhone: '07 08 09 10', 
    type: 'loan_request', 
    amount: 500000, 
    location: 'Riviera 2', 
    submissionDate: '2024-03-19 16:45', 
    status: 'pending', 
    notes: 'Besoin pour stock Ramadan. Documents photo joints.' 
  }
];

// Données Mock KYC
let kycDocuments: KYCDocument[] = [
  {
    id: 'KYC-001',
    userId: 'US8492X1',
    type: 'id_card',
    documentUrl: 'https://placehold.co/600x400/gray/white?text=ID_Jean_Dupont',
    status: 'approved',
    submissionDate: '2023-10-05 10:00',
    reviewDate: '2023-10-06 11:00',
    reviewerId: 'admin'
  },
  {
    id: 'KYC-002',
    userId: 'US9382Y2',
    type: 'passport',
    documentUrl: 'https://placehold.co/600x400/gray/white?text=Passport_Marie_Kone',
    status: 'pending',
    submissionDate: '2024-03-25 14:00'
  },
  {
    id: 'KYC-003',
    userId: 'US4455A4',
    type: 'proof_of_address',
    documentUrl: 'https://placehold.co/600x400/gray/white?text=Proof_Awa_Sanogo',
    status: 'rejected',
    submissionDate: '2024-03-20 09:00',
    reviewDate: '2024-03-21 10:00',
    reviewerId: 'admin',
    rejectionReason: 'Document illisible'
  },
  {
    id: 'KYC-004',
    userId: 'US7788D7',
    type: 'driver_license',
    documentUrl: 'https://placehold.co/600x400/gray/white?text=Driver_Kofi_Annan',
    status: 'pending',
    submissionDate: '2024-03-28 16:00'
  }
];


export const MockService = {
  // User Logic
  getUsers: () => [...users],
  getUserTransactions: (userId: string) => {
    return transactions.filter(t => t.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
  },
  addUser: (user: Omit<User, 'id' | 'joinedDate' | 'kycStatus'>) => {
    // Generate 8 character ID uppercase
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const newUser: User = {
      ...user,
      id: randomId,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      email: `${user.username}@mosolocoop.com`, // Fake default email
      address: 'Non renseigné',
      phoneNumber: 'Non renseigné',
      loanEligible: false,
      kycStatus: 'not_submitted' // Default KYC status for new users
    };
    users = [...users, newUser];
    return newUser;
  },
  
  toggleLoanEligibility: (userId: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const currentStatus = !!users[userIndex].loanEligible;
      users[userIndex].loanEligible = !currentStatus;
      
      // Log history
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        userId: users[userIndex].id,
        userFullName: users[userIndex].fullName,
        type: 'loan_eligibility',
        amount: 0,
        status: 'success',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: !currentStatus ? 'Éligibilité Accordée' : 'Éligibilité Révoquée'
      };
      transactions = [newTransaction, ...transactions];
      return true;
    }
    return false;
  },

  resetUserPassword: (userId: string, newPassword: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword; // In a real app, this would be hashed
      return true;
    }
    return false;
  },
  
  // Group Logic
  getGroups: () => [...groups],
  
  getGroupMembers: (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.memberIds) return [];
    // Filter users whose ID is in the group's memberIds list
    return users.filter(u => group.memberIds?.includes(u.id));
  },

  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'memberCount'>) => {
    const newGroup: Group = {
      ...group,
      id: `GP${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      memberCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      memberIds: []
    };
    groups = [...groups, newGroup];
    return newGroup;
  },
  
  addMemberToGroup: (groupId: string, userId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      if (!group.memberIds) {
        group.memberIds = [];
      }
      // Check if already in group
      if (group.memberIds.includes(userId)) {
        return false;
      }
      group.memberIds.push(userId);
      group.memberCount += 1;
      return true;
    }
    return false;
  },

  // Chat Logic
  getGroupMessages: (groupId: string) => {
    return messages.filter(m => m.groupId === groupId).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  },

  addMessage: (groupId: string, senderName: string, content: string, isAdmin: boolean = false) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      groupId,
      userId: isAdmin ? 'admin' : 'user', // Simplified for demo
      senderName,
      content,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isAdmin
    };
    messages = [...messages, newMessage];
    return newMessage;
  },

  // Transaction Logic
  getTransactions: () => [...transactions],
  
  makeDeposit: (userId: string, amount: number, note?: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Update Balance
      user.depositAmount += amount;
      
      // Create Transaction Record
      const newTransaction: Transaction = {
        id: `TRX-${Date.now()}`,
        userId: user.id,
        userFullName: user.fullName,
        type: 'deposit',
        amount: amount,
        status: 'success',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        reason: note || 'Dépôt manuel admin'
      };
      transactions = [newTransaction, ...transactions];
      return true;
    }
    return false;
  },

  // Stats Logic
  getTotalDeposits: () => {
    return users.reduce((sum, user) => sum + user.depositAmount, 0);
  },
  
  getPendingSubmissionsCount: () => {
    return fieldSubmissions.filter(s => s.status === 'pending').length;
  },

  getAdminDeposits: () => {
    return transactions.filter(tx => 
      tx.type === 'deposit' && tx.reason === 'Dépôt manuel admin'
    ).sort((a, b) => b.date.localeCompare(a.date));
  },

  getGlobalStats: () => {
    const totalUsers = users.length;
    const totalGroups = groups.length;
    const eligibleUsersCount = users.filter(u => u.loanEligible).length;
    const pendingKYCCount = users.filter(u => u.kycStatus === 'pending').length;
    
    // Financials
    const totalDepositsValue = transactions
      .filter(t => t.type === 'deposit' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalWithdrawalsValue = transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalTransactions = transactions.length;
    const successTransactions = transactions.filter(t => t.status === 'success').length;
    const successRate = totalTransactions > 0 ? Math.round((successTransactions / totalTransactions) * 100) : 0;
    
    // Agent Stats
    const totalCollectedByAgents = fieldSubmissions
      .filter(s => s.status === 'approved' && s.amount)
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    // Top Depositors
    const topDepositors = [...users]
      .sort((a, b) => b.depositAmount - a.depositAmount)
      .slice(0, 3);
      
    // Mock Growth Data (Last 6 months)
    const months = ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];
    const growthData = months.map((month, index) => ({
      month,
      users: Math.floor(Math.random() * 10) + (index * 2) + 5 // Fake growth
    }));

    const adminDeposits = MockService.getAdminDeposits();
    const totalAdminDepositsAmount = adminDeposits.reduce((sum, tx) => sum + tx.amount, 0);

    // New financial calculations
    const totalSuccessfulWithdrawals = transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawalFees = totalSuccessfulWithdrawals * (systemSettings.withdrawalFeeRate / 100);
    
    // Simplified calculation for tontine commissions (e.g., 1% of total deposits)
    const tontineCommissions = totalDepositsValue * (systemSettings.tontineCommission / 100);

    // Simplified calculation for loan interest collected (e.g., 2% of total deposits)
    const loanInterestCollected = totalDepositsValue * (systemSettings.loanInterestRate / 100) * 0.1; // A fraction of the rate for mock

    const totalProfit = withdrawalFees + tontineCommissions + loanInterestCollected;


    return {
      totalUsers,
      totalGroups,
      totalDepositsValue,
      totalWithdrawalsValue,
      totalTransactions,
      successRate,
      topDepositors,
      growthData,
      eligibleUsersCount,
      totalCollectedByAgents,
      pendingKYCCount,
      totalAdminDepositsAmount,
      totalProfit, // New stat
      tontineCommissions, // New stat
      loanInterestCollected, // New stat
      withdrawalFees, // New stat
    };
  },

  // Admin Logic
  getAdminProfile: () => ({ ...adminProfile }),
  updateAdminProfile: (updates: Partial<AdminProfile>) => {
    adminProfile = { ...adminProfile, ...updates };
    return adminProfile;
  },

  // System Settings Logic
  getSystemSettings: () => ({ ...systemSettings }),
  updateSystemSettings: (newSettings: SystemSettings) => {
    systemSettings = { ...newSettings };
    return systemSettings;
  },

  // Agent / Partner Logic
  getAgents: () => [...agents],
  getAgentSubmissions: (agentId: string) => {
    return fieldSubmissions.filter(s => s.agentId === agentId).sort((a, b) => b.submissionDate.localeCompare(a.submissionDate));
  },

  // KYC Logic
  getKYCSubmissions: () => {
    // Return users who have submitted KYC (status is not 'not_submitted')
    return users.filter(u => u.kycStatus !== 'not_submitted');
  },

  getKYCDocumentsForUser: (userId: string) => {
    return kycDocuments.filter(doc => doc.userId === userId);
  },

  updateKYCStatus: (userId: string, newStatus: 'pending' | 'verified' | 'rejected', rejectionReason?: string) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].kycStatus = newStatus;
      users[userIndex].kycVerifiedDate = newStatus === 'verified' ? new Date().toISOString().split('T')[0] : undefined;
      
      // Update associated KYC documents if any
      kycDocuments = kycDocuments.map(doc => {
        if (doc.userId === userId && doc.status === 'pending') { // Only update pending documents
          return {
            ...doc,
            status: newStatus === 'verified' ? 'approved' : 'rejected',
            reviewDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
            reviewerId: adminProfile.username,
            rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined
          };
        }
        return doc;
      });
      return true;
    }
    return false;
  }
};