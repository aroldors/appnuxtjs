<template>
  <div class="space-y-4">
    <div class="bg-transparent px-0 pb-2">
      <div class="mb-4">
        <h1 class="text-2xl font-bold text-gray-900">Contas</h1>
        <span class="text-sm text-gray-500">Gerencie suas contas</span>
      </div>
    </div>

    <BaseDataGrid
      :columns="columns"
      :rows="contas"
      :loading="loading"
      empty-message="Nenhuma conta encontrada."
      @edit="onEdit"
      @delete="onDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from '#imports'
import BaseDataGrid from '../components/BaseDataGrid.vue'
import type { GridColumn } from '../components/BaseDataGrid.vue'
import { useContas } from '../composables/useContas'

const { contas, loading, fetchContas } = useContas()

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

onMounted(() => {
  fetchContas()
})
</script>
