/**
 * SearchBar Component
 * 
 * Barra de busca com debounce para filtrar itens por nome.
 */

import { component$, useSignal, useTask$, type QRL } from '@builder.io/qwik';

interface SearchBarProps {
  onSearch$: QRL<(term: string) => void>;
  placeholder?: string;
}

export const SearchBar = component$<SearchBarProps>(
  ({ onSearch$, placeholder = 'Buscar produtos...' }) => {
    const searchTerm = useSignal('');
    const debouncedTerm = useSignal('');

    // Implementa debounce para evitar muitas chamadas durante a digitação
    useTask$(({ track, cleanup }) => {
      track(() => searchTerm.value);

      const timer = setTimeout(() => {
        debouncedTerm.value = searchTerm.value;
        onSearch$(searchTerm.value);
      }, 300);

      cleanup(() => clearTimeout(timer));
    });

    return (
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          class="input pl-10"
          placeholder={placeholder}
          value={searchTerm.value}
          onInput$={(e) => (searchTerm.value = (e.target as HTMLInputElement).value)}
        />
        {searchTerm.value && (
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick$={() => {
              searchTerm.value = '';
              onSearch$('');
            }}
            aria-label="Limpar busca"
          >
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
