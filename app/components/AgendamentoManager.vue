<template>
  <div id="agendamento-manager" class="flex flex-col h-full">
    <!-- Header -->
    <div class="border-2 border-dashed border-blue-500 h-[100px] shrink-0 grid grid-cols-3 items-center px-4">
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

    <!-- Body -->
    <div class="border-2 border-dashed border-green-500 flex-1 flex items-center px-4">
      <span class="text-green-500 text-sm font-medium">Body — ocupa o restante do espaço</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import AgendamentoControle from '~/components/AgendamentoControle.vue'
import AgendamentoProfissional from '~/components/AgendamentoProfissional.vue'
import BaseButton from '~/components/BaseButton.vue'

function onNovo(): void {
  // TODO: abrir modal de criação
}
</script>
