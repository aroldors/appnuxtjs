<template>
  <BaseModal
    :open="open"
    :title="isEdition ? 'Editar Especialidade' : 'Nova Especialidade'"
    size="sm"
    :confirm-text="isEdition ? 'Salvar Alterações' : 'Cadastrar'"
    cancel-text="Cancelar"
    :loading="loading"
    loading-text="Salvando..."
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form id="especialidade-modal-form" class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="form.descricao"
        label="Descrição"
        placeholder="Descrição da especialidade"
        required
        :error-message="formErrors.descricao"
      />
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from '#imports'
import { useToast } from 'vue-toastification'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import { useEspecialidades } from '../composables/useEspecialidades'
import type { Database } from '../types/database'

type EspecialidadeInsert = Database['public']['Tables']['especialidades']['Insert']
type EspecialidadeUpdate = Database['public']['Tables']['especialidades']['Update']

interface Props {
  open: boolean
  isEdition?: boolean
  especialidadeId?: number
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
const { insertEspecialidade, updateEspecialidade, fetchEspecialidadeById, loading, error: especialidadeError } = useEspecialidades()

const form = reactive<{ descricao: string }>({
  descricao: ''
})

const formErrors = reactive<Partial<Record<keyof typeof form, string>>>({})

function resetForm() {
  form.descricao = ''
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
}

function populateForm(row: Database['public']['Tables']['especialidades']['Row']) {
  form.descricao = row.descricao ?? ''
}

function validate(): boolean {
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
  if (!form.descricao.trim()) {
    formErrors.descricao = 'Descrição é obrigatória.'
    return false
  }
  return true
}

async function handleSubmit() {
  if (!validate()) return

  let success = false

  if (props.isEdition && props.especialidadeId != null) {
    const payload: EspecialidadeUpdate = { descricao: form.descricao.trim() }
    const result = await updateEspecialidade(props.especialidadeId, payload)
    success = result !== null
  } else {
    const payload: EspecialidadeInsert = { descricao: form.descricao.trim() }
    const result = await insertEspecialidade(payload)
    success = result !== null
  }

  if (success) {
    toast.success(props.isEdition ? 'Especialidade atualizada com sucesso!' : 'Especialidade cadastrada com sucesso!')
    emit('saved')
  } else {
    toast.error(especialidadeError.value ?? 'Erro ao salvar especialidade. Tente novamente.')
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
    if (props.isEdition && props.especialidadeId != null) {
      const row = await fetchEspecialidadeById(props.especialidadeId)
      if (row) populateForm(row)
    }
  }
)
</script>
