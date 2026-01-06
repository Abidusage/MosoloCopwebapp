import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, CheckCircle, X } from 'lucide-react';
import { User } from '../types';

type Props = {
  users: User[];
  value?: string; // selected user id
  onChange?: (id: string) => void; // update selection
  onSelect?: (id: string) => void; // immediate select (e.g. inline add)
  placeholder?: string;
  allowImmediateSelect?: boolean; // if true, click triggers onSelect, otherwise it only updates value
  className?: string;
};

const MemberSelector: React.FC<Props> = ({ users, value, onChange, onSelect, placeholder = 'Rechercher par nom ou ID...', allowImmediateSelect = false, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // clear selection if the selected id no longer exists in the provided users
    if (value && !users.find(u => u.id === value) && onChange) {
      onChange('');
    }
  }, [users, value, onChange]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => u.fullName.toLowerCase().includes(term) || u.id.toLowerCase().includes(term));
  }, [users, searchTerm]);

  return (
    <div className={`relative ${className}`}>
      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 hover:bg-white transition-all shadow-sm font-medium"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {searchTerm !== '' && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto border border-gray-100 rounded-xl divide-y bg-white shadow-xl z-10 animate-in slide-in-from-top-2 duration-200">
          {filtered.map(user => (
            <div
              key={user.id}
              onClick={() => {
                if (allowImmediateSelect && onSelect) {
                  onSelect(user.id);
                } else if (onChange) {
                  onChange(user.id);
                }
              }}
              className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-indigo-50 transition-colors group ${value === user.id ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs group-hover:bg-white transition-colors">{user.fullName.charAt(0)}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-900">{user.fullName}</p>
                <p className="text-[10px] text-gray-500 font-mono">{user.id}</p>
              </div>
              {value === user.id ? (
                <CheckCircle className="h-4 w-4 text-blue-600" />
              ) : (
                <Plus className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">Aucun utilisateur trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberSelector;
