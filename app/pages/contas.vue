<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Contas</h1>
      <span class="text-sm text-gray-500">Gerencie suas contas</span>
    </div>

    <!-- Filtro e ação -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome ou razão social..."
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
          + Nova Conta
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="contas"
      :loading="loading"
      empty-message="Nenhuma conta encontrada."
      :paginator="true"
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @page-change="onPageChange"
    >
      <template #nome_fantasia="{ row }">
        <div class="text-sm font-medium text-gray-900">{{ (row as any).nome_fantasia }}</div>
        <div class="text-sm text-gray-500">{{ (row as any).email }}</div>
      </template>
    </BaseDataGrid>

  <ContaViewModal
    :open="showViewModal"
    :conta="viewConta"
    @close="showViewModal = false"
  />

  <ContasModal
    :open="showModal"
    :is-edition="isEdition"
    :conta-id="selectedContaId ?? undefined"
    @close="handleModalClose"
    @saved="handleSaved"
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
import { ref, watch } from '#imports'
import { useToast } from 'vue-toastification'
import BaseDataGrid from '../components/BaseDataGrid.vue'
import type { GridColumn } from '../components/BaseDataGrid.vue'
import ContasModal from '../components/ContasModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import ContaViewModal from '../components/ContaViewModal.vue'
import { useContas } from '../composables/useContas'

const { contas, loading, currentPage, totalItems, pageSize, searchQuery, refreshContas, deleteConta, fetchContaById } = useContas()
const toast = useToast()

const showModal = ref(false)
const isEdition = ref(false)
const selectedContaId = ref<number | null>(null)

const showViewModal = ref(false)
const viewConta = ref<Awaited<ReturnType<typeof fetchContaById>>>(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')
const deleteLoading = ref(false)
const pendingDeleteId = ref<number | null>(null)

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

const columns: GridColumn[] = [
  { key: 'nome_fantasia', label: 'Nome' },
  { key: 'razao_social',  label: 'Razão Social' },
  { key: 'fone_celular',  label: 'Telefone' },
]

function openNew () {
  isEdition.value = false
  selectedContaId.value = null
  showModal.value = true
}

async function onView (row: unknown) {
  const r = row as { id: number }
  viewConta.value = await fetchContaById(r.id)
  showViewModal.value = true
}

function onEdit (row: unknown) {
  const conta = row as { id: number }
  isEdition.value = true
  selectedContaId.value = conta.id
  showModal.value = true
}

function onDelete (row: unknown) {
  const conta = row as { id: number; nome_fantasia?: string; razao_social?: string }
  const nome = conta.nome_fantasia || conta.razao_social || `ID ${conta.id}`
  pendingDeleteId.value = conta.id
  confirmMessage.value = `Deseja realmente excluir a conta "${nome}"? Esta ação não pode ser desfeita.`
  showConfirmModal.value = true
}

async function handleDeleteConfirm () {
  if (pendingDeleteId.value === null) return
  deleteLoading.value = true
  const success = await deleteConta(pendingDeleteId.value)
  deleteLoading.value = false
  showConfirmModal.value = false
  pendingDeleteId.value = null
  if (success) {
    toast.success('Conta excluída com sucesso!')
    refreshContas()
  } else {
    toast.error('Erro ao excluir a conta. Tente novamente.')
  }
}

function handleModalClose () {
  showModal.value = false
  isEdition.value = false
  selectedContaId.value = null
}

function handleSaved () {
  handleModalClose()
  refreshContas()
}

function onPageChange(page: number) {
  currentPage.value = page
}
</script>
