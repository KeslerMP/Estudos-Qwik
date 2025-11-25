import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProductCard } from "~/components/product-card";
import { SearchBar } from "~/components/search-bar";
import { FilterSection } from "~/components/filter-section";
import { useDebounce } from "~/hooks/useDebounce";
import { getProducts } from "~/lib/supabase";
import { hybridSearch } from "~/utils/binarySearch";

export const useProductsData = routeLoader$(async () => {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
});

export default component$(() => {
  const productsData = useProductsData();
  const searchTerm = useSignal("");
  const category = useSignal("all");
  const sortBy = useSignal("relevance");
  
  const debouncedSearch = useDebounce(searchTerm, 300);

  const categories = useComputed$(() => {
    const cats = productsData.value
      .map(p => p.category)
      .filter((c): c is string => c !== null && c !== undefined);
    return Array.from(new Set(cats));
  });

  const filteredAndSortedProducts = useComputed$(() => {
    let filtered = [...productsData.value];

    if (debouncedSearch.value) {
      filtered = hybridSearch(filtered, debouncedSearch.value);
    }

    if (category.value !== "all") {
      filtered = filtered.filter(product => product.category === category.value);
    }

    switch (sortBy.value) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  });

  return (
    <div class="min-h-screen bg-background">
      <header class="border-b bg-card">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold mb-6">Loja de Produtos</h1>
          <div class="flex flex-col gap-4">
            <SearchBar value={searchTerm} />
            <FilterSection
              category={category}
              sortBy={sortBy}
              categories={categories.value}
            />
          </div>
        </div>
      </header>

      <main class="container mx-auto px-4 py-8">
        <div class="mb-4 text-sm text-muted-foreground">
          {filteredAndSortedProducts.value.length} produto(s) encontrado(s)
        </div>
        
        {filteredAndSortedProducts.value.length === 0 ? (
          <div class="text-center py-12">
            <p class="text-lg text-muted-foreground">
              Nenhum produto encontrado
            </p>
            <p class="text-sm text-muted-foreground mt-2">
              Verifique se você executou os comandos SQL no Supabase
            </p>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.value.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                category={product.category || 'Sem categoria'}
                stock={product.stock}
                imageUrl={product.image_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Loja de Produtos",
  meta: [
    {
      name: "description",
      content: "Loja de produtos com filtros e busca",
    },
  ],
};
