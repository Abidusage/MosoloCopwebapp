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
  kycStatus: 'not_submitted' | 'pending' | 'verified' | 'rejected'; // Statut KYC
  kycSubmissionDate?: string; // Date de soumission KYC
  kycVerifiedDate?: string; // Date de vérification KYC
  penalties?: Penalty[]; // Nouveau champ pour les pénalités
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
  phoneNumber?: string; // Nouveau champ
  address?: string;    // Nouveau champ
  profilePictureUrl?: string; // Nouveau champ pour la photo de profil
}

export type TransactionStatus = 'success' | 'failed' | 'pending'; // Added 'pending'
export type TransactionType = 'deposit' | 'withdrawal' | 'loan_eligibility' | 'status_change';

export interface Transaction {
  id: string;
  userId: string;
  userFullName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  reason?: string; // Raison de l'échec ou note
  paymentMethod?: string; // Nouveau champ pour le moyen de paiement
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

export interface SystemSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  defaultCurrency: string;
  loanInterestRate: number; // Pourcentage
  tontineCommission: number; // Pourcentage
  agentCommission: number; // Pourcentage commission agents
  withdrawalFeeRate: number; // Nouveau: Pourcentage de frais de retrait
  minPasswordLength: number;
  enableTwoFactor: boolean;
  emailNotifications: boolean;
}

// Nouveaux types pour les Agents/Partenaires
export interface Agent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  zone: string; // Zone géographique (ex: Marché Adjamé)
  status: 'active' | 'inactive';
  totalFormsSubmitted: number;
  joinedDate: string;
  profilePictureUrl?: string; // Added for agents
  password?: string; // Added for agents
}

export interface FieldSubmission {
  id: string;
  agentId: string;
  agentName: string; // Nom de l'agent qui a envoyé le formulaire
  clientName: string; // Nom du client rencontré
  clientPhone: string;
  type: 'new_registration' | 'daily_collection' | 'loan_request';
  amount?: number; // Montant collecté si applicable
  location: string; // Lieu de la rencontre (GPS ou nom)
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Nouveau type pour les documents KYC
export interface KYCDocument {
  id: string;
  userId: string;
  type: 'id_card' | 'passport' | 'driver_license' | 'proof_of_address';
  documentUrl: string; // URL vers le document (mocké)
  status: 'pending' | 'approved' | 'rejected';
  submissionDate: string;
  reviewDate?: string;
  reviewerId?: string; // ID de l'admin qui a revu
  rejectionReason?: string;
}

// Nouveau type pour les pénalités
export interface Penalty {
  id: string;
  userId: string;
  userFullName: string;
  reason: string; // Ex: 'Non-paiement tontine', 'Retard remboursement crédit'
  amount: number; // Montant de la pénalité
  date: string; // Date à laquelle la pénalité a été appliquée
  status: 'active' | 'resolved'; // Statut de la pénalité
  resolvedDate?: string; // Date de résolution
  resolvedBy?: string; // Admin qui a résolu
}

export type DashboardView = 'overview' | 'users' | 'groups' | 'profile' | 'transactions' | 'statistics' | 'settings' | 'agents' | 'kyc' | 'transaction_management' | 'penalties';