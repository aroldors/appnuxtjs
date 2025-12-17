import type { Lead, DashboardStats } from '~~/shared/types'

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Carlos Eduardo',
    company: 'TechCorp LTDA',
    email: 'carlos@techcorp.com',
    phone: '(11) 99999-1234',
    position: 'Diretor de TI',
    status: 'novo',
    potentialValue: 15000,
    source: 'LinkedIn',
    companyId: 'company-1',
    assignedUserId: '1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Ana Paula',
    company: 'Startup XYZ',
    email: 'ana@startupxyz.com',
    phone: '(11) 88888-5678',
    position: 'CEO',
    status: 'em-contato',
    potentialValue: 25000,
    source: 'Indicação',
    companyId: 'company-1',
    assignedUserId: '2',
    lastContact: new Date('2024-12-03'),
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-03')
  },
  {
    id: '3',
    name: 'Roberto Lima',
    company: 'Indústria ABC',
    email: 'roberto@industriaabc.com',
    phone: '(11) 77777-9876',
    position: 'Gerente Comercial',
    status: 'proposta-enviada',
    potentialValue: 45000,
    source: 'Website',
    notes: 'Interessado em solução completa',
    companyId: 'company-1',
    assignedUserId: '1',
    lastContact: new Date('2024-12-02'),
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '4',
    name: 'Mariana Costa',
    company: 'Consultoria MN',
    email: 'mariana@consultoriamn.com',
    phone: '(11) 66666-4321',
    position: 'Sócia',
    status: 'fechado-ganho',
    potentialValue: 30000,
    source: 'LinkedIn',
    companyId: 'company-1',
    assignedUserId: '2',
    lastContact: new Date('2024-11-30'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '5',
    name: 'Pedro Santos',
    company: 'Comércio PQ',
    email: 'pedro@comerciopq.com',
    phone: '(11) 55555-1111',
    position: 'Proprietário',
    status: 'fechado-perdido',
    potentialValue: 8000,
    source: 'Cold Email',
    notes: 'Não teve orçamento aprovado',
    companyId: 'company-1',
    assignedUserId: '1',
    lastContact: new Date('2024-11-29'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-29')
  }
]

export const useLeads = () => {
  const leads = useState<Lead[]>('leads.data', () => mockLeads)
  const loading = ref(false)

  const getLeads = () => {
    return leads.value
  }

  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.value.filter(lead => lead.status === status)
  }

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const leadIndex = leads.value.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      const existingLead = leads.value[leadIndex]
      leads.value[leadIndex] = {
        ...existingLead,
        status: newStatus,
        updatedAt: new Date()
      } as Lead
    }
  }

  const createLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      companyId: 'company-1', // TODO: usar company do user store quando implementado
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    leads.value.push(newLead)
    return newLead
  }

  const updateLead = (leadId: string, leadData: Partial<Lead>) => {
    const leadIndex = leads.value.findIndex(lead => lead.id === leadId)
    if (leadIndex !== -1) {
      const existingLead = leads.value[leadIndex]
      leads.value[leadIndex] = {
        ...existingLead,
        ...leadData,
        updatedAt: new Date()
      } as Lead
    }
  }

  const deleteLead = (leadId: string) => {
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
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
      )
    }

    return filteredLeads
  }

  return {
    leads: readonly(leads),
    loading: readonly(loading),
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