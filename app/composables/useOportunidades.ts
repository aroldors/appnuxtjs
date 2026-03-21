import type { Oportunidade } from '~~/shared/types'
import type { Database } from '../types/database'

type OportunidadeRow = Database['public']['Tables']['oportunidades']['Row']

function mapRowToOportunidade(row: OportunidadeRow): Oportunidade {
  return {
    id: String(row.id),
    name: row.nome ?? '',
    address: row.endereco ?? undefined,
    number: row.numero ?? undefined,
    neighborhood: row.bairro ?? undefined,
    city: row.cidade ?? undefined,
    state: row.estado ?? undefined,
    zipCode: row.cep ?? undefined,
    phone: row.telefone ?? undefined,
    email: row.email ?? undefined,
    linkedin: row.linkedin ?? undefined,
    position: row.cargo ?? undefined,
    businessSector: row.ramo_atividade ?? undefined,
    opportunityValue: row.vlr_oportunidade ?? 0,
    status: (row.status as Oportunidade['status']) ?? 'novo',
    source: row.origem ?? undefined,
    notes: row.observacoes ?? undefined,
    summary: row.resumo ?? undefined,
    userId: row.user_id ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(row.created_at)
  }
}

export const useOportunidades = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const oportunidades = useState<Oportunidade[]>('oportunidades.data', () => [])
  const loading = useState<boolean>('oportunidades.loading', () => false)

  const fetchOportunidades = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('oportunidades')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error
      oportunidades.value = (data ?? []).map(mapRowToOportunidade)
    } catch (err) {
      console.error('[useOportunidades] Erro ao buscar oportunidades:', err)
    } finally {
      loading.value = false
    }
  }

  const getOportunidades = () => {
    return oportunidades.value
  }

  const getOportunidadesByStatus = (status: Oportunidade['status']) => {
    return oportunidades.value.filter(o => o.status === status)
  }

  const updateOportunidadeStatus = async (oportunidadeId: string, newStatus: Oportunidade['status']) => {
    const index = oportunidades.value.findIndex(o => o.id === oportunidadeId)
    const previousStatus = oportunidades.value[index]?.status

    if (index !== -1) {
      oportunidades.value[index] = {
        ...oportunidades.value[index],
        status: newStatus,
        updatedAt: new Date()
      } as Oportunidade
    }

    const { error } = await supabase
      .from('oportunidades')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', Number(oportunidadeId))

    if (error) {
      console.error('[useOportunidades] Erro ao atualizar status:', error)
      if (index !== -1 && previousStatus) {
        oportunidades.value[index] = {
          ...oportunidades.value[index],
          status: previousStatus,
          updatedAt: new Date()
        } as Oportunidade
      }
    }
  }

  const createOportunidade = async (data: Omit<Oportunidade, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const { data: created, error } = await supabase
      .from('oportunidades')
      .insert({
        nome: data.name,
        endereco: data.address ?? null,
        numero: data.number ?? null,
        bairro: data.neighborhood ?? null,
        cidade: data.city ?? null,
        estado: data.state ?? null,
        cep: data.zipCode ?? null,
        telefone: data.phone ?? null,
        email: data.email ?? null,
        linkedin: data.linkedin ?? null,
        cargo: data.position ?? null,
        ramo_atividade: data.businessSector ?? null,
        vlr_oportunidade: data.opportunityValue,
        status: data.status,
        origem: data.source ?? null,
        observacoes: data.notes ?? null,
        resumo: data.summary ?? null
      })
      .select()
      .single()

    if (error) {
      console.error('[useOportunidades] Erro ao criar oportunidade:', error)
      return null
    }

    const newOportunidade = mapRowToOportunidade(created as OportunidadeRow)
    oportunidades.value.unshift(newOportunidade)
    return newOportunidade
  }

  const updateOportunidade = async (oportunidadeId: string, data: Partial<Oportunidade>) => {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (data.name !== undefined) updatePayload.nome = data.name
    if (data.address !== undefined) updatePayload.endereco = data.address
    if (data.number !== undefined) updatePayload.numero = data.number
    if (data.neighborhood !== undefined) updatePayload.bairro = data.neighborhood
    if (data.city !== undefined) updatePayload.cidade = data.city
    if (data.state !== undefined) updatePayload.estado = data.state
    if (data.zipCode !== undefined) updatePayload.cep = data.zipCode
    if (data.phone !== undefined) updatePayload.telefone = data.phone
    if (data.email !== undefined) updatePayload.email = data.email
    if (data.linkedin !== undefined) updatePayload.linkedin = data.linkedin
    if (data.position !== undefined) updatePayload.cargo = data.position
    if (data.businessSector !== undefined) updatePayload.ramo_atividade = data.businessSector
    if (data.opportunityValue !== undefined) updatePayload.vlr_oportunidade = data.opportunityValue
    if (data.status !== undefined) updatePayload.status = data.status
    if (data.source !== undefined) updatePayload.origem = data.source
    if (data.notes !== undefined) updatePayload.observacoes = data.notes
    if (data.summary !== undefined) updatePayload.resumo = data.summary

    const { error } = await supabase
      .from('oportunidades')
      .update(updatePayload)
      .eq('id', Number(oportunidadeId))

    if (error) {
      console.error('[useOportunidades] Erro ao atualizar oportunidade:', error)
      return
    }

    const index = oportunidades.value.findIndex(o => o.id === oportunidadeId)
    if (index !== -1) {
      oportunidades.value[index] = {
        ...oportunidades.value[index],
        ...data,
        updatedAt: new Date()
      } as Oportunidade
    }
  }

  const deleteOportunidade = async (oportunidadeId: string) => {
    const { error } = await supabase
      .from('oportunidades')
      .delete()
      .eq('id', Number(oportunidadeId))

    if (error) {
      console.error('[useOportunidades] Erro ao deletar oportunidade:', error)
      return
    }

    const index = oportunidades.value.findIndex(o => o.id === oportunidadeId)
    if (index !== -1) {
      oportunidades.value.splice(index, 1)
    }
  }

  const filterOportunidades = (filters: {
    status?: Oportunidade['status'][]
    source?: string[]
    search?: string
  }) => {
    let result = [...oportunidades.value]

    if (filters.status?.length) {
      result = result.filter(o => filters.status!.includes(o.status))
    }

    if (filters.source?.length) {
      result = result.filter(o => o.source && filters.source!.includes(o.source))
    }

    if (filters.search?.trim()) {
      const search = filters.search.toLowerCase()
      result = result.filter(o =>
        o.name.toLowerCase().includes(search) ||
        o.email?.toLowerCase().includes(search) ||
        o.phone?.toLowerCase().includes(search) ||
        o.position?.toLowerCase().includes(search) ||
        o.city?.toLowerCase().includes(search)
      )
    }

    return result
  }

  return {
    oportunidades,
    loading,
    fetchOportunidades,
    getOportunidades,
    getOportunidadesByStatus,
    updateOportunidadeStatus,
    createOportunidade,
    updateOportunidade,
    deleteOportunidade,
    filterOportunidades
  }
}
