import { component$, Slot, type QwikIntrinsicElements } from '@builder.io/qwik';

type LabelProps = QwikIntrinsicElements['label'];

export const Label = component$<LabelProps>(({ class: className, ...props }) => {
  const classes = `text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`;

  return (
    <label class={classes} {...props}>
      <Slot />
    </label>
  );
});
