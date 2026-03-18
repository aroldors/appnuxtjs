<template>
  <BaseModal
    :open="open"
    :title="isRescheduling ? 'Reagendar Agendamento' : isEdition ? 'Editar Agendamento' : 'Novo Agendamento'"
    size="xl"
    :confirm-text="isRescheduling ? 'Reagendar' : isEdition ? 'Salvar Alterações' : 'Cadastrar'"
    cancel-text="Cancelar"
    :loading="saving"
    :confirm-disabled="!canConfirm"
    loading-text="Salvando..."
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form id="agendamento-modal-form" class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
      <!-- Título -->
      <div class="md:col-span-2">
        <BaseInput
          v-model="form.titulo"
          label="Título"
          placeholder="Título do agendamento"
          required
          :disabled="isRescheduling"
          :error-message="formErrors.titulo"
        />
      </div>

      <!-- Lead / Cliente -->
      <div class="md:col-span-1">
        <BaseDropdown
          v-model="form.cliente_id"
          label="Lead / Cliente"
          placeholder="Selecione um lead"
          :options="leadsOptions"
          :disabled="isRescheduling || loadingLeads"
          :error-message="formErrors.cliente_id"
        />
      </div>

      <!-- Profissional -->
      <div class="md:col-span-1">
        <BaseDropdown
          v-model="form.profissional_id"
          label="Profissional"
          placeholder="Selecione um profissional"
          :options="profissionaisOptions"
          :disabled="loadingProfissionais"
          required
          :error-message="formErrors.profissional_id"
        />
      </div>

      <!-- Data -->
      <div class="md:col-span-1 space-y-1">
        <label class="block text-sm font-medium text-gray-700">
          Data <span class="text-red-500 ml-1">*</span>
        </label>
        <input
          v-model="form.data"
          type="date"
          required
          :min="minDate"
          class="block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1"
          :class="formErrors.data
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white'"
        />
        <p v-if="formErrors.data" class="text-sm text-red-600">{{ formErrors.data }}</p>
      </div>

      <!-- Hora Início / Hora Fim -->
      <div class="md:col-span-1 grid grid-cols-2 gap-4">
        <div>
          <BaseDropdown
            v-model="form.hora_inicio"
            label="Hora Início"
            placeholder="--:--"
            :options="availableStartOptions"
            required
            :error-message="formErrors.hora_inicio"
          />
          <p v-if="availableStartOptions.length === 0" class="text-sm text-red-600 mt-1">Sem horários disponíveis para este profissional nesta data.</p>
        </div>
        <div>
          <BaseDropdown
            v-model="form.hora_termino"
            label="Hora Fim"
            placeholder="--:--"
            :options="availableEndOptions"
            :error-message="formErrors.hora_termino"
          />
          <p v-if="form.hora_inicio && availableEndOptions.length === 0" class="text-sm text-red-600 mt-1">Nenhum horário de término disponível para o início selecionado.</p>
        </div>
      </div>

      <!-- Descrição -->
      <div class="md:col-span-2 space-y-1">
        <label class="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          v-model="form.descricao"
          rows="3"
          placeholder="Observações ou descrição do agendamento"
          :disabled="isRescheduling"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 resize-none"
          :class="isRescheduling ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useSupabaseClient } from '#imports'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseDropdown from './BaseDropdown.vue'
import type { DropdownOption } from './BaseDropdown.vue'
import { useAgendamentos } from '../composables/useAgendamentos'
import { useLeads } from '../composables/useLeads'
import type { Database } from '../types/database'

type AgendamentoInsert = Database['public']['Tables']['agendamentos']['Insert']
type AgendamentoUpdate = Database['public']['Tables']['agendamentos']['Update']
type VwProfissionalRow = Database['public']['Views']['vw_profissionais']['Row']

interface Props {
  open: boolean
  isEdition?: boolean
  isRescheduling?: boolean
  agendamentoId?: number
  existingAgendamentos?: Database['public']['Tables']['agendamentos']['Row'][]
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdition: false,
  isRescheduling: false,
  existingAgendamentos: () => []
})

const emit = defineEmits<Emits>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = useSupabaseClient() as any
const toast = useToast()
const { insertAgendamento, updateAgendamento, fetchAgendamentoById, loading: agendamentoLoading, error: agendamentoError } = useAgendamentos()
const { leads, fetchLeads } = useLeads()

const saving = computed(() => agendamentoLoading.value)

// Profissionais para o dropdown
const profissionaisRaw = ref<VwProfissionalRow[]>([])
const loadingProfissionais = ref(false)
const loadingLeads = ref(false)

// Form state
const form = reactive<{
  titulo: string
  cliente_id: number | null
  descricao: string
  data: string
  hora_inicio: string | null
  hora_termino: string | null
  profissional_id: number | null
}>({
  titulo: '',
  cliente_id: null,
  descricao: '',
  data: '',
  hora_inicio: null,
  hora_termino: null,
  profissional_id: null
})

