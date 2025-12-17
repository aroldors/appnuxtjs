
export const useAuth = () => {
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  
  const loading = useState<boolean>('auth.loading', () => false)
  
  const isAuthenticated = computed(() => !!supabaseUser.value)

  const login = async (email: string, password: string) => {
    loading.value = true
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Erro no login:', error)
        return { success: false, error: error.message || 'Credenciais inválidas' }
      }

      if (data.user) {
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
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error)
      }
    } catch (err) {
      console.error('Erro no logout:', err)
    } finally {
      loading.value = false
      await navigateTo('/login')
    }
  }

  return {
    user: supabaseUser,
    isAuthenticated,
    loading: readonly(loading),
    login,
    logout
  }
}