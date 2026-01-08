import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Transaction, User } from '../types';

type Props = {
  transactions: Transaction[];
  users: User[];
};

const DailyContributionsPanel: React.FC<Props> = ({ transactions, users }) => {
  const [expandedSections, setExpandedSections] = useState({
    todayContributed: true,
    todayMissed: true,
    tomorrowMissed: true,
    weeklyMissed: true,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Get transactions from today
  const todayTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      txDate.setHours(0, 0, 0, 0);
      return (
        txDate.getTime() === today.getTime() &&
        (tx.type === 'deposit' || tx.type === 'status_change') &&
        tx.status === 'success'
      );
    });
  }, [transactions, today]);

  // Group today's contributions by client and sum amounts
  const todayContributedByClient = useMemo(() => {
    const map = new Map<string, { name: string; total: number; count: number }>();
    todayTransactions.forEach((tx) => {
      if (!map.has(tx.userId)) {
        map.set(tx.userId, { name: tx.userFullName, total: 0, count: 0 });
      }
      const entry = map.get(tx.userId)!;
      entry.total += tx.amount;
      entry.count += 1;
    });
    return Array.from(map.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.total - a.total);
  }, [todayTransactions]);

  const todayTotalAmount = useMemo(() => {
    return todayContributedByClient.reduce((sum, item) => sum + item.total, 0);
  }, [todayContributedByClient]);

  // Get users who haven't paid today
  const usersWhoContributedToday = new Set(
    todayContributedByClient.map((item) => item.userId)
  );
  const usersMissedToday = useMemo(() => {
    return users
      .filter((user) => !usersWhoContributedToday.has(user.id) && user.status === 'active')
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [users, usersWhoContributedToday]);

  // Get users who might miss by tomorrow
  const usersMissedTomorrow = useMemo(() => {
    return usersMissedToday; // Same list but labeled differently
  }, [usersMissedToday]);

  // Get users who might miss this week
  const usersMissedThisWeek = useMemo(() => {
    return users
      .filter((user) => !usersWhoContributedToday.has(user.id) && user.status === 'active')
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [users, usersWhoContributedToday]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Today's Contributors Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('todayContributed')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">Contributeurs d'Aujourd'hui</h3>
              <p className="text-sm text-gray-500">
                {todayContributedByClient.length} client(s) - {todayTotalAmount.toLocaleString()} FC
              </p>
            </div>
          </div>
          {expandedSections.todayContributed ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.todayContributed && (
          <div className="border-t border-gray-100 bg-gray-50">
            {todayContributedByClient.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {todayContributedByClient.map((item) => (
                  <div
                    key={item.userId}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.count} {item.count > 1 ? 'contributions' : 'contribution'}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">{item.total.toLocaleString()} FC</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Aucune contribution aujourd'hui</p>
              </div>
            )}

            {todayContributedByClient.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-green-50">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total journalier</span>
                  <span className="text-lg font-bold text-green-600">
                    {todayTotalAmount.toLocaleString()} FC
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users who missed today */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('todayMissed')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">N'ont pas Contribué Aujourd'hui</h3>
              <p className="text-sm text-gray-500">{usersMissedToday.length} client(s)</p>
            </div>
          </div>
          {expandedSections.todayMissed ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.todayMissed && (
          <div className="border-t border-gray-100 bg-gray-50">
            {usersMissedToday.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {usersMissedToday.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                      <AlertCircle className="h-3 w-3" /> En attente
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Tous les clients ont contribué aujourd'hui ✓</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users who might miss by tomorrow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('tomorrowMissed')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-orange-600" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">À Risque pour Demain</h3>
              <p className="text-sm text-gray-500">
                {usersMissedTomorrow.length} client(s) qui n'ont pas encore payé
              </p>
            </div>
          </div>
          {expandedSections.tomorrowMissed ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.tomorrowMissed && (
          <div className="border-t border-gray-100 bg-gray-50">
            {usersMissedTomorrow.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {usersMissedTomorrow.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-orange-700">À relancer</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Pas de risque pour demain</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users who might miss this week */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <button
          onClick={() => toggleSection('weeklyMissed')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-800">À Risque cette Semaine</h3>
              <p className="text-sm text-gray-500">
                {usersMissedThisWeek.length} client(s) qui n'ont pas encore payé
              </p>
            </div>
          </div>
          {expandedSections.weeklyMissed ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {expandedSections.weeklyMissed && (
          <div className="border-t border-gray-100 bg-gray-50">
            {usersMissedThisWeek.length > 0 ? (
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {usersMissedThisWeek.map((user) => (
                  <div
                    key={user.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-bold text-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-yellow-700">Action requise</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Pas de risque cette semaine</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyContributionsPanel;
