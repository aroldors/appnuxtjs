<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Contatos</h1>
      <span class="text-sm text-gray-500">Gerencie seus contatos</span>
    </div>

    <!-- Filtro e acao -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nome, e-mail ou empresa..."
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
          + Novo Contato
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="contacts"
      :loading="loading"
      empty-message="Nenhum contato encontrado."
      :paginator="true"
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @edit="onEdit"
      @delete="onDelete"
      @view="onView"
      @page-change="onPageChange"
    >
      <template #nome="{ row }">
        <div class="text-sm font-medium text-gray-900">{{ (row as any).nome }}</div>
        <div class="text-sm text-gray-500">{{ (row as any).email }}</div>
      </template>

      <template #empresa="{ row }">
        <div class="text-sm text-gray-900">
          {{ (row as any).empresa || '—' }}
        </div>
      </template>

      <template #status="{ row }">
        <span
          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
          :class="statusBadgeColor((row as any).status)"
        >
          {{ statusLabel((row as any).status) }}
        </span>
      </template>
    </BaseDataGrid>

    <ContactViewModal
      :open="showViewModal"
      :contato="(selectedViewContact as any)"
      @close="showViewModal = false"
    />

    <ContactModal
      :open="showModal"
      :is-edition="isEdition"
      :contact-id="selectedContactId ?? undefined"
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
import ContactModal from '../components/ContactModal.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import ContactViewModal from '../components/ContactViewModal.vue'
import { useContacts } from '../composables/useContacts'
import type { Database } from '../types/database'

type VwContatosContasRow = Database['public']['Views']['vw_contatos_contas']['Row']

definePageMeta({ layout: 'default' })

const { contacts, loading, currentPage, totalItems, pageSize, searchQuery, refreshContacts, deleteContact } = useContacts()
const toast = useToast()

const showModal = ref(false)
const isEdition = ref(false)
const selectedContactId = ref<number | null>(null)

const showViewModal = ref(false)
const selectedViewContact = ref<VwContatosContasRow | null>(null)

const showConfirmModal = ref(false)
const confirmMessage = ref('')
const deleteLoading = ref(false)
const pendingDeleteId = ref<number | null>(null)

watch(searchQuery, () => { currentPage.value = 1 })

const columns: GridColumn[] = [
  { key: 'nome',     label: 'Nome' },
  { key: 'empresa',  label: 'Empresa' },
  { key: 'cargo',    label: 'Cargo' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'status',   label: 'Status' },
]

function openNew() {
  isEdition.value = false
  selectedContactId.value = null
  showModal.value = true
}

function onView(row: unknown) {
  selectedViewContact.value = row as VwContatosContasRow
  showViewModal.value = true
}

function onEdit(row: unknown) {
  const c = row as { id: number }
  isEdition.value = true
  selectedContactId.value = c.id
  showModal.value = true
}

function onDelete(row: unknown) {
  const c = row as { id: number; nome?: string }
  const nome = c.nome || String(c.id)
  pendingDeleteId.value = c.id
  confirmMessage.value = `Deseja realmente excluir o contato "${nome}"? Esta acao nao pode ser desfeita.`
  showConfirmModal.value = true
}

async function handleDeleteConfirm() {
  if (pendingDeleteId.value === null) return
  deleteLoading.value = true
  const success = await deleteContact(pendingDeleteId.value)
  deleteLoading.value = false
  showConfirmModal.value = false
  pendingDeleteId.value = null
  if (success) {
    toast.success('Contato excluido com sucesso!')
    refreshContacts()
  } else {
    toast.error('Erro ao excluir o contato. Tente novamente.')
  }
}

function handleModalClose() {
  showModal.value = false
  isEdition.value = false
  selectedContactId.value = null
}

function handleSaved() {
  handleModalClose()
  refreshContacts()
}

function onPageChange(page: number) {
  currentPage.value = page
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    bloqueado: 'Bloqueado'
  }
  return map[status] ?? status
}

function statusBadgeColor(status: string): string {
  const map: Record<string, string> = {
    ativo: 'bg-green-100 text-green-800',
    inativo: 'bg-yellow-100 text-yellow-800',
    bloqueado: 'bg-red-100 text-red-800'
  }
  return map[status] ?? 'bg-gray-100 text-gray-800'
}
</script>
