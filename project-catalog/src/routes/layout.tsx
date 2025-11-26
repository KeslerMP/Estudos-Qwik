/**
 * Layout Component
 * 
 * Layout principal da aplicação que envolve todas as páginas.
 * Inclui header com navegação e container para o conteúdo.
 */

import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <div class="min-h-screen flex flex-col">
      {/* Header */}
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <Link href="/" class="flex items-center gap-2 text-2xl font-bold text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Catálogo
            </Link>

            <nav class="flex gap-4">
              <Link
                href="/"
                class="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Produtos
              </Link>
              <Link
                href="/new"
                class="btn btn-primary"
              >
                + Novo Produto
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main class="flex-1 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Slot />
        </div>
      </main>

      {/* Footer */}
      <footer class="bg-white border-t border-gray-200 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center gap-4">
            {/* GitHub Profile */}
            <a
              href="https://github.com/u/99407881"
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
