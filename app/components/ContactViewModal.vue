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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white leading-tight">{{ contato?.nome || '—' }}</h2>
                <p class="text-xs text-blue-100 mt-0.5">{{ contato?.cargo || '—' }}</p>
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

            <!-- Dados do Contato -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dados do Contato</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Nome</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.nome || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Cargo</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.cargo || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Status</p>
                  <span
                    class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full"
                    :class="statusBadgeColor(contato?.status)"
                  >
                    {{ statusLabel(contato?.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">E-mail</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.email || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Telefone</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.telefone || '—' }}</p>
                </div>
                <div class="col-span-2" v-if="contato?.tags?.length">
                  <p class="text-xs font-medium text-gray-400 mb-1">Tags</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in contato.tags"
                      :key="tag"
                      class="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Empresa -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Nome Fantasia</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.nome_fantasia || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Razão Social</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.razao_social || '—' }}</p>
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
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.endereco || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Número</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.numero != null ? contato.numero : '—' }}</p>
                </div>
                <div class="col-span-3">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Bairro</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.bairro || '—' }}</p>
                </div>
                <div class="col-span-3">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">CEP</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.cep || '—' }}</p>
                </div>
                <div class="col-span-4">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Cidade</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.cidade || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Estado</p>
                  <p class="text-sm text-gray-800 font-medium">{{ contato?.estado || '—' }}</p>
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

type VwContatosContasRow = Database['public']['Views']['vw_contatos_contas']['Row']

interface Props {
  open: boolean
  contato?: VwContatosContasRow | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function statusLabel(status?: string | null): string {
  const map: Record<string, string> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    bloqueado: 'Bloqueado'
  }
  return status ? (map[status] ?? status) : '—'
}

function statusBadgeColor(status?: string | null): string {
  const map: Record<string, string> = {
    ativo: 'bg-green-100 text-green-800',
    inativo: 'bg-yellow-100 text-yellow-800',
    bloqueado: 'bg-red-100 text-red-800'
  }
  return status ? (map[status] ?? 'bg-gray-100 text-gray-800') : 'bg-gray-100 text-gray-800'
}
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
