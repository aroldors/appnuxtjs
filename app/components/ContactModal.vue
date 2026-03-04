<template>
  <BaseModal
    :open="open"
    :title="isEdition ? 'Editar Contato' : 'Novo Contato'"
    size="lg"
    :confirm-text="isEdition ? 'Salvar Alterações' : 'Cadastrar'"
    cancel-text="Cancelar"
    :loading="loading"
    loading-text="Salvando..."
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form id="contact-modal-form" class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
      <!-- Nome -->
      <div class="md:col-span-2">
        <BaseInput
          v-model="form.nome"
          label="Nome"
          placeholder="Nome do contato"
          required
          :error-message="formErrors.nome"
        />
      </div>

      <!-- Cargo / Conta -->
      <div>
        <BaseInput
          v-model="form.cargo"
          label="Cargo"
          placeholder="Cargo ou função"
        />
      </div>

      <div>
        <BaseDropdown
          v-model="form.conta"
          label="Conta"
          placeholder="Selecione uma conta..."
          :options="contasOptions"
        />
      </div>

      <!-- Telefone / E-mail -->
      <div>
        <BaseInput
          v-model="form.telefone"
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          :error-message="formErrors.telefone"
        />
      </div>

      <div>
        <BaseInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          :error-message="formErrors.email"
        />
      </div>

      <!-- Endereço / Número / Bairro -->
      <div class="md:col-span-2 grid grid-cols-6 gap-4">
        <div class="col-span-6 md:col-span-3">
          <BaseInput
            v-model="form.endereco"
            label="Endereço"
            placeholder="Rua, Avenida, etc."
          />
        </div>
        <div class="col-span-6 md:col-span-1">
          <BaseInput
            v-model="form.numero"
            label="Número"
            type="number"
            placeholder="Nº"
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <BaseInput
            v-model="form.bairro"
            label="Bairro"
            placeholder="Bairro"
          />
        </div>
      </div>

      <!-- Cidade / Estado / CEP -->
      <div class="md:col-span-2 grid grid-cols-6 gap-4">
        <div class="col-span-6 md:col-span-3">
          <BaseInput
            v-model="form.cidade"
            label="Cidade"
            placeholder="Cidade"
          />
        </div>
        <div class="col-span-6 md:col-span-1">
          <BaseInput
            v-model="form.estado"
            label="Estado"
            placeholder="UF"
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <BaseInput
            v-model="form.cep"
            label="CEP"
            placeholder="00000-000"
          />
        </div>
      </div>

      <!-- Status / Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          v-model="form.status"
          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="bloqueado">Bloqueado</option>
        </select>
      </div>

      <div>
        <BaseInput
          v-model="tagsInput"
          label="Tags"
          placeholder="decisor, tecnologia, ceo (separadas por vírgula)"
        />
      </div>

    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from '#imports'
import { useToast } from 'vue-toastification'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseDropdown from './BaseDropdown.vue'
import { useContacts } from '../composables/useContacts'
import { useContas } from '../composables/useContas'
import type { Database } from '../types/database'

type ContatoInsert = Database['public']['Tables']['contatos']['Insert']
type ContatoUpdate = Database['public']['Tables']['contatos']['Update']

interface Props {
  open: boolean
  isEdition?: boolean
  contactId?: number
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
const { insertContact, updateContact, fetchContactById, loading, error: contactError } = useContacts()
const { contas } = useContas()

const contasOptions = computed(() =>
  contas.value.map(c => ({
    value: c.id,
    label: c.nome_fantasia || c.razao_social || String(c.id)
  }))
)

const form = reactive<{
  nome: string
  email: string
  telefone: string
  cargo: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  conta: string | number | null
  status: string
}>({
  nome: '',
  email: '',
  telefone: '',
  cargo: '',
  endereco: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  conta: null,
  status: 'ativo'
})

const tagsInput = ref('')
const formErrors = reactive<Partial<Record<keyof typeof form | 'tags', string>>>({})

function resetForm() {
  form.nome = ''
  form.email = ''
  form.telefone = ''
  form.cargo = ''
  form.endereco = ''
  form.numero = ''
  form.bairro = ''
  form.cidade = ''
  form.estado = ''
  form.cep = ''
  form.conta = null
  form.status = 'ativo'
  tagsInput.value = ''
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
}

function populateForm(contato: Database['public']['Tables']['contatos']['Row']) {
  form.nome = contato.nome ?? ''
  form.email = contato.email ?? ''
  form.telefone = contato.telefone ?? ''
  form.cargo = contato.cargo ?? ''
  form.endereco = contato.endereco ?? ''
  form.numero = contato.numero != null ? String(contato.numero) : ''
  form.bairro = contato.bairro ?? ''
  form.cidade = contato.cidade ?? ''
  form.estado = contato.estado ?? ''
  form.cep = contato.cep ?? ''
  form.conta = contato.conta ?? null
  form.status = contato.status ?? 'ativo'
  tagsInput.value = contato.tags?.join(', ') ?? ''
}

function validate(): boolean {
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
  if (!form.nome.trim()) {
    formErrors.nome = 'Nome e obrigatorio.'
    return false
  }
  return true
}

function parseTags(): string[] {
  return tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
}

async function handleSubmit() {
  if (!validate()) return

  const tags = parseTags()

  const basePayload = {
    nome: form.nome.trim() || null,
    email: form.email.trim() || null,
    telefone: form.telefone.trim() || null,
    cargo: form.cargo.trim() || null,
    endereco: form.endereco.trim() || null,
    numero: form.numero !== '' ? Number(form.numero) : null,
    bairro: form.bairro.trim() || null,
    cidade: form.cidade.trim() || null,
    estado: form.estado.trim() || null,
    cep: form.cep.trim() || null,
    conta: form.conta != null ? Number(form.conta) : null,
    status: form.status,
    tags: tags.length ? tags : null
  }

  if (props.isEdition && props.contactId != null) {
    const result = await updateContact(props.contactId, basePayload as ContatoUpdate)
    if (result) {
      toast.success('Contato atualizado com sucesso!')
      emit('saved')
    } else {
      toast.error(contactError.value ?? 'Erro ao atualizar o contato. Tente novamente.')
    }
  } else {
    const result = await insertContact(basePayload as ContatoInsert)
    if (result) {
      toast.success('Contato cadastrado com sucesso!')
      emit('saved')
    } else {
      toast.error(contactError.value ?? 'Erro ao cadastrar o contato. Tente novamente.')
    }
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

    if (props.isEdition && props.contactId != null) {
      const contato = await fetchContactById(props.contactId)
      if (contato) populateForm(contato)
    } else {
      resetForm()
    }
  }
)
</script>
