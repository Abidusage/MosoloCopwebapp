
import { User, Group, AdminProfile, Transaction, Message } from '../types';

// Initial Mock Data
let users: User[] = [
  { 
    id: '1', 
    username: 'jean_d', 
    fullName: 'Jean Dupont', 
    depositAmount: 150000, 
    joinedDate: '2023-10-01',
    email: 'jean.dupont@example.com',
    phoneNumber: '+225 07 01 02 03',
    address: 'Abidjan, Cocody',
    status: 'active',
    loanEligible: true
  },
  { 
    id: '2', 
    username: 'marie_k', 
    fullName: 'Marie Koné', 
    depositAmount: 75000, 
    joinedDate: '2023-11-15',
    email: 'marie.kone@example.com',
    phoneNumber: '+225 05 04 05 06',
    address: 'Bouaké, Centre',
    status: 'active',
    loanEligible: false
  },
  { 
    id: '3', 
    username: 'paul_b', 
    fullName: 'Paul Biya', 
    depositAmount: 300000, 
    joinedDate: '2024-01-20',
    email: 'paul.biya@example.com',
    phoneNumber: '+237 6 99 99 99',
    address: 'Yaoundé, Bastos',
    status: 'active',
    loanEligible: true
  },
];

let groups: Group[] = [
  { id: '1', name: 'Tontine Business A', description: 'Groupe pour les commerçants du marché central.', memberCount: 12, targetAmount: 1000000, createdAt: '2023-09-01', memberIds: ['1', '2'] },
  { id: '2', name: 'Épargne Solidaire', description: 'Micro-crédit pour les petits projets agricoles.', memberCount: 8, targetAmount: 500000, createdAt: '2024-02-10', memberIds: ['3'] },
];

let transactions: Transaction[] = [
  { id: 'TRX-001', userId: '1', userFullName: 'Jean Dupont', type: 'deposit', amount: 50000, status: 'success', date: '2024-03-10 10:00', reason: 'Dépôt initial' },
  { id: 'TRX-002', userId: '2', userFullName: 'Marie Koné', type: 'withdrawal', amount: 20000, status: 'success', date: '2024-03-11 14:30' },
  { id: 'TRX-003', userId: '3', userFullName: 'Paul Biya', type: 'deposit', amount: 100000, status: 'failed', date: '2024-03-12 09:15', reason: 'Fonds insuffisants sur le moyen de paiement' },
  { id: 'TRX-004', userId: '1', userFullName: 'Jean Dupont', type: 'withdrawal', amount: 500000, status: 'failed', date: '2024-03-13 11:20', reason: 'Solde disponible insuffisant' },
  { id: 'TRX-005', userId: '2', userFullName: 'Marie Koné', type: 'deposit', amount: 25000, status: 'success', date: '2024-03-14 08:45' },
  { id: 'TRX-006', userId: '3', userFullName: 'Paul Biya', type: 'withdrawal', amount: 10000, status: 'success', date: '2024-03-15 16:00' },
  { id: 'TRX-007', userId: '1', userFullName: 'Jean Dupont', type: 'loan_eligibility', amount: 0, status: 'success', date: '2024-03-16 09:00', reason: 'Éligibilité activée par Admin' },
];

let messages: Message[] = [
  { id: 'msg-1', groupId: '1', userId: '1', senderName: 'Jean Dupont', content: 'Bonjour à tous, quand est prévu le prochain tour ?', timestamp: '2024-03-14 09:30', isAdmin: false },
  { id: 'msg-2', groupId: '1', userId: '2', senderName: 'Marie Koné', content: 'Salut Jean, je pense que c\'est le 25 du mois.', timestamp: '2024-03-14 09:45', isAdmin: false },
  { id: 'msg-3', groupId: '1', userId: 'admin', senderName: 'Administrateur', content: 'Exactement, le tirage aura lieu le 25 à 14h.', timestamp: '2024-03-14 10:00', isAdmin: true },
];

let adminProfile: AdminProfile = {
  username: 'admin',
  email: 'admin@mosolocoop.com',
  fullName: 'Administrateur Principal',
  role: 'admin'
};

export const MockService = {
  // User Logic
  getUsers: () => [...users],
  getUserTransactions: (userId: string) => {
    return transactions.filter(t => t.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
  },
  addUser: (user: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      email: `${user.username}@mosolocoop.com`, // Fake default email
      address: 'Non renseigné',
      phoneNumber: 'Non renseigné',
      loanEligible: false
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
      id: Math.random().toString(36).substr(2, 9),
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

  getGlobalStats: () => {
    const totalUsers = users.length;
    const totalGroups = groups.length;
    const eligibleUsersCount = users.filter(u => u.loanEligible).length;
    
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

    return {
      totalUsers,
      totalGroups,
      totalDepositsValue,
      totalWithdrawalsValue,
      totalTransactions,
      successRate,
      topDepositors,
      growthData,
      eligibleUsersCount
    };
  },

  // Admin Logic
  getAdminProfile: () => ({ ...adminProfile }),
  updateAdminProfile: (updates: Partial<AdminProfile>) => {
    adminProfile = { ...adminProfile, ...updates };
    return adminProfile;
  }
};