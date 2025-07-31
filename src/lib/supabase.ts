import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          company?: string;
          role: 'client' | 'admin' | 'analyst';
          avatar_url?: string;
          company_logo_url?: string;
          maturity_level?: number;
          maturity_assessment?: any;
          free_consultations_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          company?: string;
          role?: 'client' | 'admin' | 'analyst';
          avatar_url?: string;
          company_logo_url?: string;
          maturity_level?: number;
          maturity_assessment?: any;
          free_consultations_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          company?: string;
          role?: 'client' | 'admin' | 'analyst';
          avatar_url?: string;
          company_logo_url?: string;
          maturity_level?: number;
          maturity_assessment?: any;
          free_consultations_used?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string;
          status: 'analyzing' | 'proposal' | 'delivered' | 'cancelled';
          priority: 'low' | 'medium' | 'high';
          deadline: string;
          created_at: string;
          updated_at: string;
          assigned_analyst?: string;
          is_free: boolean;
          files?: any[];
          proposal?: any;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          description: string;
          status?: 'analyzing' | 'proposal' | 'delivered' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          deadline: string;
          created_at?: string;
          updated_at?: string;
          assigned_analyst?: string;
          is_free?: boolean;
          files?: any[];
          proposal?: any;
        };
        Update: {
          id?: string;
          client_id?: string;
          title?: string;
          description?: string;
          status?: 'analyzing' | 'proposal' | 'delivered' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          deadline?: string;
          created_at?: string;
          updated_at?: string;
          assigned_analyst?: string;
          is_free?: boolean;
          files?: any[];
          proposal?: any;
        };
      };
      reviews: {
        Row: {
          id: string;
          consultation_id: string;
          client_id: string;
          rating: number;
          comment?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          client_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          client_id?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
      };
    };
  };
};