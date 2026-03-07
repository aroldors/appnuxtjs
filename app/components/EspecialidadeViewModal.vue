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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white leading-tight">{{ especialidade?.descricao || '—' }}</h2>
                <p class="text-xs text-blue-100 mt-0.5">ID #{{ especialidade?.id }}</p>
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

            <!-- Dados da Especialidade -->
            <section class="rounded-xl border border-gray-100 overflow-hidden">
              <div class="px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dados da Especialidade</span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50">
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">ID</p>
                  <p class="text-sm text-gray-800 font-medium">{{ especialidade?.id ?? '—' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Descrição</p>
                  <p class="text-sm text-gray-800 font-medium">{{ especialidade?.descricao || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Criado em</p>
                  <p class="text-sm text-gray-800 font-medium">{{ formatDate(especialidade?.created_at) }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-400 mb-0.5">Atualizado em</p>
                  <p class="text-sm text-gray-800 font-medium">{{ formatDate(especialidade?.upated_at) }}</p>
                </div>
              </div>
            </section>

          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 bg-white flex justify-center">
            <button
              type="button"
              class="px-32 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
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

type EspecialidadeRow = Database['public']['Tables']['especialidades']['Row']

interface Props {
  open: boolean
  especialidade?: EspecialidadeRow | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function formatDate(value?: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
