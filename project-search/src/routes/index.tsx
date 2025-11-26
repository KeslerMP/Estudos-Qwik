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

      {/* Footer */}
      <footer class="bg-white border-t border-gray-200 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center gap-4">
            {/* GitHub Profile */}
            <a
              href="https://github.com/KeslerMP"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
            >
              <img
                src="https://avatars.githubusercontent.com/u/99407881?v=4"
                alt="GitHub Profile"
                width="40"
                height="40"
                class="w-10 h-10 rounded-full border-2 border-gray-200 group-hover:border-primary-500 transition-colors"
              />
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span class="font-medium">GitHub</span>
              </div>
            </a>

            {/* Tech Stack */}
            <p class="text-gray-600 text-sm text-center">
              Desenvolvido com{' '}
              <a
                href="https://qwik.builder.io"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-600 hover:underline font-medium"
              >
                Qwik
              </a>{' '}
              e{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary-600 hover:underline font-medium"
              >
                Supabase
              </a>
            </p>
          </div>
        </div>
      </footer>
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
