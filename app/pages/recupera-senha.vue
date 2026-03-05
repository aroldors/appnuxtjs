<template>
  <div class="min-h-screen bg-gray-50" id="recupera-senha-page">
    <div class="flex min-h-screen">
      <!-- Left Column - Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div class="mx-auto w-full max-w-lg lg:w-[480px]">
          <!-- Logo and Header -->
          <div class="text-center mb-8">
            <div class="flex justify-center">
              <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">P</span>
              </div>
            </div>
            <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
              Redefinir senha
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Escolha uma nova senha para sua conta.
            </p>
          </div>

          <!-- Reset Password Component -->
          <ResetPassword />

          <div class="mt-6 text-center">
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

      <!-- Right Column - Info -->
      <div class="hidden lg:block relative w-0 flex-1">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <div class="max-w-md mx-auto text-center text-white px-8">
            <div class="mb-8">
              <svg class="mx-auto h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h3 class="text-2xl font-bold mb-6">
              Quase lá!
            </h3>

            <div class="space-y-4 text-blue-100">
              <p class="text-lg leading-relaxed">
                Defina uma senha forte para manter sua conta segura.
              </p>

              <div class="border-l-4 border-blue-300 pl-4 text-left">
                <p class="font-medium">✓ Mínimo de 6 caracteres</p>
                <p class="font-medium">✓ Evite senhas óbvias</p>
                <p class="font-medium">✓ Não reutilize senhas antigas</p>
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
import { NuxtLink } from '#components'
import ResetPassword from '~/components/ResetPassword.vue'

definePageMeta({
  layout: false
})
</script>
