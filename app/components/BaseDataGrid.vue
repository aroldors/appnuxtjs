<template>
  <div id="base-data-grid" class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <svg class="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span class="ml-2 text-sm text-gray-500">Carregando...</span>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
            <th v-if="showActions" class="py-3 pr-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- Empty state -->
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="px-6 py-12 text-center text-sm text-gray-400">
              {{ emptyMessage }}
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            >
              <!-- Custom slot por coluna -->
              <slot :name="col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] ?? '—' }}
              </slot>
            </td>

            <!-- Ações -->
            <td v-if="showActions" class="py-4 pr-4 whitespace-nowrap text-sm w-32">
              <div class="flex items-center justify-center space-x-1">
                <slot name="actions" :row="row">
                  <button
                    @click="$emit('view', row)"
                    class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('edit', row)"
                    class="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="$emit('delete', row)"
                    class="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginator -->
    <div
      v-if="paginator && totalItems > 0"
      class="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50"
    >
      <!-- Info -->
      <span class="text-sm text-gray-500">
        Exibindo
        <span class="font-medium text-gray-700">{{ rangeStart }}</span>
        –
        <span class="font-medium text-gray-700">{{ rangeEnd }}</span>
        de
        <span class="font-medium text-gray-700">{{ totalItems }}</span>
        registros
      </span>

      <!-- Controles -->
      <div class="flex items-center space-x-1">
        <!-- Primeira página -->
        <button
          :disabled="currentPage === 1"
          @click="onPageChange(1)"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Primeira página"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Página anterior -->
        <button
          :disabled="currentPage === 1"
          @click="onPageChange(currentPage - 1)"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Números de página -->
        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === '...'" class="px-2 text-gray-400 text-sm select-none">…</span>
          <button
            v-else
            @click="onPageChange(page as number)"
            :class="[
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <!-- Próxima página -->
        <button
          :disabled="currentPage === totalPages"
          @click="onPageChange(currentPage + 1)"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Próxima página"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Última página -->
        <button
          :disabled="currentPage === totalPages"
          @click="onPageChange(totalPages)"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M6 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from 'vue'

export interface GridColumn {
  key: string
  label: string
}

interface Props {
  columns: GridColumn[]
  rows: T[]
  loading?: boolean
  showActions?: boolean
  emptyMessage?: string
  /** Habilita o paginador */
  paginator?: boolean
  /** Página atual (1-based) */
  currentPage?: number
  /** Total de itens no servidor/banco */
  totalItems?: number
  /** Quantidade de itens por página */
  pageSize?: number
}

interface Emits {
  (e: 'view', row: T): void
  (e: 'edit', row: T): void
  (e: 'delete', row: T): void
  (e: 'page-change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: true,
  emptyMessage: 'Nenhum registro encontrado.',
  paginator: false,
  currentPage: 1,
  totalItems: 0,
  pageSize: 10
})

const emit = defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const rangeStart = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const rangeEnd = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

/** Gera array de páginas visíveis com reticências quando necessário */
const visiblePages = computed<(number | '...')[]>(() => {
  const total = totalPages.value
  const current = props.currentPage
  const delta = 1

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | '...')[] = []
  const left = Math.max(2, current - delta)
  const right = Math.min(total - 1, current + delta)

  pages.push(1)
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)

  return pages
})

function onPageChange(page: number): void {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('page-change', page)
}
</script>
