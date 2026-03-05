<template>
  <div id="change-password-section" class="bg-white rounded-xl border border-gray-200 p-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-1">Alterar Senha</h2>
    <p class="text-sm text-gray-500 mb-6">Preencha os campos abaixo para definir uma nova senha.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
      <div class="md:col-span-2">
        <BaseInput
          v-model="senhaAtual"
          label="Senha Atual"
          type="password"
          placeholder="Digite sua senha atual"
          :required="true"
          :errorMessage="errors.senhaAtual"
        />
      </div>

      <BaseInput
        v-model="novaSenha"
        label="Nova Senha"
        type="password"
        placeholder="Digite a nova senha"
        :required="true"
        :errorMessage="errors.novaSenha"
      />

      <BaseInput
        v-model="confirmarNovaSenha"
        label="Confirmar Nova Senha"
        type="password"
        placeholder="Confirme a nova senha"
        :required="true"
        :errorMessage="errors.confirmarNovaSenha"
      />
    </div>

    <div class="mt-6 flex items-center gap-4">
      <button
        type="button"
        class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :disabled="loading"
        @click="handleChangePassword"
      >
        {{ loading ? 'Salvando...' : 'Salvar nova senha' }}
      </button>

      <button
        type="button"
        class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        :disabled="loading"
        @click="clearFields"
      >
        Limpar
      </button>

      <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import { useAuth } from '~/composables/useAuth'

const { changePassword, loading } = useAuth()

const senhaAtual = ref('')
const novaSenha = ref('')
const confirmarNovaSenha = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const errors = reactive({
  senhaAtual: '',
  novaSenha: '',
  confirmarNovaSenha: '',
})

function clearFields() {
  senhaAtual.value = ''
  novaSenha.value = ''
  confirmarNovaSenha.value = ''
  errors.senhaAtual = ''
  errors.novaSenha = ''
  errors.confirmarNovaSenha = ''
  successMessage.value = ''
  errorMessage.value = ''
}

function validate(): boolean {
  errors.senhaAtual = ''
  errors.novaSenha = ''
  errors.confirmarNovaSenha = ''

  if (!senhaAtual.value) {
    errors.senhaAtual = 'Informe a senha atual.'
    return false
  }

  if (!novaSenha.value) {
    errors.novaSenha = 'Informe a nova senha.'
    return false
  }

  if (novaSenha.value.length < 6) {
    errors.novaSenha = 'A senha deve ter no mínimo 6 caracteres.'
    return false
  }

  if (senhaAtual.value === novaSenha.value) {
    errors.novaSenha = 'A nova senha deve ser diferente da senha atual.'
    return false
  }

  if (!confirmarNovaSenha.value) {
    errors.confirmarNovaSenha = 'Confirme a nova senha.'
    return false
  }

  if (novaSenha.value !== confirmarNovaSenha.value) {
    errors.confirmarNovaSenha = 'As senhas não coincidem.'
    return false
  }

  return true
}

async function handleChangePassword() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validate()) return

  const result = await changePassword(novaSenha.value)

  if (result.success) {
    successMessage.value = 'Senha alterada com sucesso!'
    clearFields()
  } else {
    errorMessage.value = result.error ?? 'Erro ao alterar a senha.'
  }
}
</script>
