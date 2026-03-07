import { ref, computed, useAsyncData, useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type EspecialidadeRow = Database['public']['Tables']['especialidades']['Row']
type EspecialidadeInsert = Database['public']['Tables']['especialidades']['Insert']
type EspecialidadeUpdate = Database['public']['Tables']['especialidades']['Update']

const PAGE_SIZE = 10

export const useEspecialidades = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = PAGE_SIZE
  const searchQuery = ref('')

  const { data, pending: loading, refresh: refreshEspecialidades } = useAsyncData(
    () => `especialidades-page-${currentPage.value}-${searchQuery.value}`,
    async () => {
      const from = (currentPage.value - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('especialidades')
        .select('*', { count: 'exact' })
        .order('id', { ascending: true })
        .range(from, to)

      if (searchQuery.value.trim()) {
        const term = searchQuery.value.trim()
        query = query.ilike('descricao', `%${term}%`)
      }

      const { data, count, error: sbError } = await query
      if (sbError) throw sbError
      return { rows: (data ?? []) as EspecialidadeRow[], total: (count ?? 0) as number }
    },
    { server: false, watch: [currentPage, searchQuery] }
  )

  const especialidades = computed(() => data.value?.rows ?? [])
  const totalItems = computed(() => data.value?.total ?? 0)

  const insertEspecialidade = async (especialidade: EspecialidadeInsert): Promise<EspecialidadeRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('especialidades')
        .insert(especialidade)
        .select()
        .single()

      if (sbError) throw sbError
      return data as EspecialidadeRow
    } catch (err) {
      console.error('[useEspecialidades] Erro ao inserir especialidade:', err)
      error.value = 'Erro ao inserir especialidade.'
      return null
    }
  }

  const updateEspecialidade = async (id: number, updates: EspecialidadeUpdate): Promise<EspecialidadeRow | null> => {
    error.value = null
    try {
      const { upated_at: _ignored, ...safeUpdates } = updates
      const payload = {
        ...safeUpdates,
        upated_at: new Date().toISOString()
      }

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) {
        error.value = 'Usuário não autenticado.'
        return null
      }

      const { data, error: sbError } = await supabase
        .from('especialidades')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (sbError) throw sbError
      return (data as EspecialidadeRow) ?? null
    } catch (err: unknown) {
      console.error('[useEspecialidades] Erro ao atualizar especialidade:', err)
      const e = err as Record<string, unknown>
      error.value = (e?.message as string) ?? (e?.error_description as string) ?? JSON.stringify(err)
      return null
    }
  }

  const fetchEspecialidadeById = async (id: number): Promise<EspecialidadeRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('especialidades')
        .select('*')
        .eq('id', id)
        .single()
      if (sbError) throw sbError
      return data as EspecialidadeRow
    } catch (err) {
      console.error('[useEspecialidades] Erro ao buscar especialidade por id:', err)
      error.value = 'Erro ao buscar especialidade.'
      return null
    }
  }

  const deleteEspecialidade = async (id: number): Promise<boolean> => {
    error.value = null
    try {
      const { error: sbError } = await supabase
        .from('especialidades')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      return true
    } catch (err) {
      console.error('[useEspecialidades] Erro ao deletar especialidade:', err)
      error.value = 'Erro ao deletar especialidade.'
      return false
    }
  }

  return {
    especialidades,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    searchQuery,
    refreshEspecialidades,
    insertEspecialidade,
    updateEspecialidade,
    deleteEspecialidade,
    fetchEspecialidadeById
  }
}
