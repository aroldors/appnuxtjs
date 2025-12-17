export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number
          cpf: string | null
          nome: string | null
          identificacao: string | null
          endereco: string | null
          numero: string | null
          bairro: string | null
          cidade: string | null
          uf: string | null
          telefone: string | null
          role: string
          ativo: boolean
          user_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          cpf?: string | null
          nome?: string | null
          identificacao?: string | null
          endereco?: string | null
          numero?: string | null
          bairro?: string | null
          cidade?: string | null
          uf?: string | null
          telefone?: string | null
          role: string
          ativo?: boolean
          user_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          cpf?: string | null
          nome?: string | null
          identificacao?: string | null
          endereco?: string | null
          numero?: string | null
          bairro?: string | null
          cidade?: string | null
          uf?: string | null
          telefone?: string | null
          role?: string
          ativo?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}