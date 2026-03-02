import { ref, computed, useAsyncData } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type ContatoRow = Database['public']['Tables']['contatos']['Row']
type ContatoInsert = Database['public']['Tables']['contatos']['Insert']
type ContatoUpdate = Database['public']['Tables']['contatos']['Update']

const PAGE_SIZE = 10

export const useContacts = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const pageSize = PAGE_SIZE
  const searchQuery = ref('')

  const { data, pending: loading, refresh: refreshContacts } = useAsyncData(
    () => `contatos-page-${currentPage.value}-${searchQuery.value}`,
    async () => {
      const from = (currentPage.value - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      let query = supabase
        .from('contatos')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to)

      if (searchQuery.value.trim()) {
        query = query.or(
          `nome.ilike.%${searchQuery.value.trim()}%,email.ilike.%${searchQuery.value.trim()}%,cidade.ilike.%${searchQuery.value.trim()}%`
        )
      }

      const { data, count, error: sbError } = await query
      if (sbError) throw sbError
      return { rows: (data ?? []) as ContatoRow[], total: (count ?? 0) as number }
    },
    { watch: [currentPage, searchQuery] }
  )

  const contacts = computed(() => data.value?.rows ?? [])
  const totalItems = computed(() => data.value?.total ?? 0)

  const insertContact = async (contato: ContatoInsert): Promise<ContatoRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contatos')
        .insert(contato)
        .select()
        .single()

      if (sbError) throw sbError
      return data as ContatoRow
    } catch (err) {
      console.error('[useContacts] Erro ao inserir contato:', err)
      error.value = 'Erro ao inserir contato.'
      return null
    }
  }

  const updateContact = async (id: number, updates: ContatoUpdate): Promise<ContatoRow | null> => {
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

      const { data, error: sbError } = await supabase
        .from('contatos')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (sbError) throw sbError
      return (data as ContatoRow) ?? null
    } catch (err: unknown) {
      console.error('[useContacts] Erro ao atualizar contato:', err)
      const e = err as Record<string, unknown>
      error.value = (e?.message as string) ?? (e?.error_description as string) ?? JSON.stringify(err)
      return null
    }
  }

  const fetchContactById = async (id: number): Promise<ContatoRow | null> => {
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contatos')
        .select('*')
        .eq('id', id)
        .single()
      if (sbError) throw sbError
      return data as ContatoRow
    } catch (err) {
      console.error('[useContacts] Erro ao buscar contato por id:', err)
      error.value = 'Erro ao buscar contato.'
      return null
    }
  }

  const deleteContact = async (id: number): Promise<boolean> => {
    error.value = null
    try {
      const { error: sbError } = await supabase
        .from('contatos')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      return true
    } catch (err) {
      console.error('[useContacts] Erro ao deletar contato:', err)
      error.value = 'Erro ao deletar contato.'
      return false
    }
  }

  return {
    contacts,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    searchQuery,
    refreshContacts,
    insertContact,
    updateContact,
    deleteContact,
    fetchContactById
  }
}