<template>
  <div id="agendamento-manager" class="flex flex-col h-full">
    <!-- Header linha 1: controles -->
    <div class="shrink-0 grid grid-cols-3 items-center px-4 py-3">
      <AgendamentoControle class="col-start-1 justify-self-start" />
      <AgendamentoProfissional class="col-start-2 justify-self-center" />
      <div class="col-start-3 justify-self-end">
        <BaseButton variant="primary" size="sm" @click="onNovo">
          <template #icon>
            <PlusIcon class="h-4 w-4 mr-1" />
          </template>
          Novo
        </BaseButton>
      </div>
    </div>

    <!-- Header linha 2: dias da semana (sem px-4 para alinhar com as colunas do body) -->
    <AgendamentoDiasSemana :dias="store.diasSemana" class="shrink-0" />

    <!-- Body -->
    <div class="flex-1 flex overflow-y-auto">
      <AgendamentoReguaHorarios :slot-height="slotHeight" />
      <div class="flex flex-1 border-l border-gray-200">
        <AgendamentoItemAgendado
          v-for="(dia, index) in store.diasSemana"
          :key="index"
          :dia="dia"
          :agendamentos="agendamentos"
          :slot-height="slotHeight"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database'
import AgendamentoControle from '~/components/AgendamentoControle.vue'
import AgendamentoProfissional from '~/components/AgendamentoProfissional.vue'
import AgendamentoDiasSemana from '~/components/AgendamentoDiasSemana.vue'
import AgendamentoReguaHorarios from '~/components/AgendamentoReguaHorarios.vue'
import AgendamentoItemAgendado from '~/components/AgendamentoItemAgendado.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useAgendamentosStore } from '~/stores/agendamentos'

const store = useAgendamentosStore()
const slotHeight = 160
const agendamentos = ref<Database['public']['Tables']['agendamentos']['Row'][]>([])

onMounted(() => {
  store.$reset()
})

function onNovo(): void {
  // TODO: abrir modal de criação
}
</script>
