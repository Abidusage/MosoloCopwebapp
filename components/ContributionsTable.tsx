import React, { useMemo, useState } from 'react';
import { Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, History, Banknote, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">Solde total de tout le Montant Contribué</p>
              <p className="text-3xl font-bold text-blue-900">{totalSuccessAmount.toLocaleString()} FC</p>
            </div>
            <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
              <Banknote className="h-8 w-8" />
            </div>
          </div>
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
