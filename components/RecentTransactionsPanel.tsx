import React from 'react';
import { Activity, ArrowUpRight, Shield, RefreshCcw, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../types';

type Props = {
  transactions: Transaction[];
  limit?: number;
  onVoirTout?: () => void;
};

const RecentTransactionsPanel: React.FC<Props> = ({ transactions, limit = 5, onVoirTout }) => {
  const items = (transactions || []).slice(0, limit);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-gray-500" /> Dernières Transactions
        </h3>
        <button onClick={onVoirTout} className="text-sm text-gray-700 hover:text-gray-800 font-medium">Voir tout</button>
      </div>
      <div className="divide-y divide-gray-100">
        {items.length > 0 ? (
          items.map((tx) => (
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
                  {tx.type === 'loan_eligibility' || tx.type === 'status_change' ? '-' : `${tx.amount.toLocaleString()} FC`}
                </p>
                <span className={`text-[10px] ${tx.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.status === 'success' ? 'Validé' : 'Échoué'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Aucune transaction récente.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactionsPanel;
