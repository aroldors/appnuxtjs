<template>
  <div
    id="agendamento-item-agendado"
    class="relative flex-1 overflow-hidden bg-indigo-50/50"
    :style="{ height: `${alturaTotal}px` }"
  >
    <!-- Grade de horas (08h–19h) -->
    <div
      v-for="hora in 12"
      :key="hora"
      class="border-b border-gray-100"
      :style="{ height: `${slotHeight}px` }"
    />
    <!-- Overlay dos agendamentos: absolute inset-0 garante que os slots
         sejam posicionados dentro da grade, sem interferência do fluxo normal -->
    <div class="absolute inset-0">
      <AgendamentoSlots
        v-for="agendamento in agendamentosDoDia"
        :key="agendamento.id"
        :agendamento="agendamento"
        :slot-height="slotHeight"
        @reagendar="(a) => emit('reagendar', a)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AgendamentoSlots from '~/components/AgendamentoSlots.vue'
import type { Database } from '~/types/database'

type AgendamentoRow = Database['public']['Tables']['agendamentos']['Row']

interface Emits {
  (e: 'reagendar', agendamento: AgendamentoRow): void
}

const emit = defineEmits<Emits>()

interface Props {
  dia: Date
  agendamentos?: AgendamentoRow[]
  slotHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  agendamentos: () => [],
  slotHeight: 160
})

const alturaTotal = computed(() => props.slotHeight * 12) // 08h a 19h = 12 slots

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const agendamentosDoDia = computed(() => {
  const dataStr = toLocalDateStr(props.dia)
  return props.agendamentos.filter(a => a.data === dataStr)
})
</script>
