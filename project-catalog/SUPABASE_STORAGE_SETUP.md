# Configuração do Supabase Storage para Upload de Imagens

Para habilitar o upload de imagens no projeto, você precisa configurar o Supabase Storage.

## Passos para Configuração

### 1. Criar o Bucket no Supabase

1. Acesse o painel do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. No menu lateral, clique em **Storage**
4. Clique em **New bucket**
5. Configure o bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Marque esta opção (para permitir acesso público às imagens)
   - Clique em **Create bucket**

### 2. Configurar Políticas de Acesso (RLS)

Após criar o bucket, você precisa configurar as políticas de acesso:

1. Clique no bucket `product-images`
2. Vá para a aba **Policies**
3. Clique em **New Policy**

#### Política de Leitura Pública (GET)
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );
```

#### Política de Upload (INSERT)
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );
```

#### Política de Atualização (UPDATE)
```sql
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );
```

#### Política de Exclusão (DELETE)
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
```

### 3. Adicionar Coluna image_url na Tabela items

Execute o seguinte SQL no Supabase SQL Editor:

```sql
-- Adiciona a coluna image_url na tabela items
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Adiciona um comentário para documentar a coluna
COMMENT ON COLUMN items.image_url IS 'URL pública da imagem do produto armazenada no Supabase Storage';
```

### 4. Verificar Configuração

Para verificar se tudo está funcionando:

1. Tente fazer upload de uma imagem ao criar ou editar um produto
2. A imagem deve aparecer no card do produto na listagem
3. Verifique no Storage do Supabase se a imagem foi salva corretamente

## Formatos de Imagem Suportados

- JPG/JPEG
- PNG
- GIF
- WebP

**Tamanho máximo**: 5MB por imagem

## Estrutura de Armazenamento

As imagens são salvas com nomes únicos no formato:
```
{timestamp}-{randomString}.{extensão}
```

Exemplo: `1701234567890-abc123def456.jpg`

## Troubleshooting

### Erro: "Bucket not found"
- Verifique se o bucket `product-images` foi criado corretamente
- Confirme que o nome está exatamente como `product-images`

### Erro: "Permission denied"
- Verifique se as políticas de acesso foram configuradas corretamente
- Certifique-se de que o bucket está marcado como público

### Imagem não aparece no card
- Verifique se a URL da imagem está sendo salva corretamente no banco de dados
- Confirme que o bucket está configurado como público
- Teste acessar a URL da imagem diretamente no navegador
