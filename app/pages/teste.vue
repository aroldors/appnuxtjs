<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Componentes Base - Teste</h1>
      
      <!-- BaseButton Tests -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">BaseButton</h2>
        
        <!-- Variants -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Variantes</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton variant="primary" @click="handleClick('Primary')">
              Primary
            </BaseButton>
            <BaseButton variant="secondary" @click="handleClick('Secondary')">
              Secondary
            </BaseButton>
            <BaseButton variant="danger" @click="handleClick('Danger')">
              Danger
            </BaseButton>
            <BaseButton variant="success" @click="handleClick('Success')">
              Success
            </BaseButton>
            <BaseButton variant="outline" @click="handleClick('Outline')">
              Outline
            </BaseButton>
          </div>
        </div>
        
        <!-- Buttons with Icons -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Botões com Ícones</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton variant="primary" @click="showToast('success', 'Sucesso!')">
              <template #icon>
                <PlusIcon class="h-4 w-4 mr-2" />
              </template>
              Adicionar
            </BaseButton>
            <BaseButton variant="danger" @click="showToast('error', 'Erro ao excluir!')">
              <template #icon>
                <TrashIcon class="h-4 w-4 mr-2" />
              </template>
              Excluir
            </BaseButton>
            <BaseButton variant="success" @click="showToast('success', 'Item salvo!')">
              <template #icon>
                <CheckIcon class="h-4 w-4 mr-2" />
              </template>
              Salvar
            </BaseButton>
            <BaseButton variant="outline" @click="showToast('info', 'Editando item...')">
              <template #icon>
                <PencilIcon class="h-4 w-4 mr-2" />
              </template>
              Editar
            </BaseButton>
          </div>
        </div>
        
        <!-- Sizes -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Tamanhos</h3>
          <div class="flex flex-wrap items-center gap-4">
            <BaseButton size="sm" @click="handleClick('Small')">
              Small
            </BaseButton>
            <BaseButton size="md" @click="handleClick('Medium')">
              Medium
            </BaseButton>
            <BaseButton size="lg" @click="handleClick('Large')">
              Large
            </BaseButton>
          </div>
        </div>
        
        <!-- States -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Estados</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton @click="handleClick('Normal')">
              Normal
            </BaseButton>
            <BaseButton disabled>
              Disabled
            </BaseButton>
            <BaseButton :loading="isLoading" @click="handleLoadingTest">
              {{ isLoading ? '' : 'Loading Test' }}
            </BaseButton>
            <BaseButton :loading="isLoadingCustom" loading-text="Salvando..." @click="handleLoadingCustomTest">
              {{ isLoadingCustom ? '' : 'Custom Loading' }}
            </BaseButton>
            <BaseButton full-width>
              Full Width
            </BaseButton>
          </div>
        </div>
        
        <!-- Types -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Tipos de Formulário</h3>
          <div class="flex flex-wrap gap-4">
            <BaseButton type="button" variant="outline">
              Button
            </BaseButton>
            <BaseButton type="submit" variant="success">
              Submit
            </BaseButton>
            <BaseButton type="reset" variant="secondary">
              Reset
            </BaseButton>
          </div>
        </div>
      </section>
      
      <!-- BaseInput Tests -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">BaseInput</h2>
        
        <!-- Basic Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BaseInput 
            v-model="formData.name"
            label="Nome"
            placeholder="Digite seu nome"
            required
          >
            <template #icon>
              <UserIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>
          
          <BaseInput 
            v-model="formData.email"
            type="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            help-text="Será usado para contato"
          >
            <template #icon>
              <EnvelopeIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>
          
          <BaseInput 
            v-model="formData.phone"
            type="tel"
            label="Telefone"
            placeholder="(11) 99999-9999"
          >
            <template #icon>
              <PhoneIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>
          
          <BaseInput 
            v-model="formData.website"
            type="url"
            label="Website"
            placeholder="https://example.com"
          >
            <template #icon>
              <GlobeAltIcon class="h-5 w-5 text-gray-400" />
            </template>
          </BaseInput>
        </div>
        
        <!-- Sizes -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Tamanhos</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput 
              v-model="formData.small"
              label="Small"
              size="sm"
              placeholder="Small input"
            />
            
            <BaseInput 
              v-model="formData.medium"
              label="Medium"
              size="md"
              placeholder="Medium input"
            />
            
            <BaseInput 
              v-model="formData.large"
              label="Large"
              size="lg"
              placeholder="Large input"
            />
          </div>
        </div>
        
        <!-- Variants -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Variantes</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput 
              v-model="formData.default"
              label="Default"
              variant="default"
              placeholder="Default variant"
            />
            
            <BaseInput 
              v-model="formData.error"
              label="Error"
              variant="error"
              placeholder="Error variant"
              error-message="Este campo contém erro"
            />
            
            <BaseInput 
              v-model="formData.success"
              label="Success"
              variant="success"
              placeholder="Success variant"
              help-text="Campo válido"
            />
          </div>
        </div>
        
        <!-- States -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Estados</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaseInput 
              v-model="formData.normal"
              label="Normal"
              placeholder="Campo normal"
            />
            
            <BaseInput 
              v-model="formData.disabled"
              label="Disabled"
              placeholder="Campo desabilitado"
              disabled
            />
            
            <BaseInput 
              v-model="formData.readonly"
              label="Readonly"
              placeholder="Campo somente leitura"
              readonly
            />
          </div>
        </div>
        
        <!-- Password -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Password</h3>
          <div class="max-w-md">
            <BaseInput 
              v-model="formData.password"
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              required
              help-text="Mínimo 8 caracteres"
            >
              <template #icon>
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </template>
            </BaseInput>
          </div>
        </div>
        
        <!-- Search Example -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-700 mb-4">Exemplo de Busca</h3>
          <div class="max-w-md">
            <BaseInput 
              v-model="formData.search"
              type="search"
              label="Buscar"
              placeholder="Digite sua pesquisa..."
            >
              <template #icon>
                <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
              </template>
            </BaseInput>
          </div>
        </div>
      </section>
      
      <!-- Form Data Preview -->
      <section class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Dados do Formulário</h3>
        <pre class="bg-white p-4 rounded border text-sm overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
        
        <div class="mt-4 flex gap-4">
          <BaseButton @click="clearForm" variant="outline">
            Limpar Formulário
          </BaseButton>
          <BaseButton @click="handleSubmit" variant="primary">
            Enviar Dados
          </BaseButton>
          <BaseButton @click="showToast('warning', 'Teste de aviso!')" variant="secondary">
            Teste Toast Warning
          </BaseButton>
        </div>
      </section>
      
      <!-- Click Log -->
      <section v-if="clickLog.length > 0" class="mt-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">Log de Cliques</h3>
        <div class="bg-gray-100 p-4 rounded max-h-40 overflow-y-auto">
          <div v-for="(click, index) in clickLog" :key="index" class="text-sm text-gray-600">
            {{ click.time }}: Botão "{{ click.button }}" clicado
          </div>
        </div>
        <BaseButton @click="clearLog" variant="outline" size="sm" class="mt-2">
          Limpar Log
        </BaseButton>
      </section>
    </div>
