<template>
  <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
    <form @submit.prevent="handleLogin" class="space-y-6">
      <BaseInput
        v-model="form.email"
        label="E-mail"
        type="email"
        autocomplete="email"
        required
      >
        <template #leftIcon>
          <UserIcon class="h-5 w-5 text-gray-400" />
        </template>
      </BaseInput>

      <BaseInput
        v-model="form.password"
        label="Senha"
        type="password"
        autocomplete="current-password"
        required
      >
        <template #leftIcon>
          <LockClosedIcon class="h-5 w-5 text-gray-400" />
        </template>
      </BaseInput>

      <div>
        <button
          type="submit"
          :disabled="authLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          <span v-if="authLoading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </div>
    </form>

    <!-- Demo credentials -->
    <div class="mt-6">
      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-900 mb-2">Credenciais para Demo:</h3>
        <div class="text-xs text-blue-700 space-y-1">
          <div>Admin: joao@empresa.com / admin123</div>
          <div>Vendedor: maria@empresa.com / vendedor123</div>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4">
      <div class="bg-red-50 border border-red-200 rounded-md p-3">
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

const { login, loading: authLoading } = useAuth()

const form = reactive({
  email: 'joao@empresa.com',
  password: 'admin123'
})

const error = ref('')

const handleLogin = async () => {
  error.value = ''

  try {
    const result = await login(form.email, form.password)
    
    if (result.success) {
      await navigateTo('/dashboard')
    } else {
      error.value = result.error || 'Erro ao fazer login'
    }
  } catch (err) {
    error.value = 'Erro inesperado. Tente novamente.'
  }
}
</script>