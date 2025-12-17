import type { Database } from '../types/database'

export type UserProfile = Database['public']['Tables']['users']['Row']

export const useUserStore = defineStore('user', () => {
  // Estado
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => {
    const user = useSupabaseUser()
    return !!user.value
  })
  const userName = computed(() => profile.value?.nome || 'Usuário')
  const userRole = computed(() => profile.value?.role || 'user')
  const isActive = computed(() => profile.value?.ativo || false)

  // Actions
  const fetchProfile = async () => {
    const supabase = useSupabaseClient()
    const supabaseUser = useSupabaseUser()
    
    // Validação do usuário e ID
    const userId = supabaseUser.value?.id || supabaseUser.value?.uid || supabaseUser.value?.sub
    if (!userId) {
      error.value = `Usuário não autenticado ou ID não disponível`
      profile.value = null
      return
    }

    // Evitar múltiplas chamadas simultâneas
    if (loading.value) return

    try {
      loading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          error.value = 'Perfil não encontrado para este usuário'
        } else {
          error.value = `Erro na consulta: ${fetchError.message}`
        }
        return
      }

      profile.value = data as UserProfile
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      error.value = 'Erro inesperado ao buscar perfil'
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const supabase = useSupabaseClient()
    
    if (!profile.value) return

    try {
      loading.value = true
      error.value = null

      // Temporariamente usando any para contornar problema de tipagem do Supabase
      const supabaseAny = supabase as any
      const { data, error: updateError } = await supabaseAny
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.value.id)
        .select()
        .single()

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError)
        error.value = updateError.message
        return
      }

      profile.value = data as UserProfile
    } catch (err) {
      console.error('Erro inesperado:', err)
      error.value = 'Erro inesperado ao atualizar perfil'
    } finally {
      loading.value = false
    }
  }

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const supabase = useSupabaseClient()
    const supabaseUser = useSupabaseUser()
    
    if (!supabaseUser.value) return

    try {
      loading.value = true
      error.value = null

      // Temporariamente usando any para contornar problema de tipagem do Supabase
      const supabaseAny = supabase as any
      const { data, error: createError } = await supabaseAny
        .from('users')
        .insert({
          ...profileData,
          user_id: supabaseUser.value.id || supabaseUser.value.sub,
        })
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar perfil:', createError)
        error.value = createError.message
        return
      }

      profile.value = data as UserProfile
      console.log('✅ Perfil criado com sucesso:', data)
    } catch (err) {
      console.error('Erro inesperado:', err)
      error.value = 'Erro inesperado ao criar perfil'
    } finally {
      loading.value = false
    }
  }

  const clearProfile = () => {
    profile.value = null
    error.value = null
  }

  // Inicializar perfil quando usuário autenticar
  const initializeProfile = () => {
    const supabaseUser = useSupabaseUser()
    let lastUserId: string | null = null
    
    // Watcher otimizado para evitar múltiplas chamadas
    watch(supabaseUser, async (newUser, oldUser) => {
      const currentUserId = newUser?.id || newUser?.sub
      
      // Evitar processamento desnecessário
      if (currentUserId === lastUserId) return
      
      lastUserId = currentUserId
      
      if (currentUserId) {
        await fetchProfile()
      } else {
        clearProfile()
      }
    }, { immediate: true })
  }

  // Chama a inicialização
  initializeProfile()

  return {
    // Estado
    profile,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userName,
    userRole,
    isActive,
    
    // Actions
    fetchProfile,
    updateProfile,
    createProfile,
    clearProfile
  }
})