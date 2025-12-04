<template>
  <NuxtLayout name="default-layout">
    <div class="space-y-6">
      <!-- Header com filtros e ações -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Gerenciar Contatos</h2>
          <div class="flex items-center space-x-3">
            <button
              @click="showImportModal = true"
              class="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Importar
            </button>
            <button
              @click="showNewContactModal = true"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              + Novo Contato
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar contatos..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
            <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select v-model="filterStatus" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="bloqueado">Bloqueado</option>
          </select>
          
          <select v-model="filterSource" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="">Todas as fontes</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Website">Website</option>
            <option value="Indicação">Indicação</option>
            <option value="Importação">Importação</option>
          </select>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total de Contatos</p>
              <p class="text-2xl font-bold text-gray-900">{{ contactsStats.total }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Ativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ contactsStats.active }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Inativos</p>
              <p class="text-2xl font-bold text-gray-900">{{ contactsStats.inactive }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Bloqueados</p>
              <p class="text-2xl font-bold text-gray-900">{{ contactsStats.blocked }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de contatos -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fonte
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="contact in filteredContacts" :key="contact.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ contact.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ contact.name }}</div>
                      <div class="text-sm text-gray-500">{{ contact.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ contact.company }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ contact.position }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ contact.phone }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeColor(contact.status)"
                  >
                    {{ getStatusLabel(contact.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contact.source }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editContact(contact)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    @click="deleteContact(contact.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modais -->
      <ContactModal
        v-if="showNewContactModal || showEditContactModal"
        :contact="editingContact"
        @save="handleSaveContact"
        @cancel="closeModal"
      />
      
      <ImportModal
        v-if="showImportModal"
        @import="handleImportContacts"
        @cancel="showImportModal = false"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Contact } from '~~/shared/types'

definePageMeta({
  layout: false
})

const {
  getContacts,
  filterContacts,
  createContact,
  updateContact,
  deleteContact: removeContact,
  getContactsStats,
  importFromSpreadsheet
} = useContacts()

const searchQuery = ref('')
const filterStatus = ref('')
const filterSource = ref('')
const showNewContactModal = ref(false)
const showEditContactModal = ref(false)
const showImportModal = ref(false)
const editingContact = ref<Contact | null>(null)

const contactsStats = computed(() => getContactsStats())

const filteredContacts = computed(() => {
  return filterContacts({
    search: searchQuery.value,
    status: filterStatus.value ? [filterStatus.value as Contact['status']] : undefined,
    source: filterSource.value ? [filterSource.value] : undefined
  })
})

function handleSaveContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) {
  if (editingContact.value) {
    updateContact(editingContact.value.id, contactData)
  } else {
    createContact(contactData)
  }
  closeModal()
}

function editContact(contact: Contact) {
  editingContact.value = contact
  showEditContactModal.value = true
}

function deleteContact(contactId: string) {
  if (confirm('Tem certeza que deseja excluir este contato?')) {
    removeContact(contactId)
  }
}

function closeModal() {
  showNewContactModal.value = false
  showEditContactModal.value = false
  editingContact.value = null
}

async function handleImportContacts(data: any[]) {
  try {
    const imported = await importFromSpreadsheet(data)
    alert(`${imported} contatos importados com sucesso!`)
    showImportModal.value = false
  } catch (error) {
    alert('Erro ao importar contatos')
  }
}

function getStatusLabel(status: Contact['status']): string {
  const labels: Record<Contact['status'], string> = {
    'ativo': 'Ativo',
    'inativo': 'Inativo',
    'bloqueado': 'Bloqueado'
  }
  return labels[status] || status
}

function getStatusBadgeColor(status: Contact['status']): string {
  const colors: Record<Contact['status'], string> = {
    'ativo': 'bg-green-100 text-green-800',
    'inativo': 'bg-yellow-100 text-yellow-800',
    'bloqueado': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
</script>