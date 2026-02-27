<template>
  <BaseModal
    :open="open"
    :title="isEdition ? 'Editar Conta' : 'Nova Conta'"
    size="xl"
    :confirm-text="isEdition ? 'Salvar Alterações' : 'Cadastrar'"
    cancel-text="Cancelar"
    :loading="loading"
    loading-text="Salvando..."
    @close="handleClose"
    @confirm="handleSubmit"
  >
    <form id="contas-modal-form" class="grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
      <!-- CPF/CNPJ -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.cpf_cnpj"
          label="CPF / CNPJ"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
          required
          :error-message="formErrors.cpf_cnpj"
        />
      </div>

      <!-- Nome Fantasia -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.nome_fantasia"
          label="Nome"
          placeholder="Nome fantasia"
          :error-message="formErrors.nome_fantasia"
        />
      </div>

      <!-- Razão Social -->
      <div class="md:col-span-2">
        <BaseInput
          v-model="form.razao_social"
          label="Razão Social"
          placeholder="Razão social da empresa"
          :error-message="formErrors.razao_social"
        />
      </div>

      <!-- Endereço -->
      <div class="md:col-span-2">
        <BaseInput
          v-model="form.endereco"
          label="Endereço"
          placeholder="Rua, Avenida, etc."
          :error-message="formErrors.endereco"
        />
      </div>

      <!-- Bairro -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.bairro"
          label="Bairro"
          placeholder="Bairro"
          :error-message="formErrors.bairro"
        />
      </div>

      <!-- Número -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.numero"
          label="Número"
          type="number"
          placeholder="Nº"
          :error-message="formErrors.numero"
        />
      </div>

      <!-- Cidade -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.cidade"
          label="Cidade"
          placeholder="Cidade"
          :error-message="formErrors.cidade"
        />
      </div>

      <!-- Estado -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.estado"
          label="Estado"
          placeholder="UF"
          :error-message="formErrors.estado"
        />
      </div>

      <!-- CEP -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.cep"
          label="CEP"
          placeholder="00000-000"
          :error-message="formErrors.cep"
        />
      </div>

      <!-- Telefone Comercial -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.fone_comercial"
          label="Telefone Comercial"
          type="tel"
          placeholder="(00) 0000-0000"
          :error-message="formErrors.fone_comercial"
        />
      </div>

      <!-- Telefone Celular -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.fone_celular"
          label="Telefone Celular"
          type="tel"
          placeholder="(00) 00000-0000"
          :error-message="formErrors.fone_celular"
        />
      </div>

      <!-- Email -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.email"
          label="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          :error-message="formErrors.email"
        />
      </div>

      <!-- Website -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.website"
          label="WebSite"
          type="url"
          placeholder="https://www.exemplo.com"
          :error-message="formErrors.website"
        />
      </div>

      <!-- Contato -->
      <div class="md:col-span-1">
        <BaseInput
          v-model="form.contato"
          label="Contato"
          placeholder="Nome do contato principal"
          :error-message="formErrors.contato"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import { useContas } from '../composables/useContas'
import type { Database } from '../types/database'

type ContaInsert = Database['public']['Tables']['contas']['Insert']
type ContaUpdate = Database['public']['Tables']['contas']['Update']

interface Props {
  open: boolean
  isEdition?: boolean
  contaId?: number
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
const { insertConta, updateConta, fetchContas, contas, loading, error: contaError } = useContas()

// Form state
const form = reactive<{
  cpf_cnpj: string
  nome_fantasia: string
  razao_social: string
  endereco: string
  bairro: string
  numero: string
  cidade: string
  estado: string
  cep: string
  fone_comercial: string
  fone_celular: string
  email: string
  website: string
  contato: string
}>({
  cpf_cnpj: '',
  nome_fantasia: '',
  razao_social: '',
  endereco: '',
  bairro: '',
  numero: '',
  cidade: '',
  estado: '',
  cep: '',
  fone_comercial: '',
  fone_celular: '',
  email: '',
  website: '',
  contato: ''
})

const formErrors = reactive<Partial<Record<keyof typeof form, string>>>({})

function resetForm () {
  form.cpf_cnpj = ''
  form.nome_fantasia = ''
  form.razao_social = ''
  form.endereco = ''
  form.bairro = ''
  form.numero = ''
  form.cidade = ''
  form.estado = ''
  form.cep = ''
  form.fone_comercial = ''
  form.fone_celular = ''
  form.email = ''
  form.website = ''
  form.contato = ''
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])
}

