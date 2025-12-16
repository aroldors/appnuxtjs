import type { User, Company } from '~~/shared/types'

// Mock data para fallback
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
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  
  const currentUser = useState<User | null>('auth.user', () => null)
  const currentCompany = useState<Company | null>('auth.company', () => null)
  const loading = useState<boolean>('auth.loading', () => false)
  
  const isAuthenticated = computed(() => !!supabaseUser.value || !!currentUser.value)

  // Inicializar usuário do Supabase se existir
  const initializeAuth = async () => {
    if (supabaseUser.value && !currentUser.value) {
      // Buscar dados do usuário da aplicação baseado no Supabase user
      const user = mockUsers.find(u => u.email === supabaseUser.value?.email)
      if (user) {
        currentUser.value = user
        currentCompany.value = mockCompanies.find(c => c.id === user.companyId) || null
      }
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    
    try {
      // Primeiro tentar autenticação com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Se falhar com Supabase, usar mock para demo
        const user = mockUsers.find(u => u.email === email)
        if (user && (password === 'admin123' || password === 'vendedor123')) {
          currentUser.value = user
          currentCompany.value = mockCompanies.find(c => c.id === user.companyId) || null
          return { success: true }
        }
        return { success: false, error: 'Credenciais inválidas' }
      }

      if (data.user) {
        // Buscar dados do usuário da aplicação
        const user = mockUsers.find(u => u.email === data.user.email)
        if (user) {
          currentUser.value = user
          currentCompany.value = mockCompanies.find(c => c.id === user.companyId) || null
        }
        return { success: true }
      }

      return { success: false, error: 'Erro ao fazer login' }
    } catch (err) {
      console.error('Erro no login:', err)
      return { success: false, error: 'Erro inesperado' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      // Tentar logout do Supabase
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Erro no logout:', err)
    } finally {
      // Limpar estado local
      currentUser.value = null
      currentCompany.value = null
      loading.value = false
      await navigateTo('/login')
    }
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

  // Watch para mudanças no usuário do Supabase
  watch(supabaseUser, (newUser) => {
    if (newUser) {
      initializeAuth()
    } else {
      currentUser.value = null
      currentCompany.value = null
    }
  }, { immediate: true })

  return {
    currentUser: readonly(currentUser),
    currentCompany: readonly(currentCompany),
    isAuthenticated,
    loading: readonly(loading),
    login,
    logout,
    updateProfile,
    updateCompany,
    initializeAuth
  }
}