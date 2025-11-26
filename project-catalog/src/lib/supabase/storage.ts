/**
 * Supabase Storage Service
 * 
 * Serviço para upload e gerenciamento de imagens no Supabase Storage.
 */

import { getSupabaseClient } from './client';

const BUCKET_NAME = 'product-images';

/**
 * Faz upload de uma imagem para o Supabase Storage
 * @param file - Arquivo de imagem a ser enviado
 * @param fileName - Nome do arquivo (opcional, será gerado automaticamente se não fornecido)
 * @returns URL pública da imagem ou null em caso de erro
 */
export const uploadImage = async (
  file: File,
  fileName?: string
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}-${randomStr}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: null, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: 'Erro inesperado ao fazer upload da imagem' };
  }
};

/**
 * Deleta uma imagem do Supabase Storage
 * @param imageUrl - URL completa da imagem
 * @returns Sucesso ou erro
 */
export const deleteImage = async (
  imageUrl: string
): Promise<{ error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    
    const urlParts = imageUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) {
      return { error: 'URL de imagem inválida' };
    }
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: 'Erro inesperado ao deletar imagem' };
  }
};

/**
 * Valida se o arquivo é uma imagem válida
 * @param file - Arquivo a ser validado
 * @param maxSizeMB - Tamanho máximo em MB (padrão: 5MB)
 * @returns Mensagem de erro ou null se válido
 */
export const validateImageFile = (
  file: File,
  maxSizeMB: number = 5
): string | null => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return 'Formato de arquivo inválido. Use JPG, PNG, GIF ou WebP.';
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB.`;
  }

  return null;
};
