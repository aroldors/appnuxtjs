<template>
  <div id="agendamento-item-agendado" class="flex flex-col flex-1 border-r border-gray-200 last:border-r-0">
    <!-- Os slots de agendamento serão inseridos aqui -->
  </div>
</template>

<script setup lang="ts">
interface Props {
  dia: Date
}

defineProps<Props>()
</script>
