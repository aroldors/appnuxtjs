<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="user-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Adicionar Usuário
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Função *
            </label>
            <select
              v-model="form.role"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Senha Temporária *
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
            <p class="text-xs text-gray-500 mt-1">
              O usuário deverá alterar a senha no primeiro acesso
            </p>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('cancel')"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Adicionar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '~~/shared/types'

interface Emits {
  (e: 'save', data: { name: string; email: string; role: User['role']; password: string }): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const form = reactive({
  name: '',
  email: '',
  role: 'vendedor' as User['role'],
  password: ''
})

function handleSubmit() {
  emit('save', { ...form })
}
</script>