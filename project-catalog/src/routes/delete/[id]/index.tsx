/**
 * Delete Item Page - Confirmar Exclusão
 * 
 * Página para confirmar a exclusão de um item.
 * Usa parâmetro de rota [id] para identificar o item.
 */

import { component$, useSignal, useVisibleTask$, $ } from '@builder.io/qwik';
import { useNavigate, useLocation, type DocumentHead } from '@builder.io/qwik-city';
import { getItemById, deleteItem, type Item } from '~/lib/supabase/catalog';
import { Toast, type ToastMessage } from '~/components/toast/toast';

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const id = loc.params.id;

  const item = useSignal<Item | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const toast = useSignal<ToastMessage | null>(null);
  const deleting = useSignal(false);

  // Carrega o item ao montar o componente
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const { data, error: err } = await getItemById(id);

    if (err) {
      error.value = err;
      toast.value = { message: 'Erro ao carregar produto', type: 'error' };
    } else if (!data) {
      error.value = 'Produto não encontrado';
      toast.value = { message: 'Produto não encontrado', type: 'error' };
    } else {
      item.value = data;
    }

    loading.value = false;
  });

  const handleDelete = $(async () => {
    if (deleting.value) return;

    deleting.value = true;
    const { error: err } = await deleteItem(id);

    if (err) {
      toast.value = { message: `Erro ao excluir produto: ${err}`, type: 'error' };
      deleting.value = false;
    } else {
      toast.value = { message: 'Produto excluído com sucesso!', type: 'success' };
      setTimeout(() => {
        nav('/');
      }, 1500);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <>
      <Toast toast={toast} />

      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Excluir Produto</h1>
          <p class="mt-2 text-gray-600">Confirme a exclusão do produto</p>
        </div>

        {/* Loading State */}
        {loading.value && (
          <div class="card">
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error.value && !loading.value && (
          <div class="card bg-red-50 border border-red-200">
            <p class="text-red-800">
              <strong>Erro:</strong> {error.value}
            </p>
            <button class="btn btn-secondary mt-4" onClick$={() => nav('/')}>
              Voltar para Listagem
            </button>
          </div>
        )}

        {/* Confirmation */}
        {item.value && !loading.value && !error.value && (
          <div class="card">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div class="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 class="font-semibold text-yellow-800">Atenção!</h3>
                  <p class="text-sm text-yellow-700 mt-1">
                    Esta ação não pode ser desfeita. O produto será permanentemente removido do
                    catálogo.
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalhes do Produto</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nome</dt>
                  <dd class="mt-1 text-base text-gray-900">{item.value.name}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Descrição</dt>
                  <dd class="mt-1 text-base text-gray-900">{item.value.description}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Preço</dt>
                  <dd class="mt-1 text-base text-gray-900 font-semibold">
                    {formatPrice(item.value.price)}
                  </dd>
                </div>
              </dl>
            </div>

            <div class="flex gap-4 justify-end">
              <button
                type="button"
                class="btn btn-secondary"
                onClick$={() => nav('/')}
                disabled={deleting.value}
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick$={handleDelete}
                disabled={deleting.value}
              >
                {deleting.value ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Excluir Produto - Catálogo',
  meta: [
    {
      name: 'description',
      content: 'Confirmar exclusão de produto',
    },
  ],
};
