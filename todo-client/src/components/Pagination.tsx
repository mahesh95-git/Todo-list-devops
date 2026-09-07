import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationMeta } from '../types/todo';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { total, page, limit, pages } = meta;

  if (pages <= 1 && total <= limit) {
    return (
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 px-2">
        <span>Showing all {total} task{total === 1 ? '' : 's'}</span>
      </div>
    );
  }

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxVisible = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(pages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 sm:px-4 text-xs text-slate-400">
      {/* Information */}
      <div>
        Showing <span className="font-semibold text-slate-200">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-200">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-200">{total}</span> tasks
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          title="First page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Number buttons */}
        <div className="flex items-center space-x-1 px-1">
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                p === page
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(pages)}
          disabled={page >= pages}
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          title="Last page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
