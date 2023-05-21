export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      emails: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
        }
      }
      playlists_tracks: {
        Row: {
          playlist_id: number
          track_id: number
          track_index: number | null
        }
        Insert: {
          playlist_id: number
          track_id?: number
          track_index?: number | null
        }
        Update: {
          playlist_id?: number
          track_id?: number
          track_index?: number | null
        }
      }
      static_playlists: {
        Row: {
          cdn_image_url: string | null
          created_at: string | null
          id: number
          name: string | null
          origin_url: string | null
          track_count: number | null
        }
        Insert: {
          cdn_image_url?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          origin_url?: string | null
          track_count?: number | null
        }
        Update: {
          cdn_image_url?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          origin_url?: string | null
          track_count?: number | null
        }
      }
      static_tracks: {
        Row: {
          artists: string[] | null
          cdn_path: string | null
          created_at: string | null
          duration_ms: number | null
          id: number
          kandi_count: number | null
          name: string | null
          origin_url: string | null
        }
        Insert: {
          artists?: string[] | null
          cdn_path?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: number
          kandi_count?: number | null
          name?: string | null
          origin_url?: string | null
        }
        Update: {
          artists?: string[] | null
          cdn_path?: string | null
          created_at?: string | null
          duration_ms?: number | null
          id?: number
          kandi_count?: number | null
          name?: string | null
          origin_url?: string | null
        }
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          password_hash: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          password_hash?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          password_hash?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_email: {
        Args: {
          given_email: string
        }
        Returns: number
      }
      increment_ref:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              ref_key: string
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
