<template>
  <BaseModal
    :open="open"
    :title="isEdition ? 'Editar Profissional' : 'Novo Profissional'"
    size="sm"
    :confirm-text="isEdition ? 'Salvar Alterações' : 'Cadastrar'"
    cancel-text="Cancelar"
    :loading="saving"
    loading-text="Salvando..."
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form id="profissional-modal-form" class="space-y-4" @submit.prevent="handleSubmit">
      <BaseDropdown
        v-model="form.usuario_id"
        label="Profissional"
        placeholder="Selecione um profissional"
        :options="usuarioOptions"
        :disabled="loadingOptions"
        required
        :error-message="formErrors.usuario_id"
      />
      <BaseDropdown
        v-model="form.especialidade_id"
        label="Especialidade"
        placeholder="Selecione uma especialidade"
        :options="especialidadeOptions"
        :disabled="loadingOptions"
        required
        :error-message="formErrors.especialidade_id"
      />
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from '#imports'
import { useSupabaseClient } from '#imports'
import { useToast } from 'vue-toastification'
import BaseModal from './BaseModal.vue'
import BaseDropdown from './BaseDropdown.vue'
import type { DropdownOption } from './BaseDropdown.vue'
import type { Database } from '../types/database'

interface Props {
  open: boolean
  isEdition?: boolean
  profissionalId?: number
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdition: false
})

const emit = defineEmits<Emits>()

const toast = useToast()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = useSupabaseClient() as any

const usuarioOptions = ref<DropdownOption[]>([])
const especialidadeOptions = ref<DropdownOption[]>([])
const loadingOptions = ref(false)
const saving = ref(false)

const form = reactive<{
  usuario_id: number | null
  especialidade_id: number | null
}>({
  usuario_id: null,
  especialidade_id: null
})

const formErrors = reactive<{ usuario_id?: string; especialidade_id?: string }>({})

function resetForm() {
  form.usuario_id = null
  form.especialidade_id = null
  delete formErrors.usuario_id
  delete formErrors.especialidade_id
}

function populateForm(row: Database['public']['Tables']['profissionais']['Row']) {
  form.usuario_id = row.usuario_id ?? null
  form.especialidade_id = row.especialidade_id ?? null
}

async function loadOptions() {
  loadingOptions.value = true
  try {
    const [usuariosRes, especialidadesRes] = await Promise.all([
      supabase.from('usuarios').select('id, nome').eq('ativo', true).order('nome', { ascending: true }),
      supabase.from('especialidades').select('id, descricao').order('id', { ascending: true })
    ])

    if (usuariosRes.error) throw usuariosRes.error
    if (especialidadesRes.error) throw especialidadesRes.error

    usuarioOptions.value = (usuariosRes.data ?? []).map((u: { id: number; nome: string | null }) => ({
      value: u.id,
      label: u.nome ?? String(u.id)
    }))

    especialidadeOptions.value = (especialidadesRes.data ?? []).map((e: { id: number; descricao: string | null }) => ({
      value: e.id,
      label: e.descricao ?? String(e.id)
    }))
  } catch (err) {
    console.error('[ProfissionalModal] Erro ao carregar opções:', err)
    toast.error('Erro ao carregar as opções. Tente novamente.')
  } finally {
    loadingOptions.value = false
  }
}

async function fetchProfissionalBase(id: number): Promise<Database['public']['Tables']['profissionais']['Row'] | null> {
  try {
    const { data, error } = await supabase.from('profissionais').select('*').eq('id', id).single()
    if (error) throw error
    return data
  } catch (err) {
    console.error('[ProfissionalModal] Erro ao buscar profissional:', err)
    return null
  }
}

function validate(): boolean {
  delete formErrors.usuario_id
  delete formErrors.especialidade_id

  let valid = true
  if (form.usuario_id == null) {
    formErrors.usuario_id = 'Profissional é obrigatório.'
    valid = false
  }
  if (form.especialidade_id == null) {
    formErrors.especialidade_id = 'Especialidade é obrigatória.'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return

  saving.value = true
  try {
    if (props.isEdition && props.profissionalId != null) {
      const { error } = await supabase
        .from('profissionais')
        .update({ usuario_id: form.usuario_id, especialidade_id: form.especialidade_id, updated_at: new Date().toISOString() })
        .eq('id', props.profissionalId)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('profissionais')
        .insert({ usuario_id: form.usuario_id, especialidade_id: form.especialidade_id })
      if (error) throw error
    }
    toast.success(props.isEdition ? 'Profissional atualizado com sucesso!' : 'Profissional cadastrado com sucesso!')
    emit('saved')
  } catch (err) {
    console.error('[ProfissionalModal] Erro ao salvar:', err)
    toast.error('Erro ao salvar profissional. Tente novamente.')
  } finally {
    saving.value = false
  }
}

function handleClose() {
  resetForm()
  emit('close')
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return
    resetForm()
    await loadOptions()
    if (props.isEdition && props.profissionalId != null) {
      const row = await fetchProfissionalBase(props.profissionalId)
      if (row) populateForm(row)
    }
  }
)
</script>
