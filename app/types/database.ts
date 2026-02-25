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
      contas: {
        Row: {
          id: number
          razao_social: string | null
          cpf_cnpj: string
          nome_fantasia: string | null
          ramo_atividade: string | null
          endereco: string | null
          numero: number | null
          bairro: string | null
          cidade: string | null
          estado: string | null
          rg: string | null
          cep: string | null
          fone_comercial: string | null
          fone_celular: string | null
          email: string | null
          website: string | null
          contato: string | null
          gestor_conta: number | null
          created_at: string
          updated_at: string | null
          user_id: string
          cliente_id: string | null
        }
        Insert: {
          id?: number
          razao_social?: string | null
          cpf_cnpj: string
          nome_fantasia?: string | null
          ramo_atividade?: string | null
          endereco?: string | null
          numero?: number | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          rg?: string | null
          cep?: string | null
          fone_comercial?: string | null
          fone_celular?: string | null
          email?: string | null
          website?: string | null
          contato?: string | null
          gestor_conta?: number | null
          created_at?: string
          updated_at?: string | null
          user_id?: string
          cliente_id?: string | null
        }
        Update: {
          id?: number
          razao_social?: string | null
          cpf_cnpj?: string
          nome_fantasia?: string | null
          ramo_atividade?: string | null
          endereco?: string | null
          numero?: number | null
          bairro?: string | null
          cidade?: string | null
          estado?: string | null
          rg?: string | null
          cep?: string | null
          fone_comercial?: string | null
          fone_celular?: string | null
          email?: string | null
          website?: string | null
          contato?: string | null
          gestor_conta?: number | null
          created_at?: string
          updated_at?: string | null
          user_id?: string
          cliente_id?: string | null
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