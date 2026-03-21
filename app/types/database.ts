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
      oportunidades: {
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
      contatos: {
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
          cargo: string | null
          origem: string | null
          conta: number | null
          status: string
          tags: string[] | null
          user_id: string
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
          cargo?: string | null
          origem?: string | null
          conta?: number | null
          status?: string
          tags?: string[] | null
          user_id?: string
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
          cargo?: string | null
          origem?: string | null
          conta?: number | null
          status?: string
          tags?: string[] | null
          user_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      especialidades: {
        Row: {
          id: number
          descricao: string | null
          user_id: string | null
          created_at: string
          upated_at: string | null
        }
        Insert: {
          id?: number
          descricao?: string | null
          user_id?: string | null
          created_at?: string
          upated_at?: string | null
        }
        Update: {
          id?: number
          descricao?: string | null
          user_id?: string | null
          created_at?: string
          upated_at?: string | null
        }
      }
      usuarios: {
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
          user_id: string | null
          usuario_auth: string | null
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
          role?: string
          ativo?: boolean
          user_id?: string | null
          usuario_auth?: string | null
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
          user_id?: string | null
          usuario_auth?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      profissionais: {
        Row: {
          id: number
          usuario_id: number | null
          especialidade_id: number | null
          user_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          usuario_id?: number | null
          especialidade_id?: number | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          usuario_id?: number | null
          especialidade_id?: number | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      agendamentos: {
        Row: {
          id: number
          titulo: string | null
          descricao: string | null
          profissional_id: number | null
          cliente_id: number | null
          telefone: string | null
          data: string | null
          hora_inicio: string | null
          hora_termino: string | null
          cancelado: boolean | null
          cancelado_as: string | null
          duracao: number | null
          status: string | null
          nome_profissional: string | null
          tipo_consulta: string | null
          email: string | null
          convite_enviado: boolean | null
          user_id: string | null
          created_at: string
          updated_at: string | null
          motivo_cancelamento: string | null
        }
        Insert: {
          id?: number
          titulo?: string | null
          descricao?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          telefone?: string | null
          data?: string | null
          hora_inicio?: string | null
          hora_termino?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
          duracao?: number | null
          status?: string | null
          nome_profissional?: string | null
          tipo_consulta?: string | null
          email?: string | null
          convite_enviado?: boolean | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
          motivo_cancelamento?: string | null
        }
        Update: {
          id?: number
          titulo?: string | null
          descricao?: string | null
          profissional_id?: number | null
          cliente_id?: number | null
          telefone?: string | null
          data?: string | null
          hora_inicio?: string | null
          hora_termino?: string | null
          cancelado?: boolean | null
          cancelado_as?: string | null
          duracao?: number | null
          status?: string | null
          nome_profissional?: string | null
          tipo_consulta?: string | null
          email?: string | null
          convite_enviado?: boolean | null
          user_id?: string | null
          created_at?: string
          updated_at?: string | null
          motivo_cancelamento?: string | null
        }
      }
    }
    Views: {
      vw_profissionais: {
        Row: {
          id: number
          usuario_id: number | null
          nome: string | null
          identificacao: string | null
          especialidade: string | null
        }
      }
      vw_contatos_contas: {
        Row: {
          id: number
          nome: string | null
          email: string | null
          telefone: string | null
          cargo: string | null
          origem: string | null
          conta: number | null
          status: string
          tags: string[] | null
          endereco: string | null
          numero: number | null
          bairro: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          user_id: string
          created_at: string
          updated_at: string | null
          nome_fantasia: string | null
          razao_social: string | null
        }
      }
    }
  }
}