import { ref, useState } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '../types/database'

type ContaRow = Database['public']['Tables']['contas']['Row']
type ContaInsert = Database['public']['Tables']['contas']['Insert']
type ContaUpdate = Database['public']['Tables']['contas']['Update']

export const useContas = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const contas = useState<ContaRow[]>('contas.data', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchContas = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: sbError } = await supabase
        .from('contas')
        .select('*')
        .order('id', { ascending: false })

      if (sbError) throw sbError
      contas.value = data ?? []
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
      const { data, error: sbError } = await supabase
        .from('contas')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (sbError) throw sbError
      const index = contas.value.findIndex(c => c.id === id)
      if (index !== -1) contas.value[index] = data as ContaRow
      return data as ContaRow
    } catch (err) {
      console.error('[useContas] Erro ao atualizar conta:', err)
      error.value = 'Erro ao atualizar conta.'
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
    fetchContas,
    insertConta,
    updateConta,
    deleteConta
  }
}