const formErrors = reactive<Partial<Record<keyof typeof form, string>>>({})

// data mínima permitida (hoje - formato YYYY-MM-DD)
const minDate = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

// armazena última data válida para evitar que usuário digite data passada
const lastValidDate = ref<string | null>(null)

// Opções de horários (intervalos de 30 min, das 06:00 às 22:00)
const horasOptions = computed<DropdownOption[]>(() => {
  const options: DropdownOption[] = []
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m === 30) break
      const hour = String(h).padStart(2, '0')
      const min = String(m).padStart(2, '0')
      const time = `${hour}:${min}`
      options.push({ value: time, label: time })
    }
  }
  return options
})

// Opções de leads para o dropdown
const leadsOptions = computed<DropdownOption[]>(() =>
  leads.value.map(lead => ({ value: Number(lead.id), label: lead.name }))
)

// Opções de profissionais para o dropdown
const profissionaisOptions = computed<DropdownOption[]>(() =>
  profissionaisRaw.value
    .filter(p => p.usuario_id != null)
    .map(p => ({ value: p.usuario_id as number, label: p.nome ?? String(p.usuario_id) }))
)

// helper: converte "HH:MM" -> minutos desde 00:00
function parseMinutes (time: string | null | undefined): number {
  if (!time) return 0
  const [hh, mm] = (time ?? '').split(':')
  return (Number(hh) || 0) * 60 + (Number(mm) || 0)
}

// Agendamentos ocupados para o profissional e data selecionados
const occupiedIntervals = computed(() => {
  const list = props.existingAgendamentos ?? []
  if (!form.profissional_id || !form.data) return [] as { start: number; end: number }[]
  return (list
    .filter(a => {
      // filtra por profissional e data
      if (a.profissional_id !== Number(form.profissional_id)) return false
      if (a.data !== form.data) return false
      // se estivermos em edição ou reagendamento, ignore o próprio agendamento para não bloquear seus horários
      if ((props.isEdition || props.isRescheduling) && props.agendamentoId != null && a.id === props.agendamentoId) return false
      return true
    })
    .map(a => ({ start: parseMinutes(a.hora_inicio), end: parseMinutes(a.hora_termino) }))
  )
})

// Filtra opções de hora de início que não comecem dentro de um intervalo ocupado
const availableStartOptions = computed<DropdownOption[]>(() => {
  const occupied = occupiedIntervals.value
  return horasOptions.value.filter(o => {
    const s = parseMinutes(String(o.value))
    // bloqueia se começar dentro de qualquer intervalo existente (start >= ex.start && start < ex.end)
    return !occupied.some(i => s >= i.start && s < i.end)
  })
})

// Filtra opções de término baseado no início selecionado (e sem overlap)
const availableEndOptions = computed<DropdownOption[]>(() => {
  if (!form.hora_inicio) return horasOptions.value
  const s = parseMinutes(form.hora_inicio)
  const occupied = occupiedIntervals.value
  return horasOptions.value.filter(o => {
    const e = parseMinutes(String(o.value))
    if (e <= s) return false
    // não pode haver overlap: new interval [s,e) não intersect any occupied
    return !occupied.some(i => s < i.end && e > i.start)
  })
})

// controla habilitação do botão confirmar
const canConfirm = computed(() => {
  if (!form.titulo.trim()) return false
  if (!form.profissional_id) return false
  if (!form.data) return false
  if (!form.hora_inicio) return false
  if (availableStartOptions.value.length === 0) return false
  if (availableEndOptions.value.length === 0) return false
  return true
})

async function loadProfissionais () {
  loadingProfissionais.value = true
  try {
    const { data, error: sbError } = await supabase
      .from('vw_profissionais')
      .select('*')
      .order('nome', { ascending: true })
    if (sbError) throw sbError
    profissionaisRaw.value = (data ?? []) as VwProfissionalRow[]
  } catch (err) {
    console.error('[AgendamentoModal] Erro ao buscar profissionais:', err)
  } finally {
    loadingProfissionais.value = false
  }
}

async function loadLeads () {
  loadingLeads.value = true
  try {
    await fetchLeads()
  } finally {
    loadingLeads.value = false
  }
}

function resetForm () {
  form.titulo = ''
  form.cliente_id = null
  form.descricao = ''
  form.data = ''
  form.hora_inicio = null
  form.hora_termino = null
  form.profissional_id = null
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
}

function populateForm (agendamento: Database['public']['Tables']['agendamentos']['Row']) {
  form.titulo = agendamento.titulo ?? ''
  form.cliente_id = agendamento.cliente_id ?? null
  form.descricao = agendamento.descricao ?? ''
  form.data = agendamento.data ?? ''
  form.hora_inicio = agendamento.hora_inicio ?? null
  form.hora_termino = agendamento.hora_termino ?? null
  form.profissional_id = agendamento.profissional_id ?? null
}

