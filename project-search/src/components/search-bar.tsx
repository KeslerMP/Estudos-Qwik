import { component$, type Signal } from '@builder.io/qwik';
import { Input } from './ui/input';
import { SearchIcon } from './ui/icons';

type SearchBarProps = {
  value: Signal<string>;
};

export const SearchBar = component$<SearchBarProps>(({ value }) => {
  return (
    <div class="relative w-full max-w-2xl">
      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Buscar produtos..."
        value={value.value}
        onInput$={(e) => {
          const target = e.target as HTMLInputElement;
          value.value = target.value;
        }}
        class="pl-10"
      />
    </div>
  );
});
