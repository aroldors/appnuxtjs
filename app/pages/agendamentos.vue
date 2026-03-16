<template>
  <div class="h-full">
    <AgendamentoManager />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AgendamentoManager from '~/components/AgendamentoManager.vue'
import { useAgendamentosStore } from '~/stores/agendamentos'

const store = useAgendamentosStore()

onMounted(() => {
  store.dataReferencia = new Date()
})
</script>
