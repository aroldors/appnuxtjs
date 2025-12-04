<template>
  <NuxtLayout name="default-layout">
    <div class="space-y-6">
      <!-- Header com filtros e ações -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Modelos de Mensagens</h2>
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
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total de Modelos</p>
              <p class="text-2xl font-bold text-gray-900">{{ templatesStats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">WhatsApp</p>
              <p class="text-2xl font-bold text-gray-900">{{ templatesStats.whatsappTemplates }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">E-mail</p>
              <p class="text-2xl font-bold text-gray-900">{{ templatesStats.emailTemplates }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de modelos -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="grid gap-6">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ template.title }}</h3>
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
                    <p class="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                      {{ template.content }}
                    </p>
                  </div>
                  
                  <p class="text-xs text-gray-500">
                    Criado em {{ formatDate(template.createdAt) }}
                  </p>
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
      </div>

      <!-- Modal Novo/Editar Template -->
      <MessageTemplateModal
        v-if="showNewTemplateModal || showEditTemplateModal"
        :template="editingTemplate"
        @save="handleSaveTemplate"
        @cancel="closeModal"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { MessageTemplate } from '~/shared/types'

definePageMeta({
  layout: false
})

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
  const allTags = getMessageTemplates().flatMap(template => template.tags)
  return [...new Set(allTags)].sort()
})

function handleSaveTemplate(templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) {
  if (editingTemplate.value) {
    updateTemplate(editingTemplate.value.id, templateData)
  } else {
    createTemplate(templateData)
  }
  closeModal()
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

function closeModal() {
  showNewTemplateModal.value = false
  showEditTemplateModal.value = false
  editingTemplate.value = null
}

function getTypeLabel(type: MessageTemplate['type']) {
  const labels = {
    'whatsapp': 'WhatsApp',
    'email': 'E-mail'
  }
  return labels[type] || type
}

function getTypeBadgeColor(type: MessageTemplate['type']) {
  const colors = {
    'whatsapp': 'bg-green-100 text-green-800',
    'email': 'bg-purple-100 text-purple-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}
</script>