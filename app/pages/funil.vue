<template>
  <NuxtLayout name="default-layout">
    <div class="space-y-6">
      <!-- Barra de filtros -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar leads..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
              <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select v-model="filterSource" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="">Todas as fontes</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Website">Website</option>
              <option value="Indicação">Indicação</option>
              <option value="Cold Email">Cold Email</option>
            </select>
          </div>
          
          <button
            @click="showNewLeadModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            + Novo Lead
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
          <!-- Coluna Novo -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Novo</h3>
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {{ getLeadsByStatus('novo').length }}
              </span>
            </div>
            <div class="space-y-3 min-h-[500px]">
              <LeadCard
                v-for="lead in getFilteredLeadsByStatus('novo')"
                :key="lead.id"
                :lead="lead"
                @update="updateLeadStatus"
                @edit="editLead"
              />
            </div>
          </div>

          <!-- Coluna Em Contato -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Em Contato</h3>
              <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                {{ getFilteredLeadsByStatus('em-contato').length }}
              </span>
            </div>
            <div class="space-y-3 min-h-[500px]">
              <LeadCard
                v-for="lead in getFilteredLeadsByStatus('em-contato')"
                :key="lead.id"
                :lead="lead"
                @update="updateLeadStatus"
                @edit="editLead"
              />
            </div>
          </div>

          <!-- Coluna Proposta Enviada -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Proposta Enviada</h3>
              <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {{ getFilteredLeadsByStatus('proposta-enviada').length }}
              </span>
            </div>
            <div class="space-y-3 min-h-[500px]">
              <LeadCard
                v-for="lead in getFilteredLeadsByStatus('proposta-enviada')"
                :key="lead.id"
                :lead="lead"
                @update="updateLeadStatus"
                @edit="editLead"
              />
            </div>
          </div>

          <!-- Coluna Fechado Ganho -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Fechado Ganho</h3>
              <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {{ getFilteredLeadsByStatus('fechado-ganho').length }}
              </span>
            </div>
            <div class="space-y-3 min-h-[500px]">
              <LeadCard
                v-for="lead in getFilteredLeadsByStatus('fechado-ganho')"
                :key="lead.id"
                :lead="lead"
                @update="updateLeadStatus"
                @edit="editLead"
              />
            </div>
          </div>

          <!-- Coluna Fechado Perdido -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-gray-900">Fechado Perdido</h3>
              <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {{ getFilteredLeadsByStatus('fechado-perdido').length }}
              </span>
            </div>
            <div class="space-y-3 min-h-[500px]">
              <LeadCard
                v-for="lead in getFilteredLeadsByStatus('fechado-perdido')"
                :key="lead.id"
                :lead="lead"
                @update="updateLeadStatus"
                @edit="editLead"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Novo Lead -->
      <LeadModal
        v-if="showNewLeadModal"
        :lead="editingLead"
        @save="handleSaveLead"
        @cancel="closeModal"
      />

      <!-- Modal Editar Lead -->
      <LeadModal
        v-if="showEditLeadModal"
        :lead="editingLead"
        @save="handleUpdateLead"
        @cancel="closeModal"
      />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Lead } from '~~/shared/types'

definePageMeta({
  layout: false
})

const { getLeads, getLeadsByStatus, updateLeadStatus, createLead, updateLead, filterLeads } = useLeads()

const searchQuery = ref('')
const filterSource = ref('')
const showNewLeadModal = ref(false)
const showEditLeadModal = ref(false)
const editingLead = ref<Lead | null>(null)

const filteredLeads = computed(() => {
  return filterLeads({
    search: searchQuery.value,
    source: filterSource.value ? [filterSource.value] : undefined
  })
})

function handleSaveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) {
  createLead(leadData)
  closeModal()
}

function handleUpdateLead(leadData: Partial<Lead>) {
  if (editingLead.value) {
    updateLead(editingLead.value.id, leadData)
  }
  closeModal()
}

function editLead(lead: Lead) {
  editingLead.value = lead
  showEditLeadModal.value = true
}

function closeModal() {
  showNewLeadModal.value = false
  showEditLeadModal.value = false
  editingLead.value = null
}

// Override getLeadsByStatus to use filtered results
function getFilteredLeadsByStatus(status: Lead['status']) {
  return filteredLeads.value.filter(lead => lead.status === status)
}
</script>