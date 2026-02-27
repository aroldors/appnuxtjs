<template>
  <Teleport to="body">
    <Transition name="slide-panel">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-start justify-end"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
          @click="emit('close')"
        />

        <!-- Panel -->
        <div class="relative z-10 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white leading-tight">{{ conta?.nome_fantasia || conta?.razao_social || '—' }}</h2>
                <p class="text-xs text-blue-100 mt-0.5">{{ conta?.cpf_cnpj || '—' }}</p>
              </div>
            </div>
            <button
              type="button"
              class="text-white/70 hover:text-white transition-colors"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            <!-- Dados da Empresa -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dados da Empresa</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Razão Social</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.razao_social || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Nome Fantasia</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.nome_fantasia || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">CPF / CNPJ</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.cpf_cnpj || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Contato</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.contato || '—' }}</p>
                </div>
              </div>
            </section>

            <!-- Endereço -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Endereço</span>
              </div>
              <div class="p-4 grid grid-cols-6 gap-x-4 gap-y-4 bg-gray-50">
                <div class="col-span-4">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Endereço</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.endereco || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Número</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.numero != null ? conta.numero : '—' }}</p>
                </div>
                <div class="col-span-3">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Bairro</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.bairro || '—' }}</p>
                </div>
                <div class="col-span-3">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">CEP</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.cep || '—' }}</p>
                </div>
                <div class="col-span-4">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Cidade</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.cidade || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Estado</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.estado || '—' }}</p>
                </div>
              </div>
            </section>

            <!-- Contato -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contato</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Telefone Comercial</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.fone_comercial || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Telefone Celular</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.fone_celular || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">E-mail</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.email || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Website</p>
                  <p class="text-sm text-gray-800 font-medium">{{ conta?.website || '—' }}</p>
                </div>
              </div>
            </section>

          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
            <button
              type="button"
              class="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
              @click="emit('close')"
            >
              OK
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Database } from '../types/database'

type ContaRow = Database['public']['Tables']['contas']['Row']

interface Props {
  open: boolean
  conta?: ContaRow | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: opacity 0.3s ease;
}

.slide-panel-enter-active .relative,
.slide-panel-leave-active .relative {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-panel-enter-from {
  opacity: 0;
}

.slide-panel-enter-from .relative,
.slide-panel-leave-to .relative {
  transform: translateX(100%);
}

.slide-panel-leave-to {
  opacity: 0;
}
</style>
