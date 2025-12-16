<template>
  <div class="min-h-screen bg-gray-50" id="login-page">
    <div class="flex min-h-screen">
      <!-- Left Column - Login Form -->
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
              Prospector
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Acesse sua conta para gerenciar seus leads
            </p>
          </div>

          <!-- Login Form Component -->
          <div class="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      <!-- Right Column - Application Info -->
      <div class="hidden lg:block relative w-0 flex-1">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <div class="max-w-md mx-auto text-center text-white px-8">
            <div class="mb-8">
              <svg class="mx-auto h-16 w-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            
            <h3 class="text-2xl font-bold mb-6">
              Transforme Leads em Clientes
            </h3>
            
            <div class="space-y-4 text-blue-100">
              <p class="text-lg leading-relaxed">
                Gerencie seu funil de vendas com eficiência e acompanhe cada etapa da jornada do cliente.
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
definePageMeta({
  layout: false
})
</script>