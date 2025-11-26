/**
 * ItemCard Component
 * 
 * Card para exibir informações de um item com ações de editar e excluir.
 */

import { component$, type QRL } from '@builder.io/qwik';
import type { Item } from '~/lib/supabase/catalog';

interface ItemCardProps {
  item: Item;
  onEdit$: QRL<(id: string) => void>;
  onDelete$: QRL<(id: string) => void>;
}

export const ItemCard = component$<ItemCardProps>(({ item, onEdit$, onDelete$ }) => {
  // Formata o preço para exibição
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  // Formata a data para exibição
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div class="card hover:shadow-lg transition-shadow duration-200">
      {/* Imagem do Produto */}
      {item.image_url && (
        <div class="mb-4 -mx-6 -mt-6">
          <img
            src={item.image_url}
            alt={item.name}
            class="w-full h-48 object-cover rounded-t-lg"
            width="400"
            height="192"
          />
        </div>
      )}

      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
          <p class="text-gray-600 text-sm line-clamp-3">{item.description}</p>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div>
          <p class="text-2xl font-bold text-primary-600">{formatPrice(item.price)}</p>
          <p class="text-xs text-gray-500 mt-1">Criado em {formatDate(item.created_at)}</p>
        </div>

        <div class="flex gap-2">
          <button
            class="px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            onClick$={() => onEdit$(item.id)}
            aria-label="Editar item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            class="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick$={() => onDelete$(item.id)}
            aria-label="Excluir item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});
