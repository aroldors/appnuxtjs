import { ref, computed, useAsyncData } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type ContaRow = Database['public']['Tables']['contas']['Row']
type ContaInsert = Database['public']['Tables']['contas']['Insert']
type ContaUpdate = Database['public']['Tables']['contas']['Update']

const PAGE_SIZE = 5

export const useContas = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = PAGE_SIZE
  const searchQuery = ref('')

  const { data, pending: loading, refresh: refreshContas } = useAsyncData(
    () => `contas-page-${currentPage.value}-${searchQuery.value}`,
    async () => {
      const from = (currentPage.value - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      let query = supabase
        .from('contas')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to)

      if (searchQuery.value.trim()) {
        query = query.or(
          `nome_fantasia.ilike.%${searchQuery.value.trim()}%,razao_social.ilike.%${searchQuery.value.trim()}%`
        )
      }

      const { data, count, error: sbError } = await query
      if (sbError) throw sbError
      return { rows: (data ?? []) as ContaRow[], total: (count ?? 0) as number }
    },
    { watch: [currentPage, searchQuery] }
  )

  const contas = computed(() => data.value?.rows ?? [])
  const totalItems = computed(() => data.value?.total ?? 0)

  const insertConta = async (conta: ContaInsert): Promise<ContaRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contas')
        .insert(conta)
        .select()
        .single()

      if (sbError) throw sbError
      return data as ContaRow
    } catch (err) {
      console.error('[useContas] Erro ao inserir conta:', err)
      error.value = 'Erro ao inserir conta.'
      return null
    }
  }

  const updateConta = async (id: number, updates: ContaUpdate): Promise<ContaRow | null> => {
    error.value = null
    try {
      // Desestrutura updated_at para ignorar qualquer valor vindo do payload
      // e garante que o timestamp enviado ao Supabase seja sempre o atual em timestamptz
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

      const { data, error: sbError } = await supabase
        .from('contas')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (sbError) throw sbError
      return (data as ContaRow) ?? null
    } catch (err: unknown) {
      console.error('[useContas] Erro ao atualizar conta:', err)
      const e = err as Record<string, unknown>
      error.value = (e?.message as string) ?? (e?.error_description as string) ?? JSON.stringify(err)
      return null
    }
  }

  const fetchContaById = async (id: number): Promise<ContaRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contas')
        .select('*')
        .eq('id', id)
        .single()
      if (sbError) throw sbError
      return data as ContaRow
    } catch (err) {
      console.error('[useContas] Erro ao buscar conta por id:', err)
      error.value = 'Erro ao buscar conta.'
      return null
    }
  }

  const deleteConta = async (id: number): Promise<boolean> => {
    error.value = null
    try {
      const { error: sbError } = await supabase
        .from('contas')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      return true
    } catch (err) {
      console.error('[useContas] Erro ao deletar conta:', err)
      error.value = 'Erro ao deletar conta.'
      return false
    }
  }

  return {
    contas,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    searchQuery,
    refreshContas,
    insertConta,
    updateConta,
    deleteConta,
    fetchContaById
  }
}
