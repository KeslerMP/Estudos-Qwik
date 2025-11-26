# QwikProject

Monorepo contendo dois projetos Qwik integrados com Supabase: um sistema de catalogo CRUD e uma aplicacao de busca de produtos.

## Estrutura do Projeto

```
QwikProject/
├── project-catalog/    # Sistema CRUD de catalogo
└── project-search/     # Aplicacao de busca de produtos
```

## Project Catalog

Sistema completo de gerenciamento de catalogo com operacoes CRUD e upload de imagens.

### Tecnologias

- **Qwik 1.5.0**: Framework web com resumability
- **Supabase**: Backend-as-a-Service (PostgreSQL + Storage)
- **TailwindCSS**: Estilizacao
- **TypeScript**: Tipagem estatica

### Funcionalidades Principais

#### 1. Operacoes CRUD (`src/lib/supabase/catalog.ts`)

**getItems(page, pageSize, searchTerm)**
- Busca itens com paginacao
- Filtro por nome usando `ilike` (case-insensitive)
- Ordenacao por data de criacao (mais recente primeiro)
- Retorna contagem total para paginacao

**getItemById(id)**
- Busca item especifico por UUID
- Usado para edicao e visualizacao de detalhes

**createItem(item)**
- Cria novo item no catalogo
- Valida dados antes de inserir
- Retorna item criado com ID gerado

**updateItem(id, updates)**
- Atualiza campos especificos de um item
- Permite atualizacao parcial (apenas campos fornecidos)

**deleteItem(id)**
- Remove item do catalogo
- Deve ser usado junto com deleteImage para limpar storage

#### 2. Gerenciamento de Imagens (`src/lib/supabase/storage.ts`)

**uploadImage(file, fileName)**
- Upload para bucket `product-images`
- Gera nome unico usando timestamp + string aleatoria
- Retorna URL publica da imagem
- Cache de 1 hora configurado

**deleteImage(imageUrl)**
- Remove imagem do storage
- Extrai path da URL completa
- Essencial para evitar arquivos orfaos

**validateImageFile(file, maxSizeMB)**
- Valida tipo de arquivo (JPG, PNG, GIF, WebP)
- Verifica tamanho maximo (padrao 5MB)
- Retorna mensagem de erro ou null se valido

#### 3. Cliente Supabase (`src/lib/supabase/client.ts`)

**getSupabaseClient()**
- Singleton do cliente Supabase
- Configurado com URL e anon key
- Tipos gerados automaticamente do schema

### Por Que Essas Funcoes

- **Paginacao**: Evita carregar todos os itens de uma vez, melhorando performance
- **Busca por nome**: Permite filtrar itens sem recarregar a pagina
- **Validacao de imagem**: Previne uploads invalidos que causariam erros
- **Nome unico de arquivo**: Evita conflitos e sobrescrita de imagens
- **Retorno padrao {data, error}**: Facilita tratamento de erros consistente
- **Single responsibility**: Cada funcao tem uma responsabilidade clara

### Configuracao

1. Criar projeto no Supabase
2. Executar SQL para criar tabela `items`
3. Criar bucket `product-images` (publico)
4. Configurar variaveis de ambiente:
   ```
   PUBLIC_SUPABASE_URL=sua-url
   PUBLIC_SUPABASE_ANON_KEY=sua-key
   ```

### Comandos

```bash
cd project-catalog
npm install
npm run dev          # Desenvolvimento
npm run build        # Build para producao
npm run deploy       # Deploy para Vercel
```

## Project Search

Aplicacao de busca e filtragem de produtos com algoritmo de busca hibrida.

### Tecnologias

- **Qwik 1.17.2**: Framework web
- **Supabase**: Banco de dados
- **TailwindCSS**: Estilizacao
- **TypeScript**: Tipagem estatica

### Funcionalidades Principais

#### 1. Busca Hibrida (`src/utils/binarySearch.ts`)

**hybridSearch(products, searchTerm)**
- Para arrays pequenos (<20 itens): busca linear simples
- Para arrays grandes: busca binaria otimizada
- Decisao baseada em performance: O(n) vs O(log n)

**binarySearchProducts(products, searchTerm)**
- Busca em nome usando busca binaria
- Busca em descricao usando filtro linear
- Combina resultados sem duplicatas
- Prioriza matches no nome

**binarySearchByName(products, searchTerm)**
- Ordena produtos por nome
- Busca binaria para encontrar primeiro match
- Expande para encontrar todos os matches adjacentes
- Retorna resultados ordenados

#### 2. Debounce Hook (`src/hooks/useDebounce.ts`)

**useDebounce(signal, delay)**
- Atrasa execucao da busca em 300ms
- Evita requisicoes excessivas durante digitacao
- Melhora performance e experiencia do usuario

#### 3. Filtros e Ordenacao

**Filtros**
- Por categoria (extraida dinamicamente dos produtos)
- Por termo de busca (nome e descricao)

**Ordenacao**
- Preco crescente/decrescente
- Nome alfabetico A-Z/Z-A
- Relevancia (padrao)

### Por Que Essas Funcoes

- **Busca hibrida**: Otimiza performance para diferentes tamanhos de dataset
- **Busca binaria**: Reduz complexidade de O(n) para O(log n) em arrays grandes
- **Debounce**: Reduz numero de operacoes de busca durante digitacao rapida
- **Filtros dinamicos**: Categorias extraidas dos dados reais, nao hardcoded
- **Busca em multiplos campos**: Encontra produtos por nome ou descricao
- **Ordenacao flexivel**: Usuario controla como visualizar resultados

### Configuracao

1. Usar mesmo projeto Supabase do catalog
2. Produtos sao inseridos via project-catalog
3. Configurar mesmas variaveis de ambiente

### Comandos

```bash
cd project-search
npm install
npm run dev          # Desenvolvimento
npm run build        # Build para producao
npm run deploy       # Deploy para Vercel
```

## Integracao Entre Projetos

1. **project-catalog**: Interface administrativa para gerenciar produtos
2. **project-search**: Interface publica para buscar e visualizar produtos
3. **Supabase**: Backend compartilhado entre os dois projetos

Fluxo:
- Admin adiciona produtos via catalog
- Produtos aparecem automaticamente no search
- Imagens sao servidas via Supabase Storage
- Ambos usam mesma tabela `items`

## Deploy

Ambos os projetos estao configurados para deploy na Vercel com GitHub Actions:

- `.github/workflows/catalog-deploy.yml`: Deploy automatico do catalog
- `.github/workflows/search-deploy.yml`: Deploy automatico do search

## Requisitos

- Node.js >= 18.0.0
- Conta Supabase (gratuita)
- Conta Vercel (opcional, para deploy)

## Estrutura do Banco de Dados

```sql
-- Tabela items
id: uuid (PK)
name: text
description: text
price: numeric
category: text
stock: integer
image_url: text
created_at: timestamp
updated_at: timestamp
```

## Seguranca

- Chaves do Supabase via variaveis de ambiente
- Bucket de imagens publico (apenas leitura)
- Validacao de tipos de arquivo no upload
- Limite de tamanho de arquivo (5MB)
