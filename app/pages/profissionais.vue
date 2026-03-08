<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Profissionais</h1>
      <span class="text-sm text-gray-500">Visualize os profissionais cadastrados</span>
    </div>

    <!-- Filtro -->
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
      @view="onView"
      @page-change="onPageChange"
    />

    <ProfissionalViewModal
      :open="showViewModal"
      :profissional="viewProfissional"
      @close="showViewModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from '#imports'
import BaseDataGrid from '../components/BaseDataGrid.vue'
import type { GridColumn } from '../components/BaseDataGrid.vue'
import ProfissionalViewModal from '../components/ProfissionalViewModal.vue'
import { useProfissionais } from '../composables/useProfissionais'

const { profissionais, loading, currentPage, totalItems, pageSize, searchQuery, fetchProfissionalById } = useProfissionais()

const showViewModal = ref(false)
const viewProfissional = ref<Awaited<ReturnType<typeof fetchProfissionalById>>>(null)

watch(searchQuery, () => {
  currentPage.value = 1
})

const columns: GridColumn[] = [
  { key: 'nome',           label: 'Nome' },
  { key: 'identificacao',  label: 'Identificação' },
  { key: 'especialidade',  label: 'Especialidade' },
]

async function onView(row: unknown) {
  const r = row as { id: number }
  viewProfissional.value = await fetchProfissionalById(r.id)
  showViewModal.value = true
}

function onPageChange(page: number) {
  currentPage.value = page
}
</script>
