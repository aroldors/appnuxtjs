import { ref, useState } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type ContaRow = Database['public']['Tables']['contas']['Row']
type ContaInsert = Database['public']['Tables']['contas']['Insert']
type ContaUpdate = Database['public']['Tables']['contas']['Update']

const PAGE_SIZE = 10

export const useContas = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const contas = useState<ContaRow[]>('contas.data', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const totalItems = ref(0)
  const pageSize = PAGE_SIZE

  const fetchContas = async (page = 1) => {
    loading.value = true
    error.value = null
    currentPage.value = page
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    try {
      const { data, count, error: sbError } = await supabase
        .from('contas')
        .select('*', { count: 'exact' })
        .order('id', { ascending: false })
        .range(from, to)

      if (sbError) throw sbError
      contas.value = data ?? []
      totalItems.value = count ?? 0
    } catch (err) {
      console.error('[useContas] Erro ao buscar contas:', err)
      error.value = 'Erro ao buscar contas.'
    } finally {
      loading.value = false
    }
  }

  const insertConta = async (conta: ContaInsert): Promise<ContaRow | null> => {
    loading.value = true
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contas')
        .insert(conta)
        .select()
        .single()

      if (sbError) throw sbError
      contas.value = [data, ...contas.value]
      return data as ContaRow
    } catch (err) {
      console.error('[useContas] Erro ao inserir conta:', err)
      error.value = 'Erro ao inserir conta.'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateConta = async (id: number, updates: ContaUpdate): Promise<ContaRow | null> => {
    loading.value = true
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

      // Se RLS bloquear o SELECT pós-update, data será null mas o update ocorreu.
      // Nesse caso usa o registro do estado local como fallback.
      const updatedRow = (data as ContaRow) ?? contas.value.find(c => c.id === id) ?? null
      const index = contas.value.findIndex(c => c.id === id)
      if (index !== -1 && updatedRow) contas.value[index] = updatedRow
      return updatedRow
    } catch (err: unknown) {
      console.error('[useContas] Erro ao atualizar conta:', err)
      const e = err as Record<string, unknown>
      error.value = (e?.message as string) ?? (e?.error_description as string) ?? JSON.stringify(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteConta = async (id: number): Promise<boolean> => {
    loading.value = true
    error.value = null
    try {
      const { error: sbError } = await supabase
        .from('contas')
        .delete()
        .eq('id', id)

      if (sbError) throw sbError
      contas.value = contas.value.filter(c => c.id !== id)
      return true
    } catch (err) {
      console.error('[useContas] Erro ao deletar conta:', err)
      error.value = 'Erro ao deletar conta.'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    contas,
    loading,
    error,
    currentPage,
    totalItems,
    pageSize,
    fetchContas,
    insertConta,
    updateConta,
    deleteConta
  }
}
