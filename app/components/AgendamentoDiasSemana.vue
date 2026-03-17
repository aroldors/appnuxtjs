<template>
  <div id="agendamento-dias-semana" class="flex w-full">
    <!-- Espaçador alinhado com a régua de horários (w-16 + mr-2) -->
    <div class="w-16 mr-2 shrink-0" />
    <div class="grid grid-cols-7 flex-1 gap-x-1">
      <AgendamentoDiaItem
        v-for="(dia, index) in dias"
        :key="index"
        :dia="dia"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AgendamentoDiaItem from '~/components/AgendamentoDiaItem.vue'

interface Props {
  dias: Date[]
}

defineProps<Props>()
</script>
