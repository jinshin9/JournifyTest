import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          mood: string | null
          is_highlight: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          mood?: string | null
          is_highlight?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          mood?: string | null
          is_highlight?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          type: string
          color: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          color?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          color?: string | null
          user_id?: string
          created_at?: string
        }
      }
      entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          tag_id: string
        }
        Update: {
          entry_id?: string
          tag_id?: string
        }
      }
      attachments: {
        Row: {
          id: string
          entry_id: string
          type: string
          url: string
          filename: string
          size: number
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          type: string
          url: string
          filename: string
          size: number
          created_at?: string
        }
        Update: {
          id?: string
          entry_id?: string
          type?: string
          url?: string
          filename?: string
          size?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 