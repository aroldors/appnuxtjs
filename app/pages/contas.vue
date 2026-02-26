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
          @click="showNewContaModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          + Nova Conta
        </button>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="filteredContas"
      :loading="loading"
      empty-message="Nenhuma conta encontrada."
      :paginator="true"
      :current-page="currentPage"
      :total-items="totalItems"
      :page-size="pageSize"
      @edit="onEdit"
      @delete="onDelete"
      @page-change="onPageChange"
    >
      <template #nome_fantasia="{ row }">
        <div class="text-sm font-medium text-gray-900">{{ (row as any).nome_fantasia }}</div>
        <div class="text-sm text-gray-500">{{ (row as any).email }}</div>
      </template>
    </BaseDataGrid>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import BaseDataGrid from '../components/BaseDataGrid.vue'
import type { GridColumn } from '../components/BaseDataGrid.vue'
import { useContas } from '../composables/useContas'

const { contas, loading, currentPage, totalItems, pageSize, fetchContas } = useContas()

const searchQuery = ref('')
const showNewContaModal = ref(false)

const filteredContas = computed(() => {
  if (!searchQuery.value.trim()) return contas.value
  const term = searchQuery.value.toLowerCase()
  return contas.value.filter(conta =>
    (conta.nome_fantasia ?? '').toLowerCase().includes(term) ||
    (conta.razao_social ?? '').toLowerCase().includes(term)
  )
})

const columns: GridColumn[] = [
  { key: 'nome_fantasia', label: 'Nome' },
  { key: 'razao_social',  label: 'Razão Social' },
  { key: 'fone_celular',  label: 'Telefone' },
]

function onEdit(row: unknown) {
  console.log('[contas] editar:', row)
}

function onDelete(row: unknown) {
  console.log('[contas] deletar:', row)
}

function onPageChange(page: number) {
  fetchContas(page)
}

onMounted(() => {
  fetchContas()
})
</script>
