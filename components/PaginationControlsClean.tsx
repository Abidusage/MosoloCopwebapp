import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  className?: string;
  label?: string;
};

const PaginationControlsClean: React.FC<Props> = ({ currentPage, perPage, totalItems, onPageChange, showPageNumbers = true, className = '', label = 'Affichage de' }) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalItems);

  return (
    <div className={`bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between ${className}`}>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {label} <span className="font-medium">{from}</span> à <span className="font-medium">{to}</span> sur <span className="font-medium">{totalItems}</span> résultats
          </p>
        </div>
        <div>
          {showPageNumbers ? (
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Précédent</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => onPageChange(number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number ? 'z-10 bg-gray-100 border-gray-500 text-gray-700' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <span className="sr-only">Suivant</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          ) : null}
        </div>
      </div>

      {/* Mobile simplified */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Précédent
        </button>
        <span className="text-sm text-gray-700">Page {currentPage} / {totalPages}</span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PaginationControlsClean;
