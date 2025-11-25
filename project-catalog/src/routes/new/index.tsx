/**
 * New Item Page - Criar Novo Item
 * 
 * Página para criar um novo item no catálogo.
 */

import { component$, useSignal } from '@builder.io/qwik';
import { useNavigate, type DocumentHead } from '@builder.io/qwik-city';
import { createItem, type ItemInsert } from '~/lib/supabase/catalog';
import { ItemForm } from '~/components/item-form/item-form';
import { Toast, type ToastMessage } from '~/components/toast/toast';

export default component$(() => {
  const nav = useNavigate();
  const toast = useSignal<ToastMessage | null>(null);
  const submitting = useSignal(false);

  return (
    <>
      <Toast toast={toast} />

      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Novo Produto</h1>
          <p class="mt-2 text-gray-600">Adicione um novo produto ao catálogo</p>
        </div>

        <div class="card">
          <ItemForm
            onSubmit$={async (data: ItemInsert) => {
              if (submitting.value) return;

              submitting.value = true;
              const { data: item, error } = await createItem(data);

              if (error) {
                toast.value = { message: `Erro ao criar produto: ${error}`, type: 'error' };
                submitting.value = false;
              } else {
                toast.value = { message: 'Produto criado com sucesso!', type: 'success' };
                setTimeout(() => {
                  nav('/');
                }, 1500);
              }
            }}
            onCancel$={() => nav('/')}
            submitLabel="Criar Produto"
          />
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Novo Produto - Catálogo',
  meta: [
    {
      name: 'description',
      content: 'Adicionar novo produto ao catálogo',
    },
  ],
};
