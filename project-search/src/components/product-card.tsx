import { component$ } from '@builder.io/qwik';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type ProductCardProps = {
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string | null;
};

export const ProductCard = component$<ProductCardProps>(({ 
  name, 
  description, 
  price, 
  category, 
  stock 
}) => {
  return (
    <Card class="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      <div class="h-48 bg-muted flex items-center justify-center">
        <span class="text-muted-foreground text-sm">Sem imagem kk</span>
      </div>
      <CardContent class="p-4">
        <Badge variant="secondary" class="mb-2">{category}</Badge>
        <h3 class="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
        <p class="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-primary">
            R$ {price.toFixed(2)}
          </span>
          <span class="text-xs text-muted-foreground">
            {stock > 0 ? `${stock} em estoque` : 'Esgotado'}
          </span>
        </div>
      </CardContent>
      <CardFooter class="p-4 pt-0">
        <Button class="w-full" disabled={stock === 0}>
          {stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível'}
        </Button>
      </CardFooter>
    </Card>
  );
});
