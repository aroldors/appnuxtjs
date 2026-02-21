import type { Lead, DashboardStats } from '~~/shared/types'
import type { Database } from '../types/database'

type LeadRow = Database['public']['Tables']['leads']['Row']

function mapRowToLead(row: LeadRow): Lead {
  return {
    id: String(row.id),
    name: row.nome ?? '',
    company: '',  // campo não existe na tabela leads
    email: row.email ?? '',
    phone: row.telefone ?? '',
    position: row.cargo ?? '',
    linkedin: row.linkedin ?? undefined,
    businessSector: row.ramo_atividade ?? undefined,
    status: (row.status as Lead['status']) ?? 'novo',
    potentialValue: row.vlr_oportunidade ?? 0,
    source: row.origem ?? '',
    notes: row.observacoes ?? undefined,
    companyId: '',  // campo não existe na tabela leads
    assignedUserId: row.user_id ?? '',
    createdAt: new Date(row.created_at),
    updatedAt: row.updated_at ? new Date(row.updated_at) : new Date(row.created_at)
  }
}

export const useLeads = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = useSupabaseClient() as any
  const leads = useState<Lead[]>('leads.data', () => [])
  const loading = ref(false)

  const fetchLeads = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('id', { ascending: false })

      console.log('[useLeads] fetchLeads → data:', data, '| error:', error)
      if (error) throw error
      leads.value = (data ?? []).map(mapRowToLead)
      console.log('[useLeads] leads carregados:', leads.value.length)
    } catch (err) {
      console.error('[useLeads] Erro ao buscar leads:', err)
    } finally {
      loading.value = false
    }
  }

  const getLeads = () => {
    return leads.value
  }

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.value.filter(lead => lead.status === status)
  }

  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', Number(leadId))

    if (error) {
      console.error('Erro ao atualizar status do lead:', error)
      return
    }

    const leadIndex = leads.value.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      leads.value[leadIndex] = {
        ...leads.value[leadIndex],
        status: newStatus,
        updatedAt: new Date()
      } as Lead
    }
  }

  const createLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'companyId' | 'assignedUserId'>) => {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        nome: leadData.name,
        email: leadData.email,
        telefone: leadData.phone,
        cargo: leadData.position,
        linkedin: leadData.linkedin ?? null,
        ramo_atividade: leadData.businessSector ?? null,
        status: leadData.status,
        vlr_oportunidade: leadData.potentialValue,
        origem: leadData.source,
        observacoes: leadData.notes ?? null
      })
      .select()
      .single()

    if (error) {
      console.error('[useLeads] Erro ao criar lead:', error)
      return null
    }

    console.log('[useLeads] Lead criado:', data)
    const newLead = mapRowToLead(data as LeadRow)
    leads.value.push(newLead)
    return newLead
  }

  const updateLead = async (leadId: string, leadData: Partial<Lead>) => {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (leadData.name !== undefined) updatePayload.nome = leadData.name
    if (leadData.email !== undefined) updatePayload.email = leadData.email
    if (leadData.phone !== undefined) updatePayload.telefone = leadData.phone
    if (leadData.position !== undefined) updatePayload.cargo = leadData.position
    if (leadData.linkedin !== undefined) updatePayload.linkedin = leadData.linkedin
    if (leadData.businessSector !== undefined) updatePayload.ramo_atividade = leadData.businessSector
    if (leadData.status !== undefined) updatePayload.status = leadData.status
    if (leadData.potentialValue !== undefined) updatePayload.vlr_oportunidade = leadData.potentialValue
    if (leadData.source !== undefined) updatePayload.origem = leadData.source
    if (leadData.notes !== undefined) updatePayload.observacoes = leadData.notes

    const { error } = await supabase
      .from('leads')
      .update(updatePayload)
      .eq('id', Number(leadId))

    if (error) {
      console.error('Erro ao atualizar lead:', error)
      return
    }

    const leadIndex = leads.value.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      leads.value[leadIndex] = {
        ...leads.value[leadIndex],
        ...leadData,
        updatedAt: new Date()
      } as Lead
    }
  }

  const deleteLead = async (leadId: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', Number(leadId))

    if (error) {
      console.error('Erro ao deletar lead:', error)
      return
    }

    const leadIndex = leads.value.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      leads.value.splice(leadIndex, 1)
    }
  }

  const getDashboardStats = (): DashboardStats => {
    const totalLeads = leads.value.length
    const convertedLeads = leads.value.filter(lead => lead.status === 'fechado-ganho').length
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0
    
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const newLeadsThisMonth = leads.value.filter(lead => 
      lead.createdAt.getMonth() === currentMonth && 
      lead.createdAt.getFullYear() === currentYear
    ).length

    const revenue = leads.value
      .filter(lead => lead.status === 'fechado-ganho')
      .reduce((sum, lead) => sum + lead.potentialValue, 0)

    return {
      totalLeads,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      messagesSent: 42, // Mock data
      newLeadsThisMonth,
      revenue
    }
  }

  const filterLeads = (filters: {
    status?: Lead['status'][]
    source?: string[]
    assignedUser?: string
    search?: string
  }) => {
    let filteredLeads = [...leads.value]

    if (filters.status?.length) {
      filteredLeads = filteredLeads.filter(lead => filters.status!.includes(lead.status))
    }

    if (filters.source?.length) {
      filteredLeads = filteredLeads.filter(lead => filters.source!.includes(lead.source))
    }

    if (filters.assignedUser) {
      filteredLeads = filteredLeads.filter(lead => lead.assignedUserId === filters.assignedUser)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredLeads = filteredLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      )
    }

    return filteredLeads
  }

  return {
    leads: readonly(leads),
    loading: readonly(loading),
    fetchLeads,
    getLeads,
    getLeadsByStatus,
    updateLeadStatus,
    createLead,
    updateLead,
    deleteLead,
    getDashboardStats,
    filterLeads
  }
}