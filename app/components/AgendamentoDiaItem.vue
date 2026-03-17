<template>
  <div
    id="agendamento-dia-item"
    class="flex flex-col items-center justify-center gap-0.5 py-2 rounded-t-lg bg-indigo-50/50 cursor-pointer transition-colors duration-150 hover:bg-indigo-50"
  >
    <span class="text-sm font-bold text-indigo-800 leading-none">{{ numeroDia }}</span>
    <span class="text-xs text-indigo-400 capitalize">{{ nomeDia }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dia: Date
}

const props = defineProps<Props>()

const numeroDia = computed(() => props.dia.getDate())

const nomeDia = computed(() =>
  props.dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
)
</script>
