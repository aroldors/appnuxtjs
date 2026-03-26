<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <UserGroupIcon class="h-12 w-12 text-gray-700" />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Profissionais</h1>
        <span class="text-sm text-gray-500">Gerencie os profissionais cadastrados</span>
      </div>
    </div>

    <!-- Filtro e ação -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome, identificação ou especialidade..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          @click="openNew"
        >
          + Novo Profissional
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="profissionais"
      :loading="loading"
      empty-message="Nenhum profissional encontrado."
      :paginator="true"
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @page-change="onPageChange"
    />

    <ProfissionalViewModal
      :open="showViewModal"
      :profissional="viewProfissional"
      @close="showViewModal = false"
    />

    <ProfissionalModal
      :open="showModal"
      :is-edition="isEdition"
      :profissional-id="selectedProfissionalId ?? undefined"
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
import ProfissionalViewModal from '../components/ProfissionalViewModal.vue'
import ProfissionalModal from '../components/ProfissionalModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useProfissionais } from '../composables/useProfissionais'
import { UserGroupIcon } from '@heroicons/vue/24/outline'

const { profissionais, loading, currentPage, totalItems, pageSize, searchQuery, refreshProfissionais, fetchProfissionalById, deleteProfissional } = useProfissionais()
const toast = useToast()

const showModal = ref(false)
const isEdition = ref(false)
const selectedProfissionalId = ref<number | null>(null)

const showViewModal = ref(false)
const viewProfissional = ref<Awaited<ReturnType<typeof fetchProfissionalById>>>(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')
const deleteLoading = ref(false)
const pendingDeleteId = ref<number | null>(null)

watch(searchQuery, () => {
  currentPage.value = 1
})

const columns: GridColumn[] = [
  { key: 'nome',          label: 'Nome' },
  { key: 'identificacao', label: 'Identificação' },
  { key: 'especialidade', label: 'Especialidade' },
]

function openNew() {
  isEdition.value = false
  selectedProfissionalId.value = null
  showModal.value = true
}

async function onView(row: unknown) {
  const r = row as { id: number }
  viewProfissional.value = await fetchProfissionalById(r.id)
  showViewModal.value = true
}

function onEdit(row: unknown) {
  const r = row as { id: number }
  isEdition.value = true
  selectedProfissionalId.value = r.id
  showModal.value = true
}

function handleModalClose() {
  showModal.value = false
  isEdition.value = false
  selectedProfissionalId.value = null
}

function handleSaved() {
  handleModalClose()
  refreshProfissionais()
}

function onDelete(row: unknown) {
  const r = row as { id: number; nome?: string }
  const nome = r.nome ?? `ID ${r.id}`
  pendingDeleteId.value = r.id
  confirmMessage.value = `Deseja realmente excluir o profissional <strong>${nome}</strong>?<br>Esta ação não pode ser desfeita.`
  showConfirmModal.value = true
}

async function handleDeleteConfirm() {
  if (pendingDeleteId.value === null) return
  deleteLoading.value = true
  const success = await deleteProfissional(pendingDeleteId.value)
  deleteLoading.value = false
  showConfirmModal.value = false
  pendingDeleteId.value = null
  if (success) {
    toast.success('Profissional excluído com sucesso!')
    refreshProfissionais()
  } else {
    toast.error('Erro ao excluir o profissional. Tente novamente.')
  }
}

function onPageChange(page: number) {
  currentPage.value = page
}
</script>
