/**
 * Edit Item Page - Editar Item
 * 
 * Página para editar um item existente.
 * Usa parâmetro de rota [id] para identificar o item.
 */

import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useNavigate, useLocation, type DocumentHead } from '@builder.io/qwik-city';
import { getItemById, updateItem, type Item, type ItemUpdate } from '~/lib/supabase/catalog';
import { ItemForm } from '~/components/item-form/item-form';
import { Toast, type ToastMessage } from '~/components/toast/toast';

export default component$(() => {
  const nav = useNavigate();
  const loc = useLocation();
  const id = loc.params.id;

  const item = useSignal<Item | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const toast = useSignal<ToastMessage | null>(null);
  const submitting = useSignal(false);

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

  return (
    <>
      <Toast toast={toast} />

      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Editar Produto</h1>
          <p class="mt-2 text-gray-600">Atualize as informações do produto</p>
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

        {/* Form */}
        {item.value && !loading.value && !error.value && (
          <div class="card">
            <ItemForm
              initialData={{
                name: item.value.name,
                description: item.value.description,
                price: item.value.price,
              }}
              onSubmit$={async (data: ItemUpdate) => {
                if (submitting.value) return;

                submitting.value = true;
                const { error: err } = await updateItem(id, data);

                if (err) {
                  toast.value = { message: `Erro ao atualizar produto: ${err}`, type: 'error' };
                  submitting.value = false;
                } else {
                  toast.value = { message: 'Produto atualizado com sucesso!', type: 'success' };
                  setTimeout(() => {
                    nav('/');
                  }, 1500);
                }
              }}
              onCancel$={() => nav('/')}
              submitLabel="Salvar Alterações"
            />
          </div>
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Editar Produto - Catálogo',
  meta: [
    {
      name: 'description',
      content: 'Editar produto do catálogo',
    },
  ],
};
