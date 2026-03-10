<template>
  <div class="min-h-screen bg-gray-50" id="completar-cadastro-page">
    <div class="flex min-h-screen">
      <!-- Left Column - Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <!-- Logo and Header -->
          <div class="text-center">
            <div class="flex justify-center">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">P</span>
              </div>
            </div>
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Complete seu cadastro
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Confirme seu nome e defina uma senha para acessar o Prospector
            </p>
          </div>

          <!-- Loading state while session is being established -->
          <div v-if="!supabaseUser" class="mt-8 text-center">
            <p class="text-sm text-gray-500">Aguardando autenticação...</p>
          </div>

          <!-- Form -->
          <div v-else class="mt-8">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form class="space-y-6" @submit.prevent="handleSubmit">
                <BaseInput
                  v-model="form.nome"
                  label="Nome Completo"
                  type="text"
                  autocomplete="name"
                  placeholder="Seu nome completo"
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
                  autocomplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  required
                >
                  <template #leftIcon>
                    <LockClosedIcon class="h-5 w-5 text-gray-400" />
                  </template>
                </BaseInput>

                <BaseInput
                  v-model="form.confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Repita a senha"
                  required
                >
                  <template #leftIcon>
                    <LockClosedIcon class="h-5 w-5 text-gray-400" />
                  </template>
                </BaseInput>

                <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

                <div>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ loading ? 'Salvando...' : 'Concluir cadastro' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Info -->
      <div class="hidden lg:block relative w-0 flex-1">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <div class="max-w-md mx-auto text-center text-white px-8">
            <div class="mb-8">
              <svg class="mx-auto h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-6">
              Quase lá!
            </h3>
            <div class="space-y-4 text-blue-100">
              <p class="text-lg leading-relaxed">
                Você foi convidado para acessar o Prospector. Complete seu cadastro para começar.
              </p>
              <div class="border-l-4 border-blue-300 pl-4 text-left">
                <p class="font-medium">✓ Confirme seu nome</p>
                <p class="font-medium">✓ Defina sua senha de acesso</p>
                <p class="font-medium">✓ Acesse o sistema imediatamente</p>
              </div>
            </div>
            <div class="mt-8 text-sm text-blue-200">
              <p>Prospector - Sua ferramenta completa de CRM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, LockClosedIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth'
import BaseInput from '~/components/BaseInput.vue'

definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const supabaseUser = useSupabaseUser()
const route = useRoute()
const { updateProfile, changePassword, loading } = useAuth()

const form = reactive({
  nome: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')

onMounted(async () => {
  // Implicit flow: token no hash (#access_token=...)
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    if (accessToken && refreshToken) {
      await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      window.history.replaceState(null, '', window.location.pathname)
    }
    return
  }

  // PKCE flow: token na query (?code=...)
  const code = route.query.code as string | undefined
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }
})

watch(supabaseUser, (user) => {
  if (user) {
    form.nome = (user.user_metadata?.nome as string) || ''
  }
}, { immediate: true })

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.nome.trim()) {
    errorMessage.value = 'Nome é obrigatório.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'As senhas não coincidem.'
    return
  }

  if (form.password.length < 6) {
    errorMessage.value = 'A senha deve ter no mínimo 6 caracteres.'
    return
  }

  const profileResult = await updateProfile({ nome: form.nome.trim() })

  if (!profileResult.success) {
    errorMessage.value = profileResult.message || 'Erro ao salvar os dados.'
    return
  }

  const passwordResult = await changePassword(form.password)

  if (!passwordResult.success) {
    errorMessage.value = passwordResult.error || 'Erro ao definir a senha.'
    return
  }

  await navigateTo('/dashboard')
}
</script>
