<template>
  <div id="perfil-page" class="space-y-6 p-6">

    <!-- Cabeçalho do perfil -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <!-- Avatar + nome + e-mail -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            <span class="text-2xl font-semibold text-gray-500 select-none">
              {{ form.nome ? form.nome.charAt(0).toUpperCase() : '?' }}
            </span>
          </div>
          <div>
            <p class="text-lg font-semibold text-gray-900">{{ form.nome || 'Seu Nome' }}</p>
            <p class="text-sm text-gray-500">{{ email }}</p>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="flex items-center gap-3">
          <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

          <button
            type="button"
            class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            @click="showChangePassword = !showChangePassword"
          >
            Alterar Senha
          </button>

          <button
            type="button"
            class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="loading"
            @click="handleSave"
          >
            {{ loading ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Dados Pessoais -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-1">Dados Pessoais</h2>
      <p class="text-sm text-gray-500 mb-6">Suas informações de cadastro.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nome -->
        <BaseInput
          v-model="form.nome"
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
        />

        <!-- E-mail (somente leitura) -->
        <BaseInput
          :modelValue="email"
          label="E-mail"
          type="email"
          :disabled="true"
          help-text="O e-mail não pode ser alterado aqui."
        />

        <!-- CPF -->
        <BaseInput
          v-model="form.cpf"
          label="CPF"
          type="text"
          placeholder="000.000.000-00"
        />

        <!-- Telefone -->
        <BaseInput
          v-model="form.telefone"
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
        />
      </div>
    </div>

    <!-- Endereço -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-1">Endereço</h2>
      <p class="text-sm text-gray-500 mb-6">Informações de localização.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Endereço -->
        <div class="md:col-span-2">
          <BaseInput
            v-model="form.endereco"
            label="Endereço"
            type="text"
            placeholder="Rua, Avenida..."
          />
        </div>

        <!-- Número -->
        <BaseInput
          v-model="form.numero"
          label="Número"
          type="text"
          placeholder="Ex: 123"
        />

        <!-- Bairro -->
        <BaseInput
          v-model="form.bairro"
          label="Bairro"
          type="text"
          placeholder="Seu bairro"
        />

        <!-- Cidade -->
        <BaseInput
          v-model="form.cidade"
          label="Cidade"
          type="text"
          placeholder="Sua cidade"
        />

        <!-- UF -->
        <BaseInput
          v-model="form.uf"
          label="UF"
          type="text"
          placeholder="Ex: SP"
        />
      </div>
    </div>

    <!-- Alterar Senha (expansível) -->
    <ChangePassword v-if="showChangePassword" />
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/BaseInput.vue'
import ChangePassword from '~/components/ChangePassword.vue'
import { useAuth } from '~/composables/useAuth'

const supabaseUser = useSupabaseUser()
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const { updateProfile, loading } = useAuth()

const email = computed(() => supabaseUser.value?.email ?? '')

const form = reactive({
  nome: profile.value?.nome ?? '',
  cpf: profile.value?.cpf ?? '',
  telefone: profile.value?.telefone ?? '',
  endereco: profile.value?.endereco ?? '',
  numero: profile.value?.numero ?? '',
  bairro: profile.value?.bairro ?? '',
  cidade: profile.value?.cidade ?? '',
  uf: profile.value?.uf ?? '',
})

const successMessage = ref('')
const errorMessage = ref('')
const showChangePassword = ref(false)

watch(profile, (val) => {
  if (!val) return
  form.nome = val.nome ?? ''
  form.cpf = val.cpf ?? ''
  form.telefone = val.telefone ?? ''
  form.endereco = val.endereco ?? ''
  form.numero = val.numero ?? ''
  form.bairro = val.bairro ?? ''
  form.cidade = val.cidade ?? ''
  form.uf = val.uf ?? ''
})

async function handleSave() {
  successMessage.value = ''
  errorMessage.value = ''

  const result = await updateProfile({
    nome: form.nome,
    cpf: form.cpf,
    telefone: form.telefone,
    endereco: form.endereco,
    numero: form.numero,
    bairro: form.bairro,
    cidade: form.cidade,
    uf: form.uf,
  })

  if (result.success) {
    successMessage.value = result.message
    await userStore.fetchProfile()
  } else {
    errorMessage.value = result.message
  }
}
</script>
