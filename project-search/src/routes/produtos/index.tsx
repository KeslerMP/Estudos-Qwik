import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { getProducts, type Product } from '~/lib/supabase';

export const useProducts = routeLoader$(async () => {
  try {
    const products = await getProducts();
    return products;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
});

export default component$(() => {
  const products = useProducts();

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Produtos</h1>
          <p class="text-gray-600">Confira nosso catálogo completo</p>
        </div>

        {products.value.length === 0 ? (
          <div class="text-center py-12">
            <p class="text-gray-500 text-lg">Nenhum produto encontrado.</p>
            <p class="text-gray-400 text-sm mt-2">
              Verifique se você executou os comandos SQL no Supabase.
            </p>
          </div>
        ) : (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.value.map((product: Product) => (
              <div
                key={product.id}
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {product.image_url && (
                  <div class="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <div class="p-4">
                  {product.category && (
                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-2">
                      {product.category}
                    </span>
                  )}

                  <h2 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h2>

                  {product.description && (
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div class="flex items-center justify-between mt-4">
                    <div>
                      <span class="text-2xl font-bold text-green-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-gray-500 block">
                        Estoque: {product.stock}
                      </span>
                    </div>
                  </div>

                  <button class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
