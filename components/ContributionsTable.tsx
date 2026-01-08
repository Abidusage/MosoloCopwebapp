import React, { useMemo, useState } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, History, Banknote, CheckCircle, AlertCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';
import { Transaction } from '../types';

type Props = {
  transactions: Transaction[];
  title?: string;
  showStats?: boolean;
};

const ContributionsTable: React.FC<Props> = ({ transactions, title = 'Historique des Contributions', showStats = false }) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const filtered = useMemo(() => {
    return transactions.filter(tx =>
      tx.userFullName.toLowerCase().includes(search.toLowerCase()) ||
      tx.amount.toString().includes(search)
    );
  }, [transactions, search]);

  const totalSuccessAmount = useMemo(() => {
    return transactions.filter(t => t.status === 'success').reduce((s, t) => s + t.amount, 0);
  }, [transactions]);

  // Calculate date-based statistics
  const { todayTotal, yesterdayTotal, weekTotal, dailyBreakdown } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)

    let todaySum = 0;
    let yesterdaySum = 0;
    let weekSum = 0;
    const dailyMap: Record<string, { date: Date; total: number; dayName: string }> = {};

    const successTransactions = transactions.filter(t => t.status === 'success');

    successTransactions.forEach(tx => {
      const txDate = new Date(tx.date.split(' ')[0]);
      const txDateOnly = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());

      // Today's total
      if (txDateOnly.getTime() === today.getTime()) {
        todaySum += tx.amount;
      }

      // Yesterday's total
      if (txDateOnly.getTime() === yesterday.getTime()) {
        yesterdaySum += tx.amount;
      }

      // This week's total
      if (txDateOnly >= weekStart && txDateOnly <= today) {
        weekSum += tx.amount;
      }

      // Daily breakdown for this week
      if (txDateOnly >= weekStart && txDateOnly <= today) {
        const dateKey = txDateOnly.toISOString().split('T')[0];
        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { date: txDateOnly, total: 0, dayName: dayNames[txDateOnly.getDay()] };
        }
        dailyMap[dateKey].total += tx.amount;
      }
    });

    // Sort daily breakdown by date
    const dailyBreakdownArray = Object.values(dailyMap).sort((a, b) => b.date.getTime() - a.date.getTime());

    return { todayTotal: todaySum, yesterdayTotal: yesterdaySum, weekTotal: weekSum, dailyBreakdown: dailyBreakdownArray };
  }, [transactions]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === 'date') {
        return sortDirection === 'asc' ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortKey === 'userFullName') {
        return sortDirection === 'asc' ? a.userFullName.localeCompare(b.userFullName) : b.userFullName.localeCompare(a.userFullName);
      }
      if (sortKey === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));

  const displayed = useMemo(() => {
    const start = (page - 1) * perPage;
    return sorted.slice(start, start + perPage);
  }, [sorted, page, perPage]);

  // helpers
  const toggleSortDirection = () => setSortDirection(d => d === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Banknote className="h-6 w-6 text-gray-700" /> {title}
        </h3>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une contribution..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as keyof Transaction)} className="p-2 border rounded text-sm bg-white">
              <option value="date">Date</option>
              <option value="userFullName">Client</option>
              <option value="amount">Montant</option>
            </select>

            <button onClick={toggleSortDirection} className="p-2 border rounded bg-white hover:bg-gray-50" title="Inverser l'ordre de tri">
              {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </button>

            <select value={perPage} onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }} className="p-2 border rounded text-sm bg-white" title="Nombre de résultats par page">
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="space-y-4">
          {/* Summary Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Today's Total */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Aujourd'hui</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{todayTotal.toLocaleString()} <span className="text-sm font-medium">FC</span></p>
            </div>

            {/* Yesterday's Total */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-amber-100 p-1.5 rounded-lg">
                  <Calendar className="h-4 w-4 text-amber-600" />
                </div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Hier</span>
              </div>
              <p className="text-2xl font-bold text-amber-900">{yesterdayTotal.toLocaleString()} <span className="text-sm font-medium">FC</span></p>
            </div>

            {/* This Week's Total */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-violet-100 p-1.5 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                </div>
                <span className="text-xs font-semibold text-violet-700 uppercase tracking-wide">Cette Semaine</span>
              </div>
              <p className="text-2xl font-bold text-violet-900">{weekTotal.toLocaleString()} <span className="text-sm font-medium">FC</span></p>
            </div>

            {/* Grand Total */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Banknote className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Total Général</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{totalSuccessAmount.toLocaleString()} <span className="text-sm font-medium">FC</span></p>
            </div>
          </div>

          {/* Daily Breakdown for this week */}
          {dailyBreakdown.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Détail des Contributions de la Semaine
                </h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {dailyBreakdown.map((day, index) => (
                    <div
                      key={index}
                      className={`text-center p-3 rounded-lg border transition-all ${index === 0
                        ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${index === 0 ? 'text-emerald-600' : 'text-gray-500'}`}>
                        {day.dayName}
                      </p>
                      <p className="text-[10px] text-gray-400 mb-2">
                        {day.date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </p>
                      <p className={`text-sm font-bold ${index === 0 ? 'text-emerald-700' : 'text-gray-800'}`}>
                        {day.total.toLocaleString()} FC
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Heure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayed.length > 0 ? (
                displayed.map(tx => (
                  <tr key={tx.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 text-xs">{tx.userFullName.charAt(0)}</div>
                        <span className="text-sm font-medium text-gray-900">{tx.userFullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date.split(' ')[0]}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{tx.date.split(' ')[1] || '--:--'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.status === 'success' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100"><CheckCircle className="h-3.5 w-3.5" /> Payé</span>
                      ) : tx.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100"><AlertCircle className="h-3.5 w-3.5" /> En attente</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100"><XCircle className="h-3.5 w-3.5" /> Échec</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">{tx.amount.toLocaleString()} FC</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <History className="h-12 w-12 text-gray-300 mb-2" />
                      <p>Aucune contribution trouvée.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {displayed.length > 0 && (
              <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right text-sm font-semibold text-blue-800 uppercase tracking-wide">
                    Montant Total des Contributions
                  </td>
                  <td className="px-6 py-4 text-right text-lg font-bold text-blue-900">
                    {totalSuccessAmount.toLocaleString()} FC
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {sorted.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">Affichage de <span className="font-medium">{Math.min(sorted.length, (page - 1) * perPage + 1)}</span> à <span className="font-medium">{Math.min(sorted.length, page * perPage)}</span> sur <span className="font-medium">{sorted.length}</span> résultats</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="h-4 w-4 text-gray-600" /></button>
              <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-center">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ChevronRight className="h-4 w-4 text-gray-600" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionsTable;
