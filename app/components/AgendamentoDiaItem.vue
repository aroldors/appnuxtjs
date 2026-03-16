<template>
  <div id="agendamento-dia-item" class="flex flex-col items-center justify-center gap-0.5 py-2 border-r border-gray-200 last:border-r-0">
    <span class="text-sm font-bold text-gray-800 leading-none">{{ numeroDia }}</span>
    <span class="text-xs text-gray-500 capitalize">{{ nomeDia }}</span>
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
