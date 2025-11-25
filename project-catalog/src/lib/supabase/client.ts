/**
 * Supabase Client Configuration
 * 
 * Este arquivo configura e exporta o cliente Supabase para uso em toda a aplicação.
 * As credenciais são carregadas das variáveis de ambiente.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          created_at?: string;
        };
      };
    };
  };
}

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Obtém ou cria uma instância do cliente Supabase
 * Esta função garante que apenas uma instância do cliente seja criada (singleton)
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Variáveis de ambiente do Supabase não configuradas. ' +
        'Por favor, configure PUBLIC_SUPABASE_URL e PUBLIC_SUPABASE_ANON_KEY no arquivo .env'
    );
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
  return supabaseClient;
};
