<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" id="login-page">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">P</span>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Prospector
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Acesse sua conta para gerenciar seus leads
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              <span v-if="loading">Entrando...</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const { login } = useAuth()

const form = reactive({
  email: 'joao@empresa.com',
  password: 'admin123'
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const result = await login(form.email, form.password)
    
    if (result.success) {
      navigateTo('/dashboard')
    } else {
      error.value = result.error || 'Erro ao fazer login'
    }
  } catch (err) {
    error.value = 'Erro inesperado. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>