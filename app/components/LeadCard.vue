<template>
  <div 
    class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-move select-none"
    :class="isDragging ? 'opacity-50 scale-95 rotate-1' : ''"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-900">{{ lead.name }}</h4>
        <p class="text-xs text-gray-500">{{ lead.company }}</p>
      </div>
      <div class="flex items-center space-x-1">
        <button
          @click="$emit('edit', lead)"
          class="text-gray-400 hover:text-blue-600 transition-colors"
          title="Editar"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="space-y-2 mb-3">
      <div class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ lead.position }}
      </div>
      <div class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {{ lead.email }}
      </div>
      <div class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {{ lead.phone }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-green-600">
        {{ formatCurrency(lead.potentialValue) }}
      </span>
      <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {{ lead.source }}
      </span>
    </div>

    <div v-if="lead.lastContact" class="text-xs text-gray-500">
      Último contato: {{ formatDate(lead.lastContact) }}
    </div>
    <div v-else class="text-xs text-gray-500">
      Criado em: {{ formatDate(lead.createdAt) }}
    </div>

    <div v-if="lead.notes" class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
      {{ lead.notes }}
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Lead } from '~~/shared/types'

interface Props {
  lead: Lead
}

interface Emits {
  (e: 'edit', lead: Lead): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)

function handleDragStart(event: DragEvent) {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify({
      leadId: props.lead.id,
      currentStatus: props.lead.status
    }))
  }
}

function handleDragEnd() {
  isDragging.value = false
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(new Date(date))
}
</script>