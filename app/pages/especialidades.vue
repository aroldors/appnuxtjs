<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Especialidades</h1>
      <span class="text-sm text-gray-500">Gerencie as especialidades</span>
    </div>

    <!-- Filtro e acao -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por descrição..."
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
          + Nova Especialidade
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="especialidades"
      :loading="loading"
      empty-message="Nenhuma especialidade encontrada."
      :paginator="true"
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @page-change="onPageChange"
    />

    <EspecialidadeViewModal
      :open="showViewModal"
      :especialidade="selectedViewEspecialidade"
      @close="showViewModal = false"
    />

    <EspecialidadesModal
      :open="showModal"
      :is-edition="isEdition"
      :especialidade-id="selectedId ?? undefined"
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
import EspecialidadesModal from '../components/EspecialidadesModal.vue'
import EspecialidadeViewModal from '../components/EspecialidadeViewModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useEspecialidades } from '../composables/useEspecialidades'

definePageMeta({ layout: 'default' })

const { especialidades, loading, currentPage, totalItems, pageSize, searchQuery, refreshEspecialidades, deleteEspecialidade, fetchEspecialidadeById } = useEspecialidades()
const toast = useToast()

const showModal = ref(false)
const isEdition = ref(false)
const selectedId = ref<number | null>(null)

const showViewModal = ref(false)
const selectedViewEspecialidade = ref<Awaited<ReturnType<typeof fetchEspecialidadeById>>>(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')
const deleteLoading = ref(false)
const pendingDeleteId = ref<number | null>(null)

watch(searchQuery, () => { currentPage.value = 1 })

const columns: GridColumn[] = [
  { key: 'id',        label: 'ID', width: '100px' },
  { key: 'descricao', label: 'Descrição' },
]

async function onView(row: unknown) {
  const r = row as { id: number }
  selectedViewEspecialidade.value = await fetchEspecialidadeById(r.id)
  showViewModal.value = true
}

function openNew() {
  isEdition.value = false
  selectedId.value = null
  showModal.value = true
}

function onEdit(row: unknown) {
  const r = row as { id: number }
  isEdition.value = true
  selectedId.value = r.id
  showModal.value = true
}

function onDelete(row: unknown) {
  const r = row as { id: number; descricao?: string }
  const descricao = r.descricao || String(r.id)
  pendingDeleteId.value = r.id
  confirmMessage.value = `Deseja realmente excluir a especialidade "${descricao}"? Esta ação não pode ser desfeita.`
  showConfirmModal.value = true
}

async function handleDeleteConfirm() {
  if (pendingDeleteId.value === null) return
  deleteLoading.value = true
  const success = await deleteEspecialidade(pendingDeleteId.value)
  deleteLoading.value = false
  showConfirmModal.value = false
  pendingDeleteId.value = null
  if (success) {
    toast.success('Especialidade excluída com sucesso!')
    refreshEspecialidades()
  } else {
    toast.error('Erro ao excluir a especialidade. Tente novamente.')
  }
}

function handleModalClose() {
  showModal.value = false
  isEdition.value = false
  selectedId.value = null
}

function handleSaved() {
  handleModalClose()
  refreshEspecialidades()
}

function onPageChange(page: number) {
  currentPage.value = page
}
</script>