function validate (): boolean {
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])

  if (!form.titulo.trim()) {
    formErrors.titulo = 'Título é obrigatório.'
    return false
  }

  if (!form.profissional_id) {
    formErrors.profissional_id = 'Profissional é obrigatório.'
    return false
  }

  if (!form.data) {
    formErrors.data = 'Data é obrigatória.'
    return false
  }

  if (!form.hora_inicio) {
    formErrors.hora_inicio = 'Hora de início é obrigatória.'
    return false
  }

  if (form.hora_termino && form.hora_inicio && form.hora_termino <= form.hora_inicio) {
    formErrors.hora_termino = 'Hora final deve ser posterior à hora de início.'
    return false
  }

  return true
}

async function handleSubmit () {
  if (!validate()) return

  const profissionalSelecionado = profissionaisRaw.value.find(p => p.usuario_id === form.profissional_id)

  if (props.isRescheduling && props.agendamentoId != null) {
    // Computa a nota de reagendamento
    const [year, month, day] = (form.data || '').split('-')
    const dataFmt = year && month && day ? `${day}/${month}` : form.data
    const horaFmt = form.hora_inicio ? `${form.hora_inicio}h` : ''
    const nota = `Reagendado para ${dataFmt} às ${horaFmt}`
    const descricaoAtualizada = form.descricao
      ? `${form.descricao}\n${nota}`
      : nota

    const updates: AgendamentoUpdate = {
      data: form.data || null,
      hora_inicio: form.hora_inicio ?? null,
      hora_termino: form.hora_termino ?? null,
      profissional_id: form.profissional_id ?? null,
      nome_profissional: profissionalSelecionado?.nome ?? null,
      descricao: descricaoAtualizada
    }
    const result = await updateAgendamento(props.agendamentoId, updates)
    if (result) {
      toast.success('Agendamento reagendado com sucesso!')
      emit('saved')
    } else {
      toast.error(agendamentoError.value ?? 'Erro ao reagendar. Tente novamente.')
    }
  } else if (props.isEdition && props.agendamentoId != null) {
    const updates: AgendamentoUpdate = {
      titulo: form.titulo.trim(),
      cliente_id: form.cliente_id ?? null,
      descricao: form.descricao.trim() || null,
      data: form.data || null,
      hora_inicio: form.hora_inicio ?? null,
      hora_termino: form.hora_termino ?? null,
      profissional_id: form.profissional_id ?? null,
      nome_profissional: profissionalSelecionado?.nome ?? null
    }
    const result = await updateAgendamento(props.agendamentoId, updates)
    if (result) {
      toast.success('Agendamento atualizado com sucesso!')
      emit('saved')
    } else {
      toast.error(agendamentoError.value ?? 'Erro ao atualizar o agendamento. Tente novamente.')
    }
  } else {
    const insert: AgendamentoInsert = {
      titulo: form.titulo.trim(),
      cliente_id: form.cliente_id ?? null,
      descricao: form.descricao.trim() || null,
      data: form.data || null,
      hora_inicio: form.hora_inicio ?? null,
      hora_termino: form.hora_termino ?? null,
      profissional_id: form.profissional_id ?? null,
      nome_profissional: profissionalSelecionado?.nome ?? null,
      status: 'Pendente'
    }
    const result = await insertAgendamento(insert)
    if (result) {
      toast.success('Agendamento cadastrado com sucesso!')
      emit('saved')
    } else {
      toast.error(agendamentoError.value ?? 'Erro ao cadastrar o agendamento. Tente novamente.')
    }
  }
}

function handleClose () {
  resetForm()
  emit('close')
}

// Carrega listas de suporte ao abrir o modal
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return

    await Promise.all([loadLeads(), loadProfissionais()])

    if ((props.isEdition || props.isRescheduling) && props.agendamentoId != null) {
      const agendamento = await fetchAgendamentoById(props.agendamentoId)
      if (agendamento) {
        populateForm(agendamento)
        // set last valid date to current value (allow showing existing past date but keep as "valid" until user changes)
        lastValidDate.value = form.data || minDate.value
      }
    } else {
      resetForm()
      lastValidDate.value = minDate.value
    }
  }
)

// Evita que o usuário digite/cole uma data passada: reverte para última data válida
watch(
  () => form.data,
  (val) => {
    if (!val) return
    if (val < minDate.value) {
      formErrors.data = 'Data não pode ser anterior a hoje.'
      // revert
      form.data = lastValidDate.value ?? minDate.value
    } else {
      // válido
      formErrors.data = undefined
      lastValidDate.value = val
    }
  }
)
</script>
