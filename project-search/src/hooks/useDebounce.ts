import { useSignal, useVisibleTask$, type Signal } from '@builder.io/qwik';

export function useDebounce<T>(value: Signal<T>, delay: number = 500): Signal<T> {
  const debouncedValue = useSignal<T>(value.value);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => value.value);

    const timer = setTimeout(() => {
      debouncedValue.value = value.value;
    }, delay);

    cleanup(() => clearTimeout(timer));
  });

  return debouncedValue;
}
