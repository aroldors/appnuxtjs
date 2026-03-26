<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <BriefcaseIcon class="h-12 w-12 text-gray-700" />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Oportunidades</h1>
        <span class="text-sm text-gray-500">Gerencie o andamento das oportunidades</span>
      </div>
    </div>
    
    <!-- Barra de filtros -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div class="relative max-w-sm w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar oportunidades..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
          <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button
          @click="showNewModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          + Nova Oportunidade
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
              {{ getFilteredByStatus('novo').length }}
            </span>
          </div>
          <div
            class="space-y-3 min-h-[500px] rounded-lg p-1 transition-colors"
            :class="dragOverStatus === 'novo' ? 'bg-blue-50 ring-2 ring-inset ring-blue-300' : ''"
            @dragenter.prevent="dragOverStatus = 'novo'"
            @dragover.prevent
            @dragleave="handleDragLeave($event, 'novo')"
            @drop.prevent="handleDrop($event, 'novo')"
          >
            <OportunidadeCard
              v-for="item in getFilteredByStatus('novo')"
              :key="item.id"
              :oportunidade="item"
              @edit="editOportunidade"
            />
          </div>
        </div>

        <!-- Coluna Em Contato -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Em Contato</h3>
            <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              {{ getFilteredByStatus('em-contato').length }}
            </span>
          </div>
          <div
            class="space-y-3 min-h-[500px] rounded-lg p-1 transition-colors"
            :class="dragOverStatus === 'em-contato' ? 'bg-yellow-50 ring-2 ring-inset ring-yellow-300' : ''"
            @dragenter.prevent="dragOverStatus = 'em-contato'"
            @dragover.prevent
            @dragleave="handleDragLeave($event, 'em-contato')"
            @drop.prevent="handleDrop($event, 'em-contato')"
          >
            <OportunidadeCard
              v-for="item in getFilteredByStatus('em-contato')"
              :key="item.id"
              :oportunidade="item"
              @edit="editOportunidade"
            />
          </div>
        </div>

        <!-- Coluna Proposta Enviada -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Proposta Enviada</h3>
            <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {{ getFilteredByStatus('proposta-enviada').length }}
            </span>
          </div>
          <div
            class="space-y-3 min-h-[500px] rounded-lg p-1 transition-colors"
            :class="dragOverStatus === 'proposta-enviada' ? 'bg-purple-50 ring-2 ring-inset ring-purple-300' : ''"
            @dragenter.prevent="dragOverStatus = 'proposta-enviada'"
            @dragover.prevent
            @dragleave="handleDragLeave($event, 'proposta-enviada')"
            @drop.prevent="handleDrop($event, 'proposta-enviada')"
          >
            <OportunidadeCard
              v-for="item in getFilteredByStatus('proposta-enviada')"
              :key="item.id"
              :oportunidade="item"
              @edit="editOportunidade"
            />
          </div>
        </div>

        <!-- Coluna Fechado Ganho -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Fechado Ganho</h3>
            <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {{ getFilteredByStatus('fechado-ganho').length }}
            </span>
          </div>
          <div
            class="space-y-3 min-h-[500px] rounded-lg p-1 transition-colors"
            :class="dragOverStatus === 'fechado-ganho' ? 'bg-green-50 ring-2 ring-inset ring-green-300' : ''"
            @dragenter.prevent="dragOverStatus = 'fechado-ganho'"
            @dragover.prevent
            @dragleave="handleDragLeave($event, 'fechado-ganho')"
            @drop.prevent="handleDrop($event, 'fechado-ganho')"
          >
            <OportunidadeCard
              v-for="item in getFilteredByStatus('fechado-ganho')"
              :key="item.id"
              :oportunidade="item"
              @edit="editOportunidade"
            />
          </div>
        </div>

        <!-- Coluna Fechado Perdido -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Fechado Perdido</h3>
            <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {{ getFilteredByStatus('fechado-perdido').length }}
            </span>
          </div>
          <div
            class="space-y-3 min-h-[500px] rounded-lg p-1 transition-colors"
            :class="dragOverStatus === 'fechado-perdido' ? 'bg-red-50 ring-2 ring-inset ring-red-300' : ''"
            @dragenter.prevent="dragOverStatus = 'fechado-perdido'"
            @dragover.prevent
            @dragleave="handleDragLeave($event, 'fechado-perdido')"
            @drop.prevent="handleDrop($event, 'fechado-perdido')"
          >
            <OportunidadeCard
              v-for="item in getFilteredByStatus('fechado-perdido')"
              :key="item.id"
              :oportunidade="item"
              @edit="editOportunidade"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nova Oportunidade -->
    <OportunidadeModal
      v-if="showNewModal"
      @save="handleSave"
      @cancel="closeModal"
    />

    <!-- Modal Editar Oportunidade -->
    <OportunidadeModal
      v-if="showEditModal"
      :oportunidade="editingOportunidade"
      @save="handleUpdate"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import type { Oportunidade } from '~~/shared/types'
import { BriefcaseIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default'
})

const { fetchOportunidades, updateOportunidadeStatus, createOportunidade, updateOportunidade, filterOportunidades } = useOportunidades()

onMounted(() => fetchOportunidades())

const searchQuery = ref('')
const showNewModal = ref(false)
const showEditModal = ref(false)
const editingOportunidade = ref<Oportunidade | null>(null)

const filteredOportunidades = computed(() => {
  return filterOportunidades({
    search: searchQuery.value
  })
})

function getFilteredByStatus(status: Oportunidade['status']) {
  return filteredOportunidades.value.filter(o => o.status === status)
}

async function handleSave(data: Omit<Oportunidade, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) {
  await createOportunidade(data)
  closeModal()
}

async function handleUpdate(data: Partial<Oportunidade>) {
  if (editingOportunidade.value) {
    await updateOportunidade(editingOportunidade.value.id, data)
  }
  closeModal()
}

function editOportunidade(oportunidade: Oportunidade) {
  editingOportunidade.value = oportunidade
  showEditModal.value = true
}

function closeModal() {
  showNewModal.value = false
  showEditModal.value = false
  editingOportunidade.value = null
}

// --- Drag & Drop ---
const dragOverStatus = ref<Oportunidade['status'] | null>(null)

function handleDrop(event: DragEvent, targetStatus: Oportunidade['status']) {
  dragOverStatus.value = null
  if (!event.dataTransfer) return
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json')) as {
      oportunidadeId: string
      currentStatus: Oportunidade['status']
    }
    if (data.oportunidadeId && data.currentStatus !== targetStatus) {
      updateOportunidadeStatus(data.oportunidadeId, targetStatus)
    }
  } catch (e) {
    console.error('[oportunidades] Erro ao processar drop:', e)
  }
}

function handleDragLeave(event: DragEvent, status: Oportunidade['status']) {
  const relatedTarget = event.relatedTarget as Element | null
  const currentTarget = event.currentTarget as Element
  if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
    if (dragOverStatus.value === status) {
      dragOverStatus.value = null
    }
  }
}
</script>
