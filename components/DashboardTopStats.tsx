import React from 'react';
import { DollarSign, Users, Layers, Banknote, Bell } from 'lucide-react';

type Props = {
  totalDeposits: number;
  usersCount: number;
  groupsCount: number;
  adminDepositsAmount: number;
  pendingCount: number;
};

const DashboardTopStats: React.FC<Props> = ({ totalDeposits, usersCount, groupsCount, adminDepositsAmount, pendingCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
          <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Solde Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalDeposits.toLocaleString()} <span className="text-sm font-normal text-gray-500">FC</span></p>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
          <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Clients Actifs</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{usersCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-3 sm:p-4 bg-gray-200 rounded-lg">
          <Layers className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Groupes Tontine</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{groupsCount}</p>
        </div>
      </div>

      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
        <div className="p-3 sm:p-4 bg-blue-100 rounded-lg">
          <Banknote className="h-6 w-6 sm:h-8 sm:w-8 text-blue-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Dépôts Admin</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{adminDepositsAmount.toLocaleString()} <span className="text-sm font-normal text-gray-500">FC</span></p>
        </div>
      </div>

      {/* Optional small pending card placed below on smaller screens via grid */}
      <div className="hidden lg:block" />
      <div className="hidden lg:block" />

      <div className="col-span-full sm:col-span-2 lg:col-span-1">
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 sm:p-4 bg-yellow-100 rounded-lg relative">
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-700" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">En Attente</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              {pendingCount}
              <span className="text-xs font-normal text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">Actions requises</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopStats;
