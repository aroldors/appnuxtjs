export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'vendedor'
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  logo?: string
  cnpj: string
  timezone: string
  currency: string
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  position: string
  status: 'novo' | 'em-contato' | 'proposta-enviada' | 'fechado-ganho' | 'fechado-perdido'
  potentialValue: number
  source: string
  notes?: string
  companyId: string
  assignedUserId: string
  lastContact?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  position: string
  source: string
  status: 'ativo' | 'inativo' | 'bloqueado'
  tags: string[]
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface MessageTemplate {
  id: string
  title: string
  type: 'whatsapp' | 'email'
  content: string
  tags: string[]
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  messagesSent: number
  newLeadsThisMonth: number
  revenue: number
}

export interface FilterOptions {
  dateRange: {
    start: Date
    end: Date
  }
  status?: string[]
  source?: string[]
  assignedUser?: string
}