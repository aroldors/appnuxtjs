import { ref, computed, useAsyncData, useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type AgendamentoRow = Database['public']['Tables']['agendamentos']['Row']
type AgendamentoInsert = Database['public']['Tables']['agendamentos']['Insert']
type AgendamentoUpdate = Database['public']['Tables']['agendamentos']['Update']

const PAGE_SIZE = 20

export const useAgendamentos = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = PAGE_SIZE
  const searchQuery = ref('')
  const dataInicio = ref<string | null>(null)
  const dataFim = ref<string | null>(null)

  const { data, pending: loading, refresh: refreshAgendamentos } = useAsyncData(
    () => `agendamentos-page-${currentPage.value}-${searchQuery.value}-${dataInicio.value}-${dataFim.value}`,
    async () => {
      const from = (currentPage.value - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('agendamentos')
        .select('*', { count: 'exact' })
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })
        .range(from, to)

      if (searchQuery.value.trim()) {
        const term = searchQuery.value.trim()
        query = query.or(
          `titulo.ilike.%${term}%,nome_profissional.ilike.%${term}%,telefone.ilike.%${term}%,email.ilike.%${term}%`
        )
      }

      if (dataInicio.value) {
        query = query.gte('data', dataInicio.value)
      }

      if (dataFim.value) {
        query = query.lte('data', dataFim.value)
      }

      const { data, count, error: sbError } = await query
      if (sbError) throw sbError
      return { rows: (data ?? []) as AgendamentoRow[], total: (count ?? 0) as number }
    },
    { server: false, watch: [currentPage, searchQuery, dataInicio, dataFim] }
  )

  const agendamentos = computed(() => data.value?.rows ?? [])
  const totalItems = computed(() => data.value?.total ?? 0)

  const fetchAgendamentosByPeriodo = async (inicio: string, fim: string, profissionalId?: number | null): Promise<AgendamentoRow[]> => {
    error.value = null
    try {
      let query = supabase
        .from('agendamentos')
        .select('*')
        .gte('data', inicio)
        .lte('data', fim)
        .order('data', { ascending: true })
        .order('hora_inicio', { ascending: true })

      if (profissionalId != null) {
        query = query.eq('profissional_id', profissionalId)
      }

      const { data: rows, error: sbError } = await query
      if (sbError) throw sbError
      return (rows ?? []) as AgendamentoRow[]
    } catch (err) {
      console.error('[useAgendamentos] Erro ao buscar agendamentos por período:', err)
      error.value = 'Erro ao buscar agendamentos.'
      return []
    }
  }

  const fetchAgendamentoById = async (id: number): Promise<AgendamentoRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('id', id)
        .single()
      if (sbError) throw sbError
      return data as AgendamentoRow
    } catch (err) {
      console.error('[useAgendamentos] Erro ao buscar agendamento por id:', err)
      error.value = 'Erro ao buscar agendamento.'
      return null
    }
  }

  const insertAgendamento = async (agendamento: AgendamentoInsert): Promise<AgendamentoRow | null> => {
    error.value = null
    try {
      // checagem de conflito: evita sobreposição para o mesmo profissional e data
      if (agendamento.profissional_id != null && agendamento.data && agendamento.hora_inicio && agendamento.hora_termino) {
        const { data: conflicts, error: confErr } = await supabase
          .from('agendamentos')
          .select('id')
          .eq('profissional_id', agendamento.profissional_id)
          .eq('data', agendamento.data)
          .not('hora_termino', 'lte', agendamento.hora_inicio)
          .not('hora_inicio', 'gte', agendamento.hora_termino)
          .limit(1)

        if (confErr) throw confErr
        if (conflicts && (conflicts as any).length > 0) {
          error.value = 'Conflito de horário com agendamento existente.'
          return null
        }
      }
      const { data, error: sbError } = await supabase
        .from('agendamentos')
        .insert(agendamento)
        .select()
        .single()
      if (sbError) throw sbError
      return data as AgendamentoRow
    } catch (err) {
      console.error('[useAgendamentos] Erro ao inserir agendamento:', err)
      error.value = 'Erro ao inserir agendamento.'
      return null
    }
  }

  const updateAgendamento = async (id: number, updates: AgendamentoUpdate): Promise<AgendamentoRow | null> => {
    error.value = null
    try {
      const { updated_at: _ignored, ...safeUpdates } = updates
      const payload = {
        ...safeUpdates,
        updated_at: new Date().toISOString()
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        error.value = 'Usuário não autenticado.'
        return null
      }

      // checagem de conflito para update: exclui o próprio registro
      if (payload.profissional_id != null && payload.data && payload.hora_inicio && payload.hora_termino) {
        const { data: conflicts, error: confErr } = await supabase
          .from('agendamentos')
          .select('id')
          .eq('profissional_id', payload.profissional_id)
          .eq('data', payload.data)
          .not('hora_termino', 'lte', payload.hora_inicio)
          .not('hora_inicio', 'gte', payload.hora_termino)
          .neq('id', id)
          .limit(1)

        if (confErr) throw confErr
        if (conflicts && (conflicts as any).length > 0) {
          error.value = 'Conflito de horário com agendamento existente.'
          return null
        }
      }

      const { data, error: sbError } = await supabase
        .from('agendamentos')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (sbError) throw sbError
      return (data as AgendamentoRow) ?? null
    } catch (err: unknown) {
      console.error('[useAgendamentos] Erro ao atualizar agendamento:', err)
      const e = err as Record<string, unknown>
      error.value = (e?.message as string) ?? (e?.error_description as string) ?? JSON.stringify(err)
      return null
    }
  }

  const cancelarAgendamento = async (id: number, motivo?: string): Promise<AgendamentoRow | null> => {
    return updateAgendamento(id, {
      cancelado: true,
      cancelado_as: new Date().toISOString(),
      motivo_cancelamento: motivo ?? null,
      status: 'cancelado'
    })
  }

  const deleteAgendamento = async (id: number): Promise<boolean> => {
    error.value = null
    try {
      const { error: sbError } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id)
      if (sbError) throw sbError
      return true
    } catch (err) {
      console.error('[useAgendamentos] Erro ao deletar agendamento:', err)
      error.value = 'Erro ao deletar agendamento.'
      return false
    }
  }

  return {
    agendamentos,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    searchQuery,
    dataInicio,
    dataFim,
    refreshAgendamentos,
    fetchAgendamentosByPeriodo,
    fetchAgendamentoById,
    insertAgendamento,
    updateAgendamento,
    cancelarAgendamento,
    deleteAgendamento
  }
}
