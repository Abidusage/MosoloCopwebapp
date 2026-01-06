import { useEffect, useState, useCallback } from 'react';
import { MockService } from '../services/mockStore';
import { User, Group, Transaction } from '../types';

export function useDashboardData() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [settings, setSettings] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState<number>(0);

  const refreshAll = useCallback(() => {
    setUsers(MockService.getUsers());
    setGroups(MockService.getGroups());
    setTransactions(MockService.getTransactions());
    setAgents(MockService.getAgents());
    setSettings(MockService.getSystemSettings());
    setStats(MockService.getGlobalStats());
    setPendingSubmissionsCount(MockService.getPendingSubmissionsCount());
  }, []);

  useEffect(() => {
    refreshAll();
    setAdminProfile(MockService.getAdminProfile());
  }, [refreshAll]);

  // Helper wrappers for actions used in the dashboard
  const makeDeposit = (userId: string, amount: number, note?: string, paymentMethod?: string) => {
    const ok = MockService.makeDeposit(userId, amount, note, paymentMethod);
    if (ok) refreshAll();
    return ok;
  };

  const toggleTontineBeneficiaryStatus = (userId: string) => {
    const ok = MockService.toggleTontineBeneficiaryStatus(userId);
    if (ok) refreshAll();
    return ok;
  };

  const getGroupMembers = (groupId: string) => {
    return MockService.getGroupMembers(groupId);
  };

  const getUserTransactions = (userId: string) => {
    return MockService.getUserTransactions(userId);
  };

  const updateAdminProfile = (updates: Partial<any>) => {
    const updated = MockService.updateAdminProfile(updates as any);
    // refresh store values
    refreshAll();
    return updated;
  };

  const updateSettings = (newSettings: any) => {
    const updated = MockService.updateSystemSettings(newSettings);
    setSettings(updated);
    refreshAll();
    return updated;
  };

  // Additional helper wrappers for actions used across the dashboard
  const addUser = (user: any) => {
    const ok = MockService.addUser(user);
    if (ok) refreshAll();
    return ok;
  };

  const addGroup = (group: any) => {
    const ok = MockService.addGroup(group);
    if (ok) refreshAll();
    return ok;
  };

  const addAgent = (agent: any) => {
    const ok = MockService.addAgent(agent);
    if (ok) refreshAll();
    return ok;
  };

  const toggleAgentStatus = (agentId: string) => {
    const ok = MockService.toggleAgentStatus(agentId);
    if (ok) refreshAll();
    return ok;
  };

  const resetAgentPassword = (agentId: string, newPassword: string) => {
    const ok = MockService.resetAgentPassword(agentId, newPassword);
    return ok;
  };

  const addMessage = (groupId: string, senderName: string, content: string, isAdmin?: boolean) => {
    MockService.addMessage(groupId, senderName, content, !!isAdmin);
    return MockService.getGroupMessages(groupId);
  };

  const addMemberToGroup = (groupId: string, userId: string) => {
    const ok = MockService.addMemberToGroup(groupId, userId);
    if (ok) refreshAll();
    return ok;
  };

  const removeMemberFromGroup = (groupId: string, userId: string) => {
    const ok = MockService.removeMemberFromGroup(groupId, userId);
    if (ok) refreshAll();
    return ok;
  };

  const updateGroup = (groupId: string, updates: Partial<any>) => {
    const ok = MockService.updateGroup(groupId, updates);
    if (ok) refreshAll();
    return ok;
  };

  const deleteGroup = (groupId: string) => {
    const ok = MockService.deleteGroup(groupId);
    if (ok) refreshAll();
    return ok;
  };

  const getAgentSubmissions = (agentId: string) => {
    return MockService.getAgentSubmissions(agentId);
  };

  const toggleLoanEligibility = (userId: string) => {
    const ok = MockService.toggleLoanEligibility(userId);
    if (ok) refreshAll();
    return ok;
  };

  const toggleUserStatus = (userId: string) => {
    const ok = MockService.toggleUserStatus(userId);
    if (ok) refreshAll();
    return ok;
  };

  const getKYCDocumentsForUser = (userId: string) => {
    return MockService.getKYCDocumentsForUser(userId);
  };

  const updateKYCStatus = (userId: string, status: any, reason?: string) => {
    const ok = MockService.updateKYCStatus(userId, status, reason);
    if (ok) refreshAll();
    return ok;
  };

  const resetUserPassword = (userId: string, newPassword: string) => {
    const ok = MockService.resetUserPassword(userId, newPassword);
    return ok;
  };

  const updateTransactionStatus = (transactionId: string, status: any, reason?: string) => {
    const ok = MockService.updateTransactionStatus(transactionId, status, reason);
    if (ok) refreshAll();
    return ok;
  };

  const addPenalty = (penalty: any) => {
    const p = MockService.addPenalty(penalty);
    refreshAll();
    return p;
  };

  const resolvePenalty = (penaltyId: string, resolvedBy: string) => {
    const ok = MockService.resolvePenalty(penaltyId, resolvedBy);
    if (ok) refreshAll();
    return ok;
  };

  const getPenalties = () => MockService.getPenalties();

  const getKYCSubmissions = () => MockService.getKYCSubmissions();

  const getAdminDeposits = () => MockService.getAdminDeposits();

  const getGroupMessages = (groupId: string) => MockService.getGroupMessages(groupId);

  const getTotalDeposits = () => MockService.getTotalDeposits();

  return {
    users,
    groups,
    transactions,
    adminProfile,
    agents,
    settings,
    stats,
    pendingSubmissionsCount,
    refreshAll,
    makeDeposit,
    toggleTontineBeneficiaryStatus,
    getGroupMembers,
    getUserTransactions
    ,
    // expose setters/actions needed by the dashboard UI
    setSettings,
    updateAdminProfile,
    updateSettings,
    // additional wrappers
    addUser,
    addGroup,
    addAgent,
    toggleAgentStatus,
    resetAgentPassword,
    addMessage,
    addMemberToGroup,
    removeMemberFromGroup,
    updateGroup,
    deleteGroup,
    getAgentSubmissions,
    toggleLoanEligibility,
    toggleUserStatus,
    getKYCDocumentsForUser,
    updateKYCStatus,
    resetUserPassword,
    updateTransactionStatus,
    addPenalty,
    resolvePenalty,
    getPenalties,
    getKYCSubmissions,
    getAdminDeposits,
    getGroupMessages,
    getTotalDeposits
  } as const;
}
