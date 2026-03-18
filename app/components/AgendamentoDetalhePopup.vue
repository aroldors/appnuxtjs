<template>
  <Teleport to="body">
    <!-- Backdrop transparente para fechar ao clicar fora -->
    <div v-if="open" class="fixed inset-0 z-40" @click="emit('close')" />

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="fixed z-50 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        :style="popupStyle"
        @click.stop
      >
        <!-- Seta balloon -->
        <div class="absolute w-0 h-0 pointer-events-none" :style="arrowStyle" />
        <!-- Seta balloon borda (camada de baixo, 1px maior) -->
        <div class="absolute w-0 h-0 pointer-events-none" :style="arrowBorderStyle" />

        <!-- Cabeçalho colorido por status -->
        <div
          class="px-4 py-2.5 flex items-center justify-between rounded-t-xl"
          :style="{ backgroundColor: statusColor }"
        >
          <div class="flex items-center gap-1.5 text-white">
            <ClockIcon class="h-4 w-4 shrink-0" />
            <span class="text-sm font-semibold tracking-wide">{{ horaTexto }}</span>
            <span v-if="agendamento.status" class="ml-2 text-xs font-normal opacity-80 capitalize">
              {{ agendamento.status }}
            </span>
          </div>
          <button
            type="button"
            class="text-white/70 hover:text-white transition-colors"
            @click="emit('close')"
          >
            <XMarkIcon class="h-4 w-4" />
          </button>
        </div>

        <!-- Corpo — único elemento que rola -->
        <div class="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2.5 text-sm divide-y divide-gray-50">
          <!-- Data -->
          <div class="flex items-start gap-2.5">
            <CalendarDaysIcon class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Data</p>
              <p class="text-gray-800 font-medium">{{ dataFormatada }}</p>
            </div>
          </div>

          <!-- Título -->
          <div class="flex items-start gap-2.5 pt-2.5">
            <TagIcon class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Título</p>
              <p class="text-gray-800 font-medium truncate">{{ agendamento.titulo ?? '—' }}</p>
            </div>
          </div>

          <!-- Lead / Cliente -->
          <div class="flex items-start gap-2.5 pt-2.5">
            <UserIcon class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Lead / Cliente</p>
              <p class="text-gray-800 font-medium truncate">{{ clienteNome }}</p>
            </div>
          </div>

          <!-- Profissional -->
          <div class="flex items-start gap-2.5 pt-2.5">
            <BriefcaseIcon class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Profissional</p>
              <p class="text-gray-800 font-medium truncate">{{ agendamento.nome_profissional ?? '—' }}</p>
            </div>
          </div>

          <!-- Descrição (opcional) -->
          <div v-if="agendamento.descricao" class="flex items-start gap-2.5 pt-2.5">
            <DocumentTextIcon class="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div class="min-w-0">
              <p class="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">Descrição</p>
              <p class="text-gray-600 leading-snug">{{ agendamento.descricao }}</p>
            </div>
          </div>
        </div>

        <!-- Rodapé -->
        <div class="border-t border-gray-100 px-4 py-2.5 flex gap-2 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            class="flex-1 text-xs font-medium px-3 py-1.5 rounded-md border border-blue-400 text-blue-600 hover:bg-blue-50 transition-colors"
            @click="emit('reagendar', props.agendamento)"
          >
            Reagendar
          </button>
          <button
            type="button"
            class="flex-1 text-xs font-medium px-3 py-1.5 rounded-md border border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="flex-1 text-xs font-medium px-3 py-1.5 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import {
  ClockIcon,
  XMarkIcon,
  CalendarDaysIcon,
  TagIcon,
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import type { Database } from '~/types/database'

type AgendamentoRow = Database['public']['Tables']['agendamentos']['Row']

interface AnchorRect {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

interface Props {
  open: boolean
  agendamento: AgendamentoRow
  anchorRect: AnchorRect | null
}

interface Emits {
  (e: 'close'): void
  (e: 'reagendar', agendamento: AgendamentoRow): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = useSupabaseClient() as any

const clienteNome = ref('—')

const POPUP_WIDTH = 288
const POPUP_ESTIMATED_HEIGHT = 400
const MARGIN = 10

// Calcula lado onde o popup aparece, posição e altura máxima disponível
const placement = computed<{ left: number; top: number; maxHeight: number; side: 'left' | 'right' }>(() => {
  if (!props.anchorRect || typeof window === 'undefined') {
    return { left: MARGIN, top: MARGIN, maxHeight: POPUP_ESTIMATED_HEIGHT, side: 'left' }
  }

  const { top, bottom, left, right } = props.anchorRect
  const vw = window.innerWidth
  const vh = window.innerHeight

  let side: 'left' | 'right' = 'left'
  let popupLeft: number

  if (right + MARGIN + POPUP_WIDTH <= vw - MARGIN) {
    // Cabe à direita do card
    popupLeft = right + MARGIN
    side = 'left'
  } else {
    // Coloca à esquerda do card
    popupLeft = left - MARGIN - POPUP_WIDTH
    side = 'right'
  }

  // Alinha o topo com o card, clampeado ao viewport
  const cardCenter = top + (bottom - top) / 2
  let popupTop = cardCenter - 40 // 40px para alinhar com o cabeçalho
  popupTop = Math.max(MARGIN, popupTop)

  // Calcula altura máxima real disponível até o fim do viewport
  const maxHeight = Math.max(200, vh - popupTop - MARGIN)

  return { left: popupLeft, top: popupTop, maxHeight, side }
})

const popupStyle = computed(() => ({
  left: `${placement.value.left}px`,
  top: `${placement.value.top}px`,
  maxHeight: `${placement.value.maxHeight}px`
}))

// Offset vertical da seta relativo ao popup top
const arrowOffsetTop = computed(() => {
  if (!props.anchorRect) return 14
  const cardCenter = props.anchorRect.top + (props.anchorRect.bottom - props.anchorRect.top) / 2
  const diff = cardCenter - placement.value.top
  return Math.max(10, Math.min(diff - 8, placement.value.maxHeight - 30))
})

const arrowStyle = computed(() => {
  const side = placement.value.side
  const color = statusColor.value

  if (side === 'left') {
    // Popup à direita do card → seta aponta para a esquerda
    return {
      top: `${arrowOffsetTop.value}px`,
      left: '-8px',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderRight: `8px solid ${color}`
    }
  } else {
    // Popup à esquerda do card → seta aponta para a direita
    return {
      top: `${arrowOffsetTop.value}px`,
      right: '-8px',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      borderLeft: `8px solid ${color}`
    }
  }
})

const arrowBorderStyle = computed(() => {
  const side = placement.value.side
  if (side === 'left') {
    return {
      top: `${arrowOffsetTop.value - 1}px`,
      left: '-10px',
      borderTop: '9px solid transparent',
      borderBottom: '9px solid transparent',
      borderRight: '9px solid #e5e7eb'
    }
  } else {
    return {
      top: `${arrowOffsetTop.value - 1}px`,
      right: '-10px',
      borderTop: '9px solid transparent',
      borderBottom: '9px solid transparent',
      borderLeft: '9px solid #e5e7eb'
    }
  }
})

const horaTexto = computed(() => {
  const inicio = props.agendamento.hora_inicio?.slice(0, 5) ?? ''
  const fim = props.agendamento.hora_termino?.slice(0, 5) ?? ''
  if (inicio && fim) return `${inicio} – ${fim}`
  return inicio || '—'
})

const dataFormatada = computed(() => {
  if (!props.agendamento.data) return '—'
  const [year, month, day] = props.agendamento.data.split('-')
  if (!year || !month || !day) return props.agendamento.data

  const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const nomeMes = nomes[parseInt(month, 10) - 1] ?? month
  return `${day}/${month}/${year} · ${nomeMes}`
})

const statusColor = computed(() => {
  const status = props.agendamento.status?.toLowerCase() ?? ''
  if (props.agendamento.cancelado || status === 'cancelado') return '#ef4444'
  if (status === 'confirmado') return '#16a34a'
  if (status === 'pendente') return '#d97706'
  if (status === 'finalizado' || status === 'concluido' || status === 'concluído') return '#2563eb'
  return '#4f46e5'
})

async function fetchClienteNome () {
  clienteNome.value = '—'
  if (!props.agendamento.cliente_id) return
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('nome')
      .eq('id', props.agendamento.cliente_id)
      .maybeSingle()
    if (error || !data) return
    clienteNome.value = data.nome ?? '—'
  } catch {
    // silencioso
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) fetchClienteNome()
  }
)
</script>
