import { ref, computed, useAsyncData } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type VwProfissionalRow = Database['public']['Views']['vw_profissionais']['Row']

const PAGE_SIZE = 10

export const useProfissionais = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = PAGE_SIZE
  const searchQuery = ref('')

  const { data, pending: loading, refresh: refreshProfissionais } = useAsyncData(
    () => `profissionais-page-${currentPage.value}-${searchQuery.value}`,
    async () => {
      const from = (currentPage.value - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      let query = supabase
        .from('vw_profissionais')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to)

      if (searchQuery.value.trim()) {
        query = query.or(
          `nome.ilike.%${searchQuery.value.trim()}%,identificacao.ilike.%${searchQuery.value.trim()}%,especialidade.ilike.%${searchQuery.value.trim()}%`
        )
      }

      const { data, count, error: sbError } = await query
      if (sbError) throw sbError
      return { rows: (data ?? []) as VwProfissionalRow[], total: (count ?? 0) as number }
    },
    { server: false, watch: [currentPage, searchQuery] }
  )

  const profissionais = computed(() => data.value?.rows ?? [])
  const totalItems = computed(() => data.value?.total ?? 0)

  const fetchProfissionalById = async (id: number): Promise<VwProfissionalRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('vw_profissionais')
        .select('*')
        .eq('id', id)
        .single()
      if (sbError) throw sbError
      return data as VwProfissionalRow
    } catch (err) {
      console.error('[useProfissionais] Erro ao buscar profissional por id:', err)
      error.value = 'Erro ao buscar profissional.'
      return null
    }
  }

  const fetchProfissionalByUsuarioId = async (usuarioId: number): Promise<VwProfissionalRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('vw_profissionais')
        .select('*')
        .eq('id', usuarioId)
        .maybeSingle()
      if (sbError) throw sbError
      return data as VwProfissionalRow | null
    } catch (err) {
      console.error('[useProfissionais] Erro ao buscar profissional por usuario_id:', err)
      error.value = 'Erro ao buscar profissional.'
      return null
    }
  }

  return {
    profissionais,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    searchQuery,
    refreshProfissionais,
    fetchProfissionalById,
    fetchProfissionalByUsuarioId
  }
}
