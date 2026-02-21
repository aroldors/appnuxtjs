export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: number
          nome: string | null
          endereco: string | null
          numero: number | null
          bairro: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          telefone: string | null
          email: string | null
          linkedin: string | null
          cargo: string | null
          ramo_atividade: string | null
          vlr_oportunidade: number | null
          status: string | null
          origem: string | null
          observacoes: string | null
          resumo: string | null
          user_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
          endereco?: string | null
          numero?: number | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          telefone?: string | null
          email?: string | null
          linkedin?: string | null
          cargo?: string | null
          ramo_atividade?: string | null
          vlr_oportunidade?: number | null
          status?: string | null
          origem?: string | null
          observacoes?: string | null
          resumo?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
          endereco?: string | null
          numero?: number | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          telefone?: string | null
          email?: string | null
          linkedin?: string | null
          cargo?: string | null
          ramo_atividade?: string | null
          vlr_oportunidade?: number | null
          status?: string | null
          origem?: string | null
          observacoes?: string | null
          resumo?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
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