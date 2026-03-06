
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

  const updateProfile = async (params: {
    nome?: string
    cpf?: string
    identificacao?: string
    endereco?: string
    numero?: string
    bairro?: string
    cidade?: string
    uf?: string
    telefone?: string
  }) => {
    loading.value = true

    try {
      const { data, error } = await (supabase as any).rpc('update_user_profile', {
        p_nome: params.nome ?? null,
        p_identificacao: params.identificacao ?? null,
        p_cpf: params.cpf ?? null,
        p_endereco: params.endereco ?? null,
        p_numero: params.numero ?? null,
        p_bairro: params.bairro ?? null,
        p_cidade: params.cidade ?? null,
        p_uf: params.uf ?? null,
        p_telefone: params.telefone ?? null,
      })

      if (error) {
        return { success: false, message: error.message }
      }

      return data as { success: boolean; message: string }
    } catch (err) {
      return { success: false, message: 'Erro inesperado ao atualizar o perfil.' }
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email: string) => {
    loading.value = true

    try {
      const redirectTo = `${window.location.origin}/recupera-senha`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: 'Erro inesperado ao solicitar recuperação de senha.' }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (newPassword: string) => {
    loading.value = true

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) {
        const mensagens: Record<string, string> = {
          'New password should be different from the old password': 'A nova senha deve ser diferente da senha atual.',
          'Password should be at least 6 characters.': 'A senha deve ter no mínimo 6 caracteres.',
        }
        return { success: false, error: mensagens[error.message] ?? error.message }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: 'Erro inesperado ao alterar a senha' }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string) => {
    loading.value = true

    try {
      const emailRedirectTo = `${window.location.origin}/confirm`
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo }
      })

      if (error) {
        const mensagens: Record<string, string> = {
          'User already registered': 'Este e-mail já está cadastrado.',
          'Password should be at least 6 characters.': 'A senha deve ter no mínimo 6 caracteres.',
        }
        return { success: false, error: mensagens[error.message] ?? error.message }
      }

      if (data.user) {
        return { success: true }
      }

      return { success: false, error: 'Erro ao criar a conta.' }
    } catch (err) {
      return { success: false, error: 'Erro inesperado ao criar a conta.' }
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
    register,
    logout,
    changePassword,
    requestPasswordReset,
    updateProfile
  }
}