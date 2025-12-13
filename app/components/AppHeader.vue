<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between px-6 py-4">
      <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
      
      <!-- User Menu -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-gray-700">{{ userInitials }}</span>
          </div>
          <div class="text-sm">
            <div class="font-medium text-gray-900">{{ currentUser?.name }}</div>
            <div class="text-gray-500">{{ currentUser?.role }}</div>
          </div>
        </div>
        
        <button
          @click="logout"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          title="Sair"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { User } from '~~/shared/types'

const route = useRoute()
const { currentUser, logout } = useAuth()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/funil': 'Funil de Vendas',
    '/contatos': 'Contatos',
    '/mensagens': 'Modelos de Mensagens',
    '/configuracoes': 'Configurações',
    '/teste': 'Teste de Componentes'
  }
  return titles[route.path] || 'Prospector'
})

const userInitials = computed(() => {
  if (!currentUser.value?.name) return 'U'
  return currentUser.value.name
    .split(' ')
    .map((name: string) => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})
</script>