function populateForm (conta: Database['public']['Tables']['contas']['Row']) {
  form.cpf_cnpj = conta.cpf_cnpj ?? ''
  form.nome_fantasia = conta.nome_fantasia ?? ''
  form.razao_social = conta.razao_social ?? ''
  form.endereco = conta.endereco ?? ''
  form.bairro = conta.bairro ?? ''
  form.numero = conta.numero != null ? String(conta.numero) : ''
  form.cidade = conta.cidade ?? ''
  form.estado = conta.estado ?? ''
  form.cep = conta.cep ?? ''
  form.fone_comercial = conta.fone_comercial ?? ''
  form.fone_celular = conta.fone_celular ?? ''
  form.email = conta.email ?? ''
  form.website = conta.website ?? ''
  form.contato = conta.contato ?? ''
}

function validate (): boolean {
  Object.keys(formErrors).forEach(key => delete (formErrors as Record<string, string>)[key])

  if (!form.cpf_cnpj.trim()) {
    formErrors.cpf_cnpj = 'CPF / CNPJ é obrigatório.'
    return false
  }

  return true
}

async function handleSubmit () {
  if (!validate()) return

  if (props.isEdition && props.contaId !== null && props.contaId !== undefined) {
    const updates: ContaUpdate = {
      cpf_cnpj: form.cpf_cnpj.trim(),
      nome_fantasia: form.nome_fantasia.trim() || null,
      razao_social: form.razao_social.trim() || null,
      endereco: form.endereco.trim() || null,
      bairro: form.bairro.trim() || null,
      numero: form.numero !== '' ? Number(form.numero) : null,
      cidade: form.cidade.trim() || null,
      estado: form.estado.trim() || null,
      cep: form.cep.trim() || null,
      fone_comercial: form.fone_comercial.trim() || null,
      fone_celular: form.fone_celular.trim() || null,
      email: form.email.trim() || null,
      website: form.website.trim() || null,
      contato: form.contato.trim() || null
    }
    const result = await updateConta(props.contaId, updates)
    if (result) {
      toast.success('Conta atualizada com sucesso!')
      emit('saved')
    } else {
      toast.error(contaError.value ?? 'Erro ao atualizar a conta. Tente novamente.')
    }
  } else {
    const insert: ContaInsert = {
      cpf_cnpj: form.cpf_cnpj.trim(),
      nome_fantasia: form.nome_fantasia.trim() || null,
      razao_social: form.razao_social.trim() || null,
      endereco: form.endereco.trim() || null,
      bairro: form.bairro.trim() || null,
      numero: form.numero !== '' ? Number(form.numero) : null,
      cidade: form.cidade.trim() || null,
      estado: form.estado.trim() || null,
      cep: form.cep.trim() || null,
      fone_comercial: form.fone_comercial.trim() || null,
      fone_celular: form.fone_celular.trim() || null,
      email: form.email.trim() || null,
      website: form.website.trim() || null,
      contato: form.contato.trim() || null
    }
    const result = await insertConta(insert)
    if (result) {
      toast.success('Conta cadastrada com sucesso!')
      emit('saved')
    } else {
      toast.error(contaError.value ?? 'Erro ao cadastrar a conta. Tente novamente.')
    }
  }
}

function handleClose () {
  resetForm()
  emit('close')
}

// When opening in edit mode, fetch and populate form data
watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return

    if (props.isEdition && props.contaId != null) {
      // Try to find the record in the current list first
      let conta = contas.value.find(c => c.id === props.contaId)

      if (!conta) {
        await fetchContas()
        conta = contas.value.find(c => c.id === props.contaId)
      }

      if (conta) {
        populateForm(conta)
      }
    } else {
      resetForm()
    }
  }
)
</script>
