<template>
  <div class="space-y-6">
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Dados da Empresa -->
          <div v-if="activeTab === 'company'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Informações da Empresa</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  v-model="companyForm.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  v-model="companyForm.cnpj"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fuso Horário
                </label>
                <select
                  v-model="companyForm.timezone"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select
                  v-model="companyForm.currency"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                @click="resetCompanyForm"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                @click="saveCompanyData"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Salvar Empresa
              </button>
            </div>
          </div>

          <!-- Mensagens / Modelos de Mensagem -->
          <div v-if="activeTab === 'messages'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Modelos de Mensagens</h3>
              <button
                @click="showNewTemplateModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                + Novo Modelo
              </button>
            </div>

            <div class="flex items-center space-x-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Buscar modelos..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select v-model="filterType" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">Todos os tipos</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-mail</option>
              </select>

              <select v-model="filterTag" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option value="">Todas as tags</option>
                <option v-for="tag in availableTags" :key="tag" :value="tag">
                  {{ tag }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-xs font-medium text-gray-500">Total de Modelos</p>
                    <p class="text-xl font-bold text-gray-900">{{ templatesStats.total }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-xs font-medium text-gray-500">WhatsApp</p>
                    <p class="text-xl font-bold text-gray-900">{{ templatesStats.whatsappTemplates }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div class="flex items-center">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-xs font-medium text-gray-500">E-mail</p>
                    <p class="text-xl font-bold text-gray-900">{{ templatesStats.emailTemplates }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid gap-4">
              <div
                v-for="template in filteredTemplates"
                :key="template.id"
                class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="text-base font-medium text-gray-900">{{ template.title }}</h4>
                      <span
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getTypeBadgeColor(template.type)"
                      >
                        {{ getTypeLabel(template.type) }}
                      </span>
                    </div>

                    <div class="mb-3">
                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="tag in template.tags"
                          :key="tag"
                          class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          #{{ tag }}
                        </span>
                      </div>
                    </div>

                    <div class="bg-gray-50 rounded-md p-3 mb-3">
                      <p class="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">{{ template.content }}</p>
                    </div>

                    <p class="text-xs text-gray-500">Criado em {{ formatDate(template.createdAt) }}</p>
                  </div>

                  <div class="ml-6 flex flex-col space-y-2">
                    <button
                      @click="copyTemplate(template)"
                      class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Copiar
                    </button>
                    <button
                      @click="editTemplate(template)"
                      class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      @click="deleteTemplate(template.id)"
                      class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredTemplates.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum modelo encontrado</h3>
              <p class="mt-1 text-sm text-gray-500">Crie seu primeiro modelo de mensagem.</p>
              <div class="mt-6">
                <button
                  @click="showNewTemplateModal = true"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  + Novo Modelo
                </button>
              </div>
            </div>
          </div>

          <!-- Gerenciar Usuários -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Usuários da Empresa</h3>
              <button
                @click="showNewUserModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                + Adicionar Usuário
              </button>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in companyUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">
                              {{ user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                      >
                        {{ user.role === 'admin' ? 'Administrador' : 'Vendedor' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        v-if="user.id !== currentUser?.user_id"
                        @click="removeUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                      <span v-else class="text-gray-400">Você</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Adicionar Usuário -->
      <UserModal
        v-if="showNewUserModal"
        @saved="handleUserSaved"
        @cancel="showNewUserModal = false"
      />

      <!-- Modal Novo/Editar Template -->
      <MessageTemplateModal
        v-if="showNewTemplateModal || showEditTemplateModal"
        :template="editingTemplate"
        @save="handleSaveTemplate"
        @cancel="closeTemplateModal"
      />
    </div>
</template>

<script setup lang="ts">
import type { User, Company, MessageTemplate } from '~~/shared/types'
import { useMessages } from '~/composables/useMessages'

definePageMeta({
  layout: 'default',
  middleware: ['admin-only']
})

const userStore = useUserStore()
const { profile: currentUser } = storeToRefs(userStore)

// Mock company data - pode ser movido para um store posteriormente
const currentCompany = ref({
  id: 'default',
  name: 'Empresa Demo LTDA',
  cnpj: '12.345.678/0001-90',
  timezone: 'America/Sao_Paulo',
  currency: 'BRL'
})

const updateCompany = (data: any) => {
  console.log('Atualizar empresa:', data)
  Object.assign(currentCompany.value, data)
}

const activeTab = ref('company')
const showNewUserModal = ref(false)

// Messages tab
const {
  getMessageTemplates,
  filterTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate: removeTemplate,
  copyTemplateToClipboard,
  getTemplatesStats
} = useMessages()

const searchQuery = ref('')
const filterType = ref('')
const filterTag = ref('')
const showNewTemplateModal = ref(false)
const showEditTemplateModal = ref(false)
const editingTemplate = ref<MessageTemplate | null>(null)

const templatesStats = computed(() => getTemplatesStats())

const filteredTemplates = computed(() => {
  return filterTemplates({
    search: searchQuery.value,
    type: filterType.value ? [filterType.value as MessageTemplate['type']] : undefined,
    tags: filterTag.value ? [filterTag.value] : undefined
  })
})

const availableTags = computed(() => {
  const allTags = getMessageTemplates().flatMap(t => t.tags)
  return [...new Set(allTags)].sort()
})

function handleSaveTemplate(templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) {
  if (editingTemplate.value) {
    updateTemplate(editingTemplate.value.id, templateData)
  } else {
    createTemplate(templateData)
  }
  closeTemplateModal()
}

function editTemplate(template: MessageTemplate) {
  editingTemplate.value = template
  showEditTemplateModal.value = true
}

function deleteTemplate(templateId: string) {
  if (confirm('Tem certeza que deseja excluir este modelo?')) {
    removeTemplate(templateId)
  }
}

async function copyTemplate(template: MessageTemplate) {
  const success = await copyTemplateToClipboard(template.id)
  if (success) {
    alert('Modelo copiado para a área de transferência!')
  } else {
    alert('Erro ao copiar modelo')
  }
}

function closeTemplateModal() {
  showNewTemplateModal.value = false
  showEditTemplateModal.value = false
  editingTemplate.value = null
}

function getTypeLabel(type: MessageTemplate['type']): string {
  const labels: Record<MessageTemplate['type'], string> = {
    'whatsapp': 'WhatsApp',
    'email': 'E-mail'
  }
  return labels[type] || type
}

function getTypeBadgeColor(type: MessageTemplate['type']): string {
  const colors: Record<MessageTemplate['type'], string> = {
    'whatsapp': 'bg-green-100 text-green-800',
    'email': 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const tabs = [
  { id: 'company', name: 'Empresa' },
  { id: 'users', name: 'Usuários' },
  { id: 'messages', name: 'Modelos de Mensagens' }
]

// Forms
const companyForm = reactive({
  name: currentCompany.value?.name || '',
  cnpj: currentCompany.value?.cnpj || '',
  timezone: currentCompany.value?.timezone || 'America/Sao_Paulo',
  currency: currentCompany.value?.currency || 'BRL'
})

// Mock users data
const companyUsers = ref([
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'admin' as const,
    companyId: 'company-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'vendedor' as const,
    companyId: 'company-1',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-01')
  }
])

function saveCompanyData() {
  updateCompany(companyForm)
  alert('Dados da empresa atualizados com sucesso!')
}

function resetCompanyForm() {
  companyForm.name = currentCompany.value?.name || ''
  companyForm.cnpj = currentCompany.value?.cnpj || ''
  companyForm.timezone = currentCompany.value?.timezone || 'America/Sao_Paulo'
  companyForm.currency = currentCompany.value?.currency || 'BRL'
}

function handleUserSaved() {
  showNewUserModal.value = false
}

function removeUser(userId: string) {
  if (confirm('Tem certeza que deseja remover este usuário?')) {
    const userIndex = companyUsers.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      companyUsers.value.splice(userIndex, 1)
      alert('Usuário removido com sucesso!')
    }
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}
</script>