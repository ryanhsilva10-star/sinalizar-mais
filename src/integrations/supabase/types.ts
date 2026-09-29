export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alunos: {
        Row: {
          alunos_sala_id: string | null
          celular: number
          id: string
          matricula: string
          nascimento: string | null
          nome: string
          pontuação_total: number
          user_id: string | null
        }
        Insert: {
          alunos_sala_id?: string | null
          celular: number
          id?: string
          matricula: string
          nascimento?: string | null
          nome: string
          pontuação_total?: number
          user_id?: string | null
        }
        Update: {
          alunos_sala_id?: string | null
          celular?: number
          id?: string
          matricula?: string
          nascimento?: string | null
          nome?: string
          pontuação_total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_alunos_sala_id_fkey"
            columns: ["alunos_sala_id"]
            isOneToOne: false
            referencedRelation: "alunos_sala"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos_sala: {
        Row: {
          alunos_id: string | null
          id: string
          sala_id: string | null
        }
        Insert: {
          alunos_id?: string | null
          id: string
          sala_id?: string | null
        }
        Update: {
          alunos_id?: string | null
          id?: string
          sala_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_sala_alunos_id_fkey"
            columns: ["alunos_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_sala_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "sala"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos_trilha: {
        Row: {
          id: string
        }
        Insert: {
          id?: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alunos_trilha_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_trilha_id_fkey1"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "trilhas"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicio: {
        Row: {
          descrição: string | null
          id: string
          titulo: string
          url_video: string | null
        }
        Insert: {
          descrição?: string | null
          id?: string
          titulo: string
          url_video?: string | null
        }
        Update: {
          descrição?: string | null
          id?: string
          titulo?: string
          url_video?: string | null
        }
        Relationships: []
      }
      exercicios: {
        Row: {
          exercicios_exercicio_id: string | null
          id: string
          titulo: string
        }
        Insert: {
          exercicios_exercicio_id?: string | null
          id?: string
          titulo: string
        }
        Update: {
          exercicios_exercicio_id?: string | null
          id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_exercicios_exercicio_id_fkey"
            columns: ["exercicios_exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicios_exercicio"
            referencedColumns: ["id"]
          },
        ]
      }
      exercicios_exercicio: {
        Row: {
          exercicio_id: string | null
          id: string
        }
        Insert: {
          exercicio_id?: string | null
          id?: string
        }
        Update: {
          exercicio_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercicios_exercicio_exercicio_id_fkey"
            columns: ["exercicio_id"]
            isOneToOne: false
            referencedRelation: "exercicio"
            referencedColumns: ["id"]
          },
        ]
      }
      fase: {
        Row: {
          id: string
          nome_fase: string
          pontos: number | null
        }
        Insert: {
          id?: string
          nome_fase: string
          pontos?: number | null
        }
        Update: {
          id?: string
          nome_fase?: string
          pontos?: number | null
        }
        Relationships: []
      }
      fases_exercicio: {
        Row: {
          exercicios_id: string | null
          fase_id: string | null
          id: string
        }
        Insert: {
          exercicios_id?: string | null
          fase_id?: string | null
          id?: string
        }
        Update: {
          exercicios_id?: string | null
          fase_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fases_exercicio_exercicios_id_fkey"
            columns: ["exercicios_id"]
            isOneToOne: false
            referencedRelation: "exercicios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fases_exercicio_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "fase"
            referencedColumns: ["id"]
          },
        ]
      }
      professor: {
        Row: {
          email: string | null
          id: string
          nome: string | null
          sala_id: string | null
          senha: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          nome?: string | null
          sala_id?: string | null
          senha?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          nome?: string | null
          sala_id?: string | null
          senha?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professor_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "sala"
            referencedColumns: ["id"]
          },
        ]
      }
      sala: {
        Row: {
          codigo_sala: number
          id: string
          nome_sala: string | null
        }
        Insert: {
          codigo_sala: number
          id?: string
          nome_sala?: string | null
        }
        Update: {
          codigo_sala?: number
          id?: string
          nome_sala?: string | null
        }
        Relationships: []
      }
      trilhas: {
        Row: {
          descrição_trilha: string | null
          id: string
          status: string
        }
        Insert: {
          descrição_trilha?: string | null
          id?: string
          status: string
        }
        Update: {
          descrição_trilha?: string | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      trilhas_fase: {
        Row: {
          fase_id: string | null
          id: string
          trilhas_id: string | null
        }
        Insert: {
          fase_id?: string | null
          id?: string
          trilhas_id?: string | null
        }
        Update: {
          fase_id?: string | null
          id?: string
          trilhas_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trilhas_fase_fase_id_fkey"
            columns: ["fase_id"]
            isOneToOne: false
            referencedRelation: "fase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trilhas_fase_trilhas_id_fkey"
            columns: ["trilhas_id"]
            isOneToOne: false
            referencedRelation: "trilhas"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
