import { component$, $, type PropFunction } from '@builder.io/qwik';

type SelectProps = {
  value: string;
  onValueChange$?: PropFunction<(value: string) => void>;
  class?: string;
  children?: any;
};

type SelectTriggerProps = {
  id?: string;
  class?: string;
  children?: any;
};

type SelectContentProps = {
  class?: string;
  children?: any;
};

type SelectItemProps = {
  value: string;
  class?: string;
  children?: any;
};

export const Select = component$<SelectProps>(({ value, onValueChange$, class: className, children }) => {
  const handleChange = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    if (target && onValueChange$) {
      onValueChange$(target.value);
    }
  });

  return (
    <select
      value={value}
      onChange$={handleChange}
      class={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    >
      {children}
    </select>
  );
});

export const SelectTrigger = component$<SelectTriggerProps>(() => {
  return null;
});

export const SelectValue = component$<{ placeholder?: string }>(() => {
  return null;
});

export const SelectContent = component$<SelectContentProps>(() => {
  return null;
});

export const SelectItem = component$<SelectItemProps>(({ value, children }) => {
  return <option value={value}>{children}</option>;
});
