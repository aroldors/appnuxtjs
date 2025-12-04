import type { Contact } from '~~/shared/types'

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Carlos Eduardo',
    email: 'carlos@techcorp.com',
    phone: '(11) 99999-1234',
    company: 'TechCorp LTDA',
    position: 'Diretor de TI',
    source: 'LinkedIn',
    status: 'ativo',
    tags: ['decisor', 'tecnologia'],
    companyId: 'company-1',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Ana Paula',
    email: 'ana@startupxyz.com',
    phone: '(11) 88888-5678',
    company: 'Startup XYZ',
    position: 'CEO',
    source: 'Indicação',
    status: 'ativo',
    tags: ['ceo', 'startup', 'decisor'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-12-03')
  },
  {
    id: '3',
    name: 'Roberto Lima',
    email: 'roberto@industriaabc.com',
    phone: '(11) 77777-9876',
    company: 'Indústria ABC',
    position: 'Gerente Comercial',
    source: 'Website',
    status: 'ativo',
    tags: ['comercial', 'indústria'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-25'),
    updatedAt: new Date('2024-12-02')
  },
  {
    id: '4',
    name: 'Mariana Costa',
    email: 'mariana@consultoriamn.com',
    phone: '(11) 66666-4321',
    company: 'Consultoria MN',
    position: 'Sócia',
    source: 'LinkedIn',
    status: 'ativo',
    tags: ['consultoria', 'socia', 'decisor'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-30')
  },
  {
    id: '5',
    name: 'Pedro Santos',
    email: 'pedro@comerciopq.com',
    phone: '(11) 55555-1111',
    company: 'Comércio PQ',
    position: 'Proprietário',
    source: 'Cold Email',
    status: 'inativo',
    tags: ['comercio', 'proprietario'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-29')
  }
]

export const useContacts = () => {
  const contacts = useState<Contact[]>('contacts.data', () => mockContacts)
  const loading = ref(false)

  const getContacts = () => {
    return contacts.value
  }

  const getContactById = (id: string) => {
    return contacts.value.find(contact => contact.id === id)
  }

  const createContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => {
    const { currentCompany } = useAuth()
    
    const newContact: Contact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      companyId: currentCompany.value?.id || 'company-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    contacts.value.push(newContact)
    return newContact
  }

  const updateContact = (contactId: string, contactData: Partial<Contact>) => {
    const contactIndex = contacts.value.findIndex(contact => contact.id === contactId)
    if (contactIndex !== -1) {
      const existingContact = contacts.value[contactIndex]
      contacts.value[contactIndex] = {
        ...existingContact,
        ...contactData,
        updatedAt: new Date()
      } as Contact
    }
  }

  const deleteContact = (contactId: string) => {
    const contactIndex = contacts.value.findIndex(contact => contact.id === contactId)
    if (contactIndex !== -1) {
      contacts.value.splice(contactIndex, 1)
    }
  }

  const filterContacts = (filters: {
    status?: Contact['status'][]
    source?: string[]
    company?: string
    search?: string
    tags?: string[]
  }) => {
    let filteredContacts = [...contacts.value]

    if (filters.status?.length) {
      filteredContacts = filteredContacts.filter(contact => filters.status!.includes(contact.status))
    }

    if (filters.source?.length) {
      filteredContacts = filteredContacts.filter(contact => filters.source!.includes(contact.source))
    }

    if (filters.company) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.company.toLowerCase().includes(filters.company!.toLowerCase())
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredContacts = filteredContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.company.toLowerCase().includes(searchLower) ||
        contact.position.toLowerCase().includes(searchLower)
      )
    }

    if (filters.tags?.length) {
      filteredContacts = filteredContacts.filter(contact =>
        filters.tags!.some(tag => contact.tags.includes(tag))
      )
    }

    return filteredContacts
  }

  const getContactsStats = () => {
    const total = contacts.value.length
    const active = contacts.value.filter(c => c.status === 'ativo').length
    const inactive = contacts.value.filter(c => c.status === 'inativo').length
    const blocked = contacts.value.filter(c => c.status === 'bloqueado').length

    const sourceBreakdown = contacts.value.reduce((acc, contact) => {
      acc[contact.source] = (acc[contact.source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      active,
      inactive,
      blocked,
      sourceBreakdown
    }
  }

  const importFromSpreadsheet = async (data: any[]) => {
    // Simular importação
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const importedContacts = data.map(item => ({
      id: `imported-${Date.now()}-${Math.random()}`,
      name: item.nome || item.name,
      email: item.email,
      phone: item.telefone || item.phone,
      company: item.empresa || item.company,
      position: item.cargo || item.position,
      source: 'Importação',
      status: 'ativo' as Contact['status'],
      tags: [],
      companyId: 'company-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    contacts.value.push(...importedContacts)
    loading.value = false
    
    return importedContacts.length
  }

  return {
    contacts: readonly(contacts),
    loading: readonly(loading),
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    filterContacts,
    getContactsStats,
    importFromSpreadsheet
  }
}