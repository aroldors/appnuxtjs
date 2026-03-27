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
                <h2 class="text-base font-semibold text-white leading-tight">{{ lead?.name || '—' }}</h2>
                <p class="text-xs text-blue-100 mt-0.5">{{ lead?.position || '—' }}</p>
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

            <!-- Dados do Lead -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dados do Lead</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Nome</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.name || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Cargo</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.position || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Ramo de Atividade</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.businessSector || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Status</p>
                  <span :class="statusClass" class="inline-flex px-2 py-1 rounded-full text-xs font-semibold">
                    {{ statusLabel }}
                  </span>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Fonte</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.source || '—' }}</p>
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
                  <p class="text-xs font-medium text-gray-400 mb-0.5">E-mail</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.email || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Telefone</p>
                  <p class="text-sm text-gray-800 font-medium">{{ lead?.phone || '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">LinkedIn</p>
                  <a
                    v-if="lead?.linkedin"
                    :href="lead.linkedin"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 hover:underline font-medium"
                  >{{ lead.linkedin }}</a>
                  <p v-else class="text-sm text-gray-800 font-medium">—</p>
                </div>
              </div>
            </section>

            <!-- Oportunidade -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Oportunidade</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Valor da Oportunidade</p>
                  <p class="text-sm text-gray-800 font-medium">{{ formatCurrency(lead?.potentialValue ?? 0) }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Último Contato</p>
                  <p class="text-sm text-gray-800 font-medium">{{ formatDate(lead?.lastContact) }}</p>
                </div>
                <div v-if="lead?.notes" class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Observações</p>
                  <p class="text-sm text-gray-800 font-medium whitespace-pre-line">{{ lead.notes }}</p>
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
import { computed } from '#imports'
import type { Lead } from '~~/shared/types'

interface Props {
  open: boolean
  lead?: Lead | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const statusMap: Record<Lead['status'], { label: string; classes: string }> = {
  'novo':             { label: 'Novo',             classes: 'bg-blue-100 text-blue-700' },
  'em-contato':       { label: 'Em Contato',        classes: 'bg-yellow-100 text-yellow-700' },
  'proposta-enviada': { label: 'Proposta Enviada',   classes: 'bg-purple-100 text-purple-700' },
  'fechado-ganho':    { label: 'Fechado Ganho',      classes: 'bg-green-100 text-green-700' },
  'fechado-perdido':  { label: 'Fechado Perdido',    classes: 'bg-red-100 text-red-700' },
}

const statusLabel = computed(() =>
  props.lead ? (statusMap[props.lead.status]?.label ?? props.lead.status) : '—'
)

const statusClass = computed(() =>
  props.lead ? (statusMap[props.lead.status]?.classes ?? '') : ''
)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(date?: Date): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
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
