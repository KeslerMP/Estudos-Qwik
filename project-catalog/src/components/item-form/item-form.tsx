/**
 * ItemForm Component
 * 
 * Formulário reutilizável para criar e editar itens.
 * Inclui validação de campos e feedback visual.
 */

import { component$, useSignal, type QRL } from '@builder.io/qwik';
import type { ItemInsert } from '~/lib/supabase/catalog';

interface ItemFormProps {
  initialData?: ItemInsert;
  onSubmit$: QRL<(data: ItemInsert) => void>;
  onCancel$: QRL<() => void>;
  submitLabel?: string;
}

export const ItemForm = component$<ItemFormProps>(
  ({ initialData, onSubmit$, onCancel$, submitLabel = 'Salvar' }) => {
    const name = useSignal(initialData?.name || '');
    const description = useSignal(initialData?.description || '');
    const price = useSignal(initialData?.price?.toString() || '');
    const errors = useSignal<Record<string, string>>({});

    return (
      <form
        class="space-y-6"
        preventdefault:submit
        onSubmit$={() => {
          // Validação inline
          const newErrors: Record<string, string> = {};

          if (!name.value.trim()) {
            newErrors.name = 'Nome é obrigatório';
          } else if (name.value.trim().length < 3) {
            newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
          }

          if (!description.value.trim()) {
            newErrors.description = 'Descrição é obrigatória';
          }

          if (!price.value.trim()) {
            newErrors.price = 'Preço é obrigatório';
          } else {
            const priceNum = parseFloat(price.value);
            if (isNaN(priceNum) || priceNum < 0) {
              newErrors.price = 'Preço deve ser um número válido e positivo';
            }
          }

          errors.value = newErrors;

          // Se não houver erros, submete o formulário
          if (Object.keys(newErrors).length === 0) {
            onSubmit$({
              name: name.value.trim(),
              description: description.value.trim(),
              price: parseFloat(price.value),
            });
          }
        }}
      >
        {/* Campo Nome */}
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nome do Produto *
          </label>
          <input
            id="name"
            type="text"
            class={`input ${errors.value.name ? 'border-red-500' : ''}`}
            value={name.value}
            onInput$={(e) => (name.value = (e.target as HTMLInputElement).value)}
            placeholder="Ex: Notebook Dell"
          />
          {errors.value.name && (
            <p class="mt-1 text-sm text-red-600">{errors.value.name}</p>
          )}
        </div>

        {/* Campo Descrição */}
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            id="description"
            rows={4}
            class={`input ${errors.value.description ? 'border-red-500' : ''}`}
            value={description.value}
            onInput$={(e) => (description.value = (e.target as HTMLTextAreaElement).value)}
            placeholder="Descreva o produto..."
          />
          {errors.value.description && (
            <p class="mt-1 text-sm text-red-600">{errors.value.description}</p>
          )}
        </div>

        {/* Campo Preço */}
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
            Preço (R$) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            class={`input ${errors.value.price ? 'border-red-500' : ''}`}
            value={price.value}
            onInput$={(e) => (price.value = (e.target as HTMLInputElement).value)}
            placeholder="0.00"
          />
          {errors.value.price && <p class="mt-1 text-sm text-red-600">{errors.value.price}</p>}
        </div>

        {/* Botões */}
        <div class="flex gap-4 justify-end">
          <button type="button" class="btn btn-secondary" onClick$={onCancel$}>
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    );
  }
);
