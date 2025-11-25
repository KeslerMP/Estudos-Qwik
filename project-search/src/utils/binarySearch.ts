import type { Product } from '~/lib/supabase';

export function binarySearchByName(
  products: Product[],
  searchTerm: string
): Product[] {
  if (!searchTerm) return products;

  const sortedProducts = [...products].sort((a, b) => 
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  const results: Product[] = [];
  const searchLower = searchTerm.toLowerCase();

  let left = 0;
  let right = sortedProducts.length - 1;
  let firstMatch = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const productName = sortedProducts[mid].name.toLowerCase();

    if (productName.includes(searchLower)) {
      firstMatch = mid;
      right = mid - 1;
    } else if (productName < searchLower) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  if (firstMatch !== -1) {
    let i = firstMatch;
    while (i >= 0 && sortedProducts[i].name.toLowerCase().includes(searchLower)) {
      results.unshift(sortedProducts[i]);
      i--;
    }

    i = firstMatch + 1;
    while (i < sortedProducts.length && sortedProducts[i].name.toLowerCase().includes(searchLower)) {
      results.push(sortedProducts[i]);
      i++;
    }
  }

  return results;
}

export function binarySearchProducts(
  products: Product[],
  searchTerm: string
): Product[] {
  if (!searchTerm) return products;

  const searchLower = searchTerm.toLowerCase();
  const nameResults = binarySearchByName(products, searchTerm);

  const descriptionMatches = products.filter(product => {
    const inNameResults = nameResults.some(r => r.id === product.id);
    return !inNameResults && 
           product.description?.toLowerCase().includes(searchLower);
  });

  return [...nameResults, ...descriptionMatches];
}

export function hybridSearch(
  products: Product[],
  searchTerm: string
): Product[] {
  if (!searchTerm) return products;
  
  if (products.length < 20) {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  return binarySearchProducts(products, searchTerm);
}
