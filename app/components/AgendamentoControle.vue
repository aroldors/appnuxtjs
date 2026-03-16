<template>
  <div id="agendamento-controle" class="inline-flex flex-col items-center gap-2">
    <!-- Período da semana -->
    <p class="text-sm font-bold text-gray-800 tracking-wide">
      {{ periodoSemana }}
    </p>

    <!-- Navegação -->
    <div class="flex items-center gap-2">
      <button
        class="p-1.5 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors text-gray-500"
        title="Semana anterior"
        @click="store.voltarSemana()"
      >
        <ChevronLeftIcon class="h-4 w-4" />
      </button>

      <button
        class="p-1.5 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors text-gray-500"
        title="Próxima semana"
        @click="store.avancarSemana()"
      >
        <ChevronRightIcon class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useAgendamentosStore } from '~/stores/agendamentos'

const store = useAgendamentosStore()

const periodoSemana = computed<string>(() => {
  const dias = store.diasSemana
  if (dias.length === 0) return ''
  const inicio = dias[0]
  const fim = dias[6]
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return `${fmt(inicio)} – ${fmt(fim)}`
})
</script>
