/**
 * Toast Component
 * 
 * Componente para exibir notificações temporárias de sucesso ou erro.
 */

import { component$, useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: Signal<ToastMessage | null>;
}

export const Toast = component$<ToastProps>(({ toast }) => {
  const visible = useSignal(false);

  // Controla a visibilidade e auto-fechamento do toast
  useVisibleTask$(({ track, cleanup }) => {
    track(() => toast.value);

    if (toast.value) {
      visible.value = true;

      const timer = setTimeout(() => {
        visible.value = false;
        setTimeout(() => {
          toast.value = null;
        }, 300);
      }, 3000);

      cleanup(() => clearTimeout(timer));
    }
  });

  if (!toast.value || !visible.value) {
    return null;
  }

  return (
    <div
      class={`toast ${
        toast.value.type === 'success' ? 'toast-success' : 'toast-error'
      }`}
      role="alert"
    >
      <div class="flex items-center gap-3">
        {toast.value.type === 'success' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <p class="font-medium">{toast.value.message}</p>
      </div>
    </div>
  );
});
