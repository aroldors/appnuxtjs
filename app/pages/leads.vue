<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <FunnelIcon class="h-12 w-12 text-gray-700" />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Leads</h1>
        <span class="text-sm text-gray-500">Gerencie seus leads</span>
      </div>
    </div>

    <!-- Filtro e ação -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          @click="openNew"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Novo Lead
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="filteredLeads as any"
      :loading="loading"
      empty-message="Nenhum lead encontrado."
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
    >
      <template #name="{ row }">
        <div class="text-sm font-medium text-gray-900">{{ (row as any).name }}</div>
        <div class="text-sm text-gray-500">{{ (row as any).email }}</div>
      </template>
      <template #status="{ row }">
        <span :class="getStatusClass((row as any).status)" class="px-2 py-1 rounded-full text-xs font-medium">
          {{ getStatusLabel((row as any).status) }}
        </span>
      </template>
      <template #potentialValue="{ row }">
        <span class="text-sm text-gray-700">{{ formatCurrency((row as any).potentialValue) }}</span>
      </template>
    </BaseDataGrid>

    <LeadViewModal
      :open="showViewModal"
      :lead="viewLead"
      @close="showViewModal = false"
    />

    <LeadModal
      v-if="showModal"
      :lead="selectedLead"
      @save="handleSave"
      @cancel="handleModalClose"
    />

    <ConfirmModal
      :open="showConfirmModal"
      :message="confirmMessage"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import { useToast } from 'vue-toastification'
import BaseDataGrid from '../components/BaseDataGrid.vue'
import type { GridColumn } from '../components/BaseDataGrid.vue'
import LeadModal from '../components/LeadModal.vue'
import LeadViewModal from '../components/LeadViewModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useLeads } from '../composables/useLeads'
import { FunnelIcon } from '@heroicons/vue/24/outline'
import type { Lead } from '~~/shared/types'

const { loading, fetchLeads, createLead, updateLead, deleteLead, filterLeads } = useLeads()
const toast = useToast()

const searchQuery = ref('')
const showModal = ref(false)
const isEdition = ref(false)
const selectedLead = ref<Lead | null>(null)

const showViewModal = ref(false)
const viewLead = ref<Lead | null>(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')
const deleteLoading = ref(false)
const pendingDeleteId = ref<string | null>(null)

onMounted(() => {
  fetchLeads()
})

const filteredLeads = computed(() =>
  filterLeads({ search: searchQuery.value || undefined })
)

const columns: GridColumn[] = [
  { key: 'name', label: 'Nome' },
  { key: 'phone', label: 'Telefone' },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Fonte' },
  { key: 'potentialValue', label: 'Valor' },
]

function openNew() {
  isEdition.value = false
  selectedLead.value = null
  showModal.value = true
}

function onView(row: unknown) {
  viewLead.value = row as Lead
  showViewModal.value = true
}

function onEdit(row: unknown) {
  selectedLead.value = row as Lead
  isEdition.value = true
  showModal.value = true
}

function onDelete(row: unknown) {
  const lead = row as Lead
  const nome = lead.name || `ID ${lead.id}`
  pendingDeleteId.value = lead.id
  confirmMessage.value = `Deseja realmente excluir o lead "${nome}"? Esta ação não pode ser desfeita.`
  showConfirmModal.value = true
}

async function handleSave(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) {
  if (isEdition.value && selectedLead.value) {
    await updateLead(selectedLead.value.id, data)
    toast.success('Lead atualizado com sucesso!')
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { assignedUserId, ...createData } = data
    const result = await createLead(createData)
    if (result) {
      toast.success('Lead criado com sucesso!')
    } else {
      toast.error('Erro ao criar o lead. Tente novamente.')
      return
    }
  }
  handleModalClose()
}

async function handleDeleteConfirm() {
  if (pendingDeleteId.value === null) return
  deleteLoading.value = true
  await deleteLead(pendingDeleteId.value)
  deleteLoading.value = false
  showConfirmModal.value = false
  pendingDeleteId.value = null
  toast.success('Lead excluído com sucesso!')
}

function handleModalClose() {
  showModal.value = false
  isEdition.value = false
  selectedLead.value = null
}

const statusMap: Record<Lead['status'], { label: string; classes: string }> = {
  'novo': { label: 'Novo', classes: 'bg-blue-100 text-blue-700' },
  'em-contato': { label: 'Em Contato', classes: 'bg-yellow-100 text-yellow-700' },
  'proposta-enviada': { label: 'Proposta Enviada', classes: 'bg-purple-100 text-purple-700' },
  'fechado-ganho': { label: 'Fechado Ganho', classes: 'bg-green-100 text-green-700' },
  'fechado-perdido': { label: 'Fechado Perdido', classes: 'bg-red-100 text-red-700' },
}

function getStatusLabel(status: Lead['status']): string {
  return statusMap[status]?.label ?? status
}

function getStatusClass(status: Lead['status']): string {
  return statusMap[status]?.classes ?? ''
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0)
}
</script>
