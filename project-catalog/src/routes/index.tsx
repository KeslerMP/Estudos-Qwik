/**
 * Home Page - Listagem de Itens
 * 
 * Página principal que exibe a listagem paginada de itens com busca.
 * Usa useVisibleTask$ para carregar dados do Supabase no lado do cliente.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { getItems, type Item } from '~/lib/supabase/catalog';
import { ItemCard } from '~/components/item-card/item-card';
import { SearchBar } from '~/components/search-bar/search-bar';
import { Pagination } from '~/components/pagination/pagination';
import { Toast, type ToastMessage } from '~/components/toast/toast';

export default component$(() => {
  const nav = useNavigate();

  // Estado
  const items = useSignal<Item[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const currentPage = useSignal(1);
  const totalPages = useSignal(1);
  const searchTerm = useSignal('');
  const toast = useSignal<ToastMessage | null>(null);

  const PAGE_SIZE = 9;

  // Carrega itens quando o componente é montado ou quando a página/busca muda
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => currentPage.value);
    track(() => searchTerm.value);

    // Carrega itens do Supabase
    (async () => {
      loading.value = true;
      error.value = null;

      const { data, count, error: err } = await getItems(
        currentPage.value - 1,
        PAGE_SIZE,
        searchTerm.value
      );

      if (err) {
        error.value = err;
        toast.value = { message: 'Erro ao carregar itens', type: 'error' };
      } else {
        items.value = data;
        totalPages.value = Math.ceil(count / PAGE_SIZE);
      }

      loading.value = false;
    })();
  });

  return (
    <>
      <Toast toast={toast} />

      <div class="space-y-6">
        {/* Header da Página */}
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Catálogo de Produtos</h1>
            <p class="mt-2 text-gray-600">
              Gerencie seus produtos de forma simples e eficiente
            </p>
          </div>
        </div>

        {/* Barra de Busca */}
        <SearchBar
          onSearch$={(term: string) => {
            searchTerm.value = term;
            currentPage.value = 1; // Reset para primeira página ao buscar
          }}
        />

        {/* Loading State */}
        {loading.value && (
          <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error.value && !loading.value && (
          <div class="card bg-red-50 border border-red-200">
            <p class="text-red-800">
              <strong>Erro:</strong> {error.value}
            </p>
            <p class="text-sm text-red-600 mt-2">
              Verifique se as variáveis de ambiente do Supabase estão configuradas corretamente.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading.value && !error.value && items.value.length === 0 && (
          <div class="card text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p class="text-gray-600 mb-6">
              {searchTerm.value
                ? 'Tente buscar com outros termos'
                : 'Comece adicionando seu primeiro produto'}
            </p>
            {!searchTerm.value && (
              <button class="btn btn-primary" onClick$={() => nav('/new')}>
                + Adicionar Produto
              </button>
            )}
          </div>
        )}

        {/* Grid de Itens */}
        {!loading.value && !error.value && items.value.length > 0 && (
          <>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.value.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit$={(id: string) => nav(`/edit/${id}`)}
                  onDelete$={(id: string) => nav(`/delete/${id}`)}
                />
              ))}
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage.value}
              totalPages={totalPages.value}
              onPageChange$={(page: number) => {
                currentPage.value = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Catálogo de Produtos',
  meta: [
    {
      name: 'description',
      content: 'Sistema de catálogo de produtos com Qwik e Supabase',
    },
  ],
};
