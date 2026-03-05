<template>
  <div class="min-h-screen bg-gray-50" id="cadastro-page">
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
              Crie sua conta
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Preencha os dados abaixo para começar a usar o Prospector
            </p>
          </div>

          <!-- Register Form -->
          <div class="mt-8">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form class="space-y-6">
                <BaseInput
                  label="E-mail"
                  type="email"
                  autocomplete="email"
                  placeholder="seu@email.com"
                  required
                >
                  <template #leftIcon>
                    <EnvelopeIcon class="h-5 w-5 text-gray-400" />
                  </template>
                </BaseInput>

                <BaseInput
                  label="Senha"
                  type="password"
                  autocomplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  required
                >
                  <template #leftIcon>
                    <LockClosedIcon class="h-5 w-5 text-gray-400" />
                  </template>
                </BaseInput>

                <BaseInput
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

                <div>
                  <button
                    type="submit"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Criar conta
                  </button>
                </div>
              </form>

              <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                  Já tem uma conta?
                  <NuxtLink
                    to="/login"
                    class="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Faça login
                  </NuxtLink>
                </p>
              </div>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>

            <h3 class="text-2xl font-bold mb-6">
              Comece agora gratuitamente
            </h3>

            <div class="space-y-4 text-blue-100">
              <p class="text-lg leading-relaxed">
                Crie sua conta e tenha acesso a todas as ferramentas para transformar seus leads em clientes.
              </p>

              <div class="border-l-4 border-blue-300 pl-4 text-left">
                <p class="font-medium">✓ Controle total do pipeline</p>
                <p class="font-medium">✓ Gestão inteligente de contatos</p>
                <p class="font-medium">✓ Modelos de mensagens personalizados</p>
                <p class="font-medium">✓ Relatórios e métricas em tempo real</p>
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
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})
</script>
