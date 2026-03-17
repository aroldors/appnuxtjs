<template>
  <div
    id="agendamento-item-agendado"
    class="relative flex-1 border-r border-gray-200 last:border-r-0"
    :style="{ height: `${alturaTotal}px` }"
  >
    <!-- Grade de horas (06h–22h) -->
    <div
      v-for="hora in 17"
      :key="hora"
      class="border-b border-gray-100"
      :style="{ height: `${slotHeight}px` }"
    />
    <!-- Agendamentos do dia -->
    <AgendamentoSlots
      v-for="agendamento in agendamentosDoDia"
      :key="agendamento.id"
      :agendamento="agendamento"
      :slot-height="slotHeight"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AgendamentoSlots from '~/components/AgendamentoSlots.vue'
import type { Database } from '~/types/database'

type AgendamentoRow = Database['public']['Tables']['agendamentos']['Row']

interface Props {
  dia: Date
  agendamentos?: AgendamentoRow[]
  slotHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  agendamentos: () => [],
  slotHeight: 160
})

const alturaTotal = computed(() => props.slotHeight * 17) // 06h a 22h = 17 slots

const agendamentosDoDia = computed(() => {
  const dataStr = props.dia.toISOString().slice(0, 10)
  return props.agendamentos.filter(a => a.data === dataStr)
})
</script>
