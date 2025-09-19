import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '@/constants';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  API_CONFIG.supabaseUrl,
  API_CONFIG.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// Helper functions for common database operations
export const dbHelpers = {
  // Error handler
  handleError: (error: unknown): string => {
    console.error('Database error:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected database error occurred';
  },

  // Generic fetch with error handling
  async fetchWithError<T>(query: Promise<{ data: T | null; error: any }>): Promise<T | null> {
    try {
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database fetch error:', error);
      return null;
    }
  }
};