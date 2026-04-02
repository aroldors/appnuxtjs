<template>
  <div id="agendamento-manager" class="flex flex-col h-full">
    <!-- Aviso: profissional não vinculado -->
    <div v-if="profissionalNaoEncontrado" class="shrink-0 mx-4 mb-2 px-3 py-2 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs">
      Nenhum profissional vinculado ao usuário logado. Os agendamentos não serão carregados.
    </div>

    <!-- Scroll container único — tudo compartilha a mesma largura -->
    <div class="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
      <div class="px-4">
        <!-- Sticky: controles + dias da semana (grudam juntos ao rolar) -->
        <div class="sticky top-0 z-10 bg-gray-50">
          <div class="grid grid-cols-3 items-center py-3">
            <AgendamentoControle class="col-start-1 justify-self-start" />
            <AgendamentoProfissional class="col-start-2 justify-self-center" @loaded="onProfissionalLoaded" />
            <div class="col-start-3 justify-self-end">
              <BaseButton variant="primary" size="md" @click="onNovo">
                <template #icon>
                  <PlusIcon class="h-4 w-4 mr-1" />
                </template>
                Novo Agendamento
              </BaseButton>
            </div>
          </div>
          <AgendamentoDiasSemana :dias="store.diasSemana" />
        </div>

        <!-- Grade de horários -->
        <div class="flex mt-1">
          <AgendamentoReguaHorarios :slot-height="slotHeight" class="mr-2" />
          <div class="grid grid-cols-7 flex-1 gap-x-1">
            <AgendamentoItemAgendado
              v-for="(dia, index) in store.diasSemana"
              :key="index"
              :dia="dia"
              :agendamentos="agendamentos"
              :slot-height="slotHeight"
              @reagendar="onReagendar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de criação de agendamento -->
  <AgendamentoModal
    :open="showModal"
    :is-edition="isEdition"
    :is-rescheduling="isRescheduling"
    :agendamento-id="selectedAgendamentoId"
    :existing-agendamentos="agendamentos"
    @close="onModalClose"
    @saved="onSaved"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database'
import AgendamentoControle from '~/components/AgendamentoControle.vue'
import AgendamentoProfissional from '~/components/AgendamentoProfissional.vue'
import AgendamentoDiasSemana from '~/components/AgendamentoDiasSemana.vue'
import AgendamentoReguaHorarios from '~/components/AgendamentoReguaHorarios.vue'
import AgendamentoItemAgendado from '~/components/AgendamentoItemAgendado.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useAgendamentosStore } from '~/stores/agendamentos'
import { useAgendamentos } from '~/composables/useAgendamentos'
import AgendamentoModal from '~/components/AgendamentoModal.vue'

type VwProfissionalRow = Database['public']['Views']['vw_profissionais']['Row']

const store = useAgendamentosStore()
const slotHeight = 110

const { fetchAgendamentosByPeriodo } = useAgendamentos()
const agendamentos = ref<Database['public']['Tables']['agendamentos']['Row'][]>([])
const profissionalNaoEncontrado = ref(false)
const profissionalId = ref<number | null>(null)
const showModal = ref(false)
const isEdition = ref(false)
const isRescheduling = ref(false)
const selectedAgendamentoId = ref<number | undefined>(undefined)

function toLocalDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const periodoInicio = computed(() => store.diasSemana[0] ? toLocalDateStr(store.diasSemana[0]) : '')
const periodoFim = computed(() => store.diasSemana[6] ? toLocalDateStr(store.diasSemana[6]) : '')

async function carregarAgendamentos(): Promise<void> {
  const id = profissionalId.value
  if (id == null) {
    console.warn('[AgendamentoManager] profissional não encontrado — busca de agendamentos cancelada.')
    profissionalNaoEncontrado.value = true
    return
  }
  profissionalNaoEncontrado.value = false
  agendamentos.value = await fetchAgendamentosByPeriodo(periodoInicio.value, periodoFim.value, id)
}

function onProfissionalLoaded(profissional: VwProfissionalRow | null): void {
  profissionalId.value = profissional?.usuario_id ?? null
  carregarAgendamentos()
}

watch([periodoInicio, periodoFim], () => {
  if (profissionalId.value != null) carregarAgendamentos()
})

onMounted(() => {
  store.$reset()
})

function onNovo(): void {
  isEdition.value = false
  isRescheduling.value = false
  selectedAgendamentoId.value = undefined
  showModal.value = true
}

function onReagendar(agendamento: Database['public']['Tables']['agendamentos']['Row']): void {
  isEdition.value = false
  isRescheduling.value = true
  selectedAgendamentoId.value = agendamento.id
  showModal.value = true
}

function onModalClose(): void {
  showModal.value = false
  isEdition.value = false
  isRescheduling.value = false
  selectedAgendamentoId.value = undefined
}

function onSaved(): void {
  showModal.value = false
  carregarAgendamentos()
}
</script>
