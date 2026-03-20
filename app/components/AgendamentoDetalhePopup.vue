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
        <div class="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-xl">

          <!-- Pendente: Confirmar + ícones Reagendar e Cancelar -->
          <div v-if="statusGroup === 'pendente'" class="flex items-center gap-2">
            <button
              type="button"
              :disabled="confirming"
              class="flex-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-500 text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="handleConfirmar"
            >
              {{ confirming ? 'Confirmando…' : 'Confirmar' }}
            </button>
            <button
              type="button"
              title="Reagendar"
              class="h-8 w-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors shrink-0"
              @click="emit('reagendar', props.agendamento)"
            >
              <ArrowPathIcon class="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Cancelar agendamento"
              class="h-8 w-8 rounded-lg bg-amber-400 hover:bg-amber-500 flex items-center justify-center text-white transition-colors shrink-0"
              @click="showCancelModal = true"
            >
              <NoSymbolIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Confirmado: apenas ícones Reagendar e Cancelar -->
          <div v-else-if="statusGroup === 'confirmado'" class="flex items-center justify-center gap-3">
            <button
              type="button"
              title="Reagendar"
              class="h-8 w-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
              @click="emit('reagendar', props.agendamento)"
            >
              <ArrowPathIcon class="h-4 w-4" />
            </button>
            <button
              type="button"
              title="Cancelar agendamento"
              class="h-8 w-8 rounded-lg bg-amber-400 hover:bg-amber-500 flex items-center justify-center text-white transition-colors"
              @click="showCancelModal = true"
            >
              <NoSymbolIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Finalizado / Concluído / Cancelado: apenas OK -->
          <div v-else class="flex justify-center">
            <button
              type="button"
              class="w-2/3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              @click="emit('close')"
            >
              OK
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Modal de cancelamento -->
  <BaseModal
    :open="showCancelModal"
    title="Cancelar agendamento"
    confirm-text="Cancelar agendamento"
    cancel-text="Voltar"
    confirm-variant="danger"
    :loading="canceling"
    loading-text="Cancelando…"
    size="sm"
    @close="showCancelModal = false"
    @confirm="handleCancelar"
  >
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Informe o motivo do cancelamento abaixo. Esta ação não poderá ser desfeita.
      </p>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">
          Motivo <span class="text-red-500 ml-1">*</span>
        </label>
        <textarea
          v-model="motivoCancelamento"
          rows="3"
          placeholder="Ex.: Cliente solicitou cancelamento..."
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent resize-none"
        />
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useSupabaseClient } from '#imports'
import { useAgendamentos } from '~/composables/useAgendamentos'
import BaseModal from '~/components/BaseModal.vue'
import {
  ClockIcon,
  XMarkIcon,
  CalendarDaysIcon,
  TagIcon,
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  NoSymbolIcon
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
  (e: 'confirmado', agendamento: AgendamentoRow): void
  (e: 'cancelado', agendamento: AgendamentoRow): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = useSupabaseClient() as any
const { confirmarAgendamento, cancelarAgendamento } = useAgendamentos()

const clienteNome = ref('—')
const confirming = ref(false)
const showCancelModal = ref(false)
const motivoCancelamento = ref('')
const canceling = ref(false)

async function handleConfirmar () {
  if (!props.agendamento?.id || confirming.value) return
  confirming.value = true
  try {
    const updated = await confirmarAgendamento(props.agendamento.id)
    if (updated) {
      emit('confirmado', updated)
      emit('close')
    }
  } finally {
    confirming.value = false
  }
}

async function handleCancelar () {
  if (!props.agendamento?.id || canceling.value) return
  canceling.value = true
  try {
    const updated = await cancelarAgendamento(props.agendamento.id, motivoCancelamento.value.trim() || undefined)
    if (updated) {
      emit('cancelado', updated)
      emit('close')
    }
  } finally {
    canceling.value = false
    showCancelModal.value = false
    motivoCancelamento.value = ''
  }
}

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

const statusGroup = computed<'pendente' | 'confirmado' | 'closed'>(() => {
  const s = props.agendamento.status?.toLowerCase() ?? ''
  if (props.agendamento.cancelado || s === 'cancelado' || s === 'finalizado' || s === 'concluido' || s === 'concluído') return 'closed'
  if (s === 'confirmado') return 'confirmado'
  return 'pendente'
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
    else motivoCancelamento.value = ''
  }
)
</script>
