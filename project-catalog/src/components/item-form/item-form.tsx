/**
 * ItemForm Component
 * 
 * Formulário reutilizável para criar e editar itens.
 * Inclui validação de campos e feedback visual.
 */

import { component$, useSignal, type QRL } from '@builder.io/qwik';
import type { ItemInsert } from '~/lib/supabase/catalog';
import { uploadImage, validateImageFile } from '~/lib/supabase/storage';

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
    const imageUrl = useSignal(initialData?.image_url || '');
    const imagePreview = useSignal<string>(initialData?.image_url || '');
    const uploading = useSignal(false);
    const errors = useSignal<Record<string, string>>({});

    return (
      <form
        class="space-y-6"
        preventdefault:submit
        onSubmit$={async () => {
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

          if (Object.keys(newErrors).length === 0) {
            onSubmit$({
              name: name.value.trim(),
              description: description.value.trim(),
              price: parseFloat(price.value),
              image_url: imageUrl.value || null,
            });
          }
        }}
      >
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

        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
            Imagem do Produto
          </label>
          
          {imagePreview.value && (
            <div class="mb-3 relative inline-block">
              <img
                src={imagePreview.value}
                alt="Preview"
                width={128}
                height={128}
                class="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                onClick$={() => {
                  imagePreview.value = '';
                  imageUrl.value = '';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <input
            id="image"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            class={`input ${errors.value.image ? 'border-red-500' : ''}`}
            disabled={uploading.value}
            onChange$={async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const validationError = validateImageFile(file);
                if (validationError) {
                  errors.value = { ...errors.value, image: validationError };
                  return;
                }
                
                const newErrors = { ...errors.value };
                delete newErrors.image;
                errors.value = newErrors;
                
                uploading.value = true;
                const { url, error } = await uploadImage(file);
                uploading.value = false;
                
                if (error) {
                  errors.value = { ...errors.value, image: error };
                  return;
                }
                
                imageUrl.value = url || '';
                imagePreview.value = url || '';
              }
            }}
          />
          {uploading.value && (
            <p class="mt-2 text-sm text-primary-600 flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fazendo upload da imagem...
            </p>
          )}
          <p class="mt-1 text-xs text-gray-500">
            Formatos aceitos: JPG, PNG, GIF, WebP. Tamanho máximo: 5MB
          </p>
          {errors.value.image && <p class="mt-1 text-sm text-red-600">{errors.value.image}</p>}
        </div>

        <div class="flex gap-4 justify-end">
          <button type="button" class="btn btn-secondary" onClick$={onCancel$} disabled={uploading.value}>
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" disabled={uploading.value}>
            {submitLabel}
          </button>
        </div>
      </form>
    );
  }
);
