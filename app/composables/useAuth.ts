import type { User, Company } from '~~/shared/types'

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'admin',
    companyId: 'company-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'vendedor',
    companyId: 'company-1',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-01')
  }
]

const mockCompanies: Company[] = [
  {
    id: 'company-1',
    name: 'Empresa Demo LTDA',
    cnpj: '12.345.678/0001-90',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01')
  }
]

export const useAuth = () => {
  const currentUser = useState<User | null>('auth.user', () => mockUsers[0] || null)
  const currentCompany = useState<Company | null>('auth.company', () => mockCompanies[0] || null)
  const isAuthenticated = computed(() => !!currentUser.value)

  const login = async (email: string, password: string) => {
    // Simular login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockUsers.find(u => u.email === email)
    if (user) {
      currentUser.value = user
      currentCompany.value = mockCompanies.find(c => c.id === user.companyId) || null
      return { success: true }
    }
    
    return { success: false, error: 'Credenciais inválidas' }
  }

  const logout = () => {
    currentUser.value = null
    currentCompany.value = null
    navigateTo('/login')
  }

  const updateProfile = (userData: Partial<User>) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...userData, updatedAt: new Date() }
    }
  }

  const updateCompany = (companyData: Partial<Company>) => {
    if (currentCompany.value) {
      currentCompany.value = { ...currentCompany.value, ...companyData, updatedAt: new Date() }
    }
  }

  return {
    currentUser: readonly(currentUser),
    currentCompany: readonly(currentCompany),
    isAuthenticated,
    login,
    logout,
    updateProfile,
    updateCompany
  }
}