/**
 * Pagination Component
 * 
 * Componente de paginação com navegação entre páginas.
 */

import { component$, type QRL } from '@builder.io/qwik';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange$: QRL<(page: number) => void>;
}

export const Pagination = component$<PaginationProps>(
  ({ currentPage, totalPages, onPageChange$ }) => {
    // Não exibe paginação se houver apenas uma página
    if (totalPages <= 1) {
      return null;
    }

    // Gera array de números de página para exibir
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        // Exibe todas as páginas se forem poucas
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Exibe páginas com reticências
        pages.push(1);

        if (currentPage > 3) {
          pages.push('...');
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          pages.push('...');
        }

        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div class="flex items-center justify-center gap-2 mt-8">
        {/* Botão Anterior */}
        <button
          class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick$={() => onPageChange$(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        {/* Números de Página */}
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={`page-${page}`}
              class={`px-4 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick$={() => onPageChange$(page)}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} class="px-2 text-gray-500">
              {page}
            </span>
          )
        )}

        {/* Botão Próximo */}
        <button
          class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick$={() => onPageChange$(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }
);
