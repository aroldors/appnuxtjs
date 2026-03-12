<template>
  <div class="min-h-screen bg-gray-50" id="esqueci-senha-page">
    <div class="flex min-h-screen">
      <!-- Left Column - Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <!-- Logo and Header -->
          <div class="text-center">
            <div class="flex justify-center">
              <img src="/Prospector_Logo.png" alt="Prospector" class="w-auto object-contain" style="height: 85px" />
            </div>
            <p class="mt-4 text-sm text-gray-600">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <!-- Form -->
          <div class="mt-8 space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div class="mt-1 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <p v-if="emailError" class="mt-1 text-xs text-red-600">{{ emailError }}</p>
            </div>

            <div>
              <button
                type="button"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                @click="handleRequestReset"
              >
                {{ loading ? 'Enviando...' : 'Enviar link de redefinição' }}
              </button>
            </div>

            <div class="text-center">
              <NuxtLink
                to="/login"
                class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para o login
              </NuxtLink>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>

            <h3 class="text-2xl font-bold mb-6">
              Recupere seu acesso
            </h3>

            <div class="space-y-4 text-blue-100">
              <p class="text-lg leading-relaxed">
                Não se preocupe, acontece com todos. Basta informar seu e-mail e enviaremos as instruções em instantes.
              </p>

              <div class="border-l-4 border-blue-300 pl-4 text-left">
                <p class="font-medium">✓ Link enviado para seu e-mail</p>
                <p class="font-medium">✓ Processo seguro e rápido</p>
                <p class="font-medium">✓ Link válido por 24 horas</p>
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

  <ConfirmModal
    :open="showModal"
    title="E-mail enviado"
    message="Caso o e-mail informado esteja cadastrado no sistema, você receberá um link para redefinir sua senha em breve. Verifique também sua caixa de spam."
    confirm-text="Ok, entendi"
    cancel-text=""
    @confirm="handleModalConfirm"
    @cancel="handleModalConfirm"
  />
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: false
})

const { requestPasswordReset, loading } = useAuth()

const email = ref('')
const emailError = ref('')
const showModal = ref(false)

function validate(): boolean {
  emailError.value = ''
  if (!email.value) {
    emailError.value = 'Informe o e-mail.'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = 'Informe um e-mail válido.'
    return false
  }
  return true
}

async function handleRequestReset() {
  if (!validate()) return
  await requestPasswordReset(email.value)
  showModal.value = true
}

function handleModalConfirm() {
  showModal.value = false
  navigateTo('/login')
}
</script>