</template>

<script setup lang="ts">
import { 
  PlusIcon, 
  TrashIcon, 
  CheckIcon, 
  PencilIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  LockClosedIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

// Toast instance
const toast = useToast()
// Reactive form data
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  website: '',
  small: '',
  medium: '',
  large: '',
  default: '',
  error: 'Valor inválido',
  success: 'Valor correto',
  normal: '',
  disabled: 'Campo desabilitado',
  readonly: 'Somente leitura',
  password: '',
  search: ''
})

// Click log
const clickLog = ref<Array<{ button: string; time: string }>>([])

// Loading states
const isLoading = ref(false)
const isLoadingCustom = ref(false)

// Handle button clicks
function handleClick(buttonName: string) {
  const now = new Date()
  clickLog.value.push({
    button: buttonName,
    time: now.toLocaleTimeString('pt-BR')
  })
}

// Handle loading tests
function handleLoadingTest() {
  if (isLoading.value) return
  
  isLoading.value = true
  handleClick('Loading Test - Iniciado')
  
  setTimeout(() => {
    isLoading.value = false
    handleClick('Loading Test - Finalizado')
  }, 3000)
}

function handleLoadingCustomTest() {
  if (isLoadingCustom.value) return
  
  isLoadingCustom.value = true
  handleClick('Custom Loading - Iniciado')
  
  setTimeout(() => {
    isLoadingCustom.value = false
    handleClick('Custom Loading - Finalizado')
  }, 2000)
}

// Form actions
function clearForm() {
  Object.keys(formData).forEach((key) => {
    const formKey = key as keyof typeof formData
    if (formKey === 'disabled') {
      formData[formKey] = 'Campo desabilitado'
    } else if (formKey === 'readonly') {
      formData[formKey] = 'Somente leitura'
    } else if (formKey === 'error') {
      formData[formKey] = 'Valor inválido'
    } else if (formKey === 'success') {
      formData[formKey] = 'Valor correto'
    } else {
      formData[formKey] = ''
    }
  })
}

function handleSubmit() {
  console.log('Form submitted:', formData)
  alert('Dados enviados! Verifique o console para detalhes.')
}

function clearLog() {
  clickLog.value = []
}

// Toast functions
function showToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  switch (type) {
    case 'success':
      toast.success(message)
      break
    case 'error':
      toast.error(message)
      break
    case 'warning':
      toast.warning(message)
      break
    case 'info':
      toast.info(message)
      break
  }
  handleClick(`Toast ${type}: ${message}`)
}

// Page meta
definePageMeta({
  layout: 'default',
  title: 'Teste de Componentes',
  description: 'Página para testar componentes BaseButton e BaseInput'
})
</script>