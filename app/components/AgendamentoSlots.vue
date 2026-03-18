<template>
  <div
    id="agendamento-slot"
    class="absolute left-1 right-1 rounded overflow-hidden cursor-pointer border-l-4 shadow-sm transition-opacity hover:opacity-90"
    :class="estiloStatus.bg"
    :style="{ top: `${posicaoTopo}px`, height: `${altura}px`, minHeight: '20px' }"
    @click.stop="onCardClick"
  >
    <div class="px-2 py-1 h-full flex flex-col overflow-hidden" :class="estiloStatus.text">
      <p class="text-xs font-semibold leading-tight truncate">{{ agendamento.titulo ?? '—' }}</p>
      <p class="text-xs leading-tight truncate opacity-80">{{ horaTexto }}</p>
      <p v-if="agendamento.descricao && altura > 52" class="text-xs leading-tight truncate opacity-70 mt-0.5">
        {{ agendamento.descricao }}
      </p>
      <div v-if="agendamento.status && altura > 72" class="mt-auto">
        <span class="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/40 capitalize">
          {{ agendamento.status }}
        </span>
      </div>
    </div>
  </div>

  <AgendamentoDetalhePopup
    :open="showPopup"
    :agendamento="agendamento"
    :anchor-rect="anchorRect"
    @close="showPopup = false"
    @reagendar="(a) => { showPopup = false; emit('reagendar', a) }"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AgendamentoDetalhePopup from '~/components/AgendamentoDetalhePopup.vue'
import type { Database } from '~/types/database'

type AgendamentoRow = Database['public']['Tables']['agendamentos']['Row']

interface Emits {
  (e: 'reagendar', agendamento: AgendamentoRow): void
}

const emit = defineEmits<Emits>()

interface Props {
  agendamento: AgendamentoRow
  slotHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  slotHeight: 160
})

function parseMinutes(time: string | null): number {
  if (!time) return 0
  const parts = time.split(':')
  return parseInt(parts[0] ?? '0', 10) * 60 + parseInt(parts[1] ?? '0', 10)
}

const offsetInicio = 6 * 60 // grade começa às 06h

const posicaoTopo = computed(() => {
  const minutos = parseMinutes(props.agendamento.hora_inicio) - offsetInicio
  return Math.max(minutos, 0) * (props.slotHeight / 60)
})

const altura = computed(() => {
  const inicio = parseMinutes(props.agendamento.hora_inicio)
  const fim = parseMinutes(props.agendamento.hora_termino)
  const minutos = fim > inicio ? fim - inicio : 30
  return Math.max(minutos * (props.slotHeight / 60), 20)
})

const horaTexto = computed(() => {
  const inicio = props.agendamento.hora_inicio?.slice(0, 5) ?? ''
  const fim = props.agendamento.hora_termino?.slice(0, 5) ?? ''
  if (inicio && fim) return `${inicio} – ${fim}`
  return inicio || '—'
})

const showPopup = ref(false)
const anchorRect = ref<{ top: number; bottom: number; left: number; right: number; width: number; height: number } | null>(null)

function onCardClick (event: MouseEvent) {
  const el = (event.currentTarget as HTMLElement)
  const rect = el.getBoundingClientRect()
  anchorRect.value = {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height
  }
  showPopup.value = true
}

const estiloStatus = computed(() => {
  const status = props.agendamento.status?.toLowerCase() ?? ''
  if (props.agendamento.cancelado || status === 'cancelado') {
    return { bg: 'bg-red-100 border-red-500', text: 'text-red-800' }
  }
  if (status === 'confirmado') {
    return { bg: 'bg-green-100 border-green-500', text: 'text-green-800' }
  }
  if (status === 'pendente') {
    return { bg: 'bg-yellow-100 border-yellow-500', text: 'text-yellow-800' }
  }
  if (status === 'finalizado' || status === 'concluido' || status === 'concluído') {
    return { bg: 'bg-blue-100 border-blue-500', text: 'text-blue-800' }
  }
  return { bg: 'bg-indigo-100 border-indigo-500', text: 'text-indigo-800' }
})
</script>
