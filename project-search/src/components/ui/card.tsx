import { component$, Slot } from '@builder.io/qwik';

type CardProps = {
  class?: string;
};

export const Card = component$<CardProps>(({ class: className }) => {
  return (
    <div class={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
      <Slot />
    </div>
  );
});

export const CardContent = component$<CardProps>(({ class: className }) => {
  return (
    <div class={`p-6 pt-0 ${className || ''}`}>
      <Slot />
    </div>
  );
});

export const CardFooter = component$<CardProps>(({ class: className }) => {
  return (
    <div class={`flex items-center p-6 pt-0 ${className || ''}`}>
      <Slot />
    </div>
  );
});
