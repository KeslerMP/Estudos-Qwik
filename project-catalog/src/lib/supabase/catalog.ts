/**
 * Catalog Service
 * 
 * Este arquivo contém todas as operações CRUD para a tabela "items" do Supabase.
 * Cada função retorna um objeto com { data, error } para facilitar o tratamento de erros.
 */

import { getSupabaseClient, type Database } from './client';

export type Item = Database['public']['Tables']['items']['Row'];
export type ItemInsert = Database['public']['Tables']['items']['Insert'];
export type ItemUpdate = Database['public']['Tables']['items']['Update'];

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: string | null;
}

/**
 * Busca itens com paginação e filtro de busca
 * @param page - Número da página (começa em 0)
 * @param pageSize - Quantidade de itens por página
 * @param searchTerm - Termo de busca opcional para filtrar por nome
 */
export const getItems = async (
  page: number = 0,
  pageSize: number = 10,
  searchTerm: string = ''
): Promise<PaginatedResponse<Item>> => {
  try {
    const supabase = getSupabaseClient();
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('items')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Aplica filtro de busca se fornecido
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar itens:', error);
      return { data: [], count: 0, error: error.message };
    }

    return { data: data || [], count: count || 0, error: null };
  } catch (err) {
    console.error('Erro inesperado ao buscar itens:', err);
    return { data: [], count: 0, error: 'Erro inesperado ao buscar itens' };
  }
};

/**
 * Busca um item específico por ID
 * @param id - UUID do item
 */
export const getItemById = async (
  id: string
): Promise<{ data: Item | null; error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('items').select('*').eq('id', id).single();

    if (error) {
      console.error('Erro ao buscar item:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Erro inesperado ao buscar item:', err);
    return { data: null, error: 'Erro inesperado ao buscar item' };
  }
};

/**
 * Cria um novo item
 * @param item - Dados do item a ser criado
 */
export const createItem = async (
  item: ItemInsert
): Promise<{ data: Item | null; error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('items').insert(item).select().single();

    if (error) {
      console.error('Erro ao criar item:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Erro inesperado ao criar item:', err);
    return { data: null, error: 'Erro inesperado ao criar item' };
  }
};

/**
 * Atualiza um item existente
 * @param id - UUID do item
 * @param updates - Campos a serem atualizados
 */
export const updateItem = async (
  id: string,
  updates: ItemUpdate
): Promise<{ data: Item | null; error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar item:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Erro inesperado ao atualizar item:', err);
    return { data: null, error: 'Erro inesperado ao atualizar item' };
  }
};

/**
 * Deleta um item
 * @param id - UUID do item
 */
export const deleteItem = async (id: string): Promise<{ error: string | null }> => {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Erro ao deletar item:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Erro inesperado ao deletar item:', err);
    return { error: 'Erro inesperado ao deletar item' };
  }
};
