import { component$, type Signal } from '@builder.io/qwik';
import { Label } from './ui/label';

type FilterSectionProps = {
  category: Signal<string>;
  sortBy: Signal<string>;
  categories: string[];
};

export const FilterSection = component$<FilterSectionProps>(({ 
  category, 
  sortBy, 
  categories 
}) => {
  return (
    <div class="flex flex-col sm:flex-row gap-4 w-full">
      <div class="flex-1">
        <Label for="category" class="mb-2 block">Categoria</Label>
        <select
          id="category"
          value={category.value}
          onChange$={(e: Event) => {
            category.value = (e.target as HTMLSelectElement).value;
          }}
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="all">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div class="flex-1">
        <Label for="sort" class="mb-2 block">Ordenar por</Label>
        <select
          id="sort"
          value={sortBy.value}
          onChange$={(e: Event) => {
            sortBy.value = (e.target as HTMLSelectElement).value;
          }}
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="relevance">Mais relevantes</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="name_asc">Nome (A-Z)</option>
          <option value="name_desc">Nome (Z-A)</option>
        </select>
      </div>
    </div>
  );
});
