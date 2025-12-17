<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Teste do Store Pinia</h2>
    
    <div class="space-y-2">
      <p><strong>Autenticado:</strong> {{ isAuthenticated ? 'Sim' : 'Não' }}</p>
      <p><strong>Nome do usuário:</strong> {{ userName }}</p>
      <p><strong>Role:</strong> {{ userRole }}</p>
      <p><strong>Ativo:</strong> {{ isActive ? 'Sim' : 'Não' }}</p>
      <p><strong>É Admin:</strong> {{ isAdmin ? 'Sim' : 'Não' }}</p>
      <p><strong>Iniciais:</strong> {{ userInitials }}</p>
      <p><strong>Loading:</strong> {{ loading ? 'Sim' : 'Não' }}</p>
      <p v-if="error" class="text-red-500"><strong>Erro:</strong> {{ error }}</p>
    </div>
    
    <div class="mt-4 space-x-2">
      <button 
        @click="fetchProfile" 
        class="px-4 py-2 bg-blue-500 text-white rounded"
        :disabled="loading"
      >
        Buscar Perfil
      </button>
      
      <button 
        @click="clearProfile" 
        class="px-4 py-2 bg-gray-500 text-white rounded"
      >
        Limpar Perfil
      </button>
    </div>
    
    <div v-if="profile" class="mt-4 p-4 bg-gray-100 rounded">
      <h3 class="font-bold">Dados do Perfil:</h3>
      <pre class="text-sm">{{ JSON.stringify(profile, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const { profile, loading, error } = storeToRefs(userStore)

// Getters como computed
const isAuthenticated = computed(() => userStore.isAuthenticated)
const userName = computed(() => userStore.userName)
const userRole = computed(() => userStore.userRole)
const isActive = computed(() => userStore.isActive)

// Computed adicional para admin
const isAdmin = computed(() => userRole.value === 'admin')

// Computed para iniciais
const userInitials = computed(() => {
  const name = userName.value
  if (!name || name === 'Usuário') return 'U'
  
  const names = name.trim().split(' ').filter(n => n.length > 0)
  if (names.length === 0) return 'U'
  if (names.length === 1) {
    return names[0]!.charAt(0).toUpperCase()
  }
  
  return `${names[0]!.charAt(0)}${names[names.length - 1]!.charAt(0)}`.toUpperCase()
})

// Actions diretas do store
const fetchProfile = () => userStore.fetchProfile()
const clearProfile = () => userStore.clearProfile()</script>