
export interface User {
  id: string;
  username: string;
  password?: string; // Optional in list view for security
  fullName: string;
  depositAmount: number;
  joinedDate: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'suspended';
  loanEligible?: boolean; // Indicateur d'éligibilité au prêt
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  targetAmount: number;
  createdAt: string;
  memberIds?: string[]; // Liste des IDs des membres du groupe
}

export interface AdminProfile {
  username: string;
  email: string;
  fullName: string;
  role: 'admin';
}

export type TransactionStatus = 'success' | 'failed';
export type TransactionType = 'deposit' | 'withdrawal' | 'loan_eligibility';

export interface Transaction {
  id: string;
  userId: string;
  userFullName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  reason?: string; // Raison de l'échec ou note
}

export interface Message {
  id: string;
  groupId: string;
  userId: string; // 'admin' ou ID utilisateur
  senderName: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

export type DashboardView = 'overview' | 'users' | 'groups' | 'profile' | 'transactions' | 'statistics';