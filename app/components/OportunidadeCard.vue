<template>
  <div
    id="oportunidade-card"
    class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-move select-none"
    :class="isDragging ? 'opacity-50 scale-95 rotate-1' : ''"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-900">{{ oportunidade.name }}</h4>
        <p v-if="oportunidade.position" class="text-xs text-gray-500">{{ oportunidade.position }}</p>
      </div>
      <div class="flex items-center space-x-1">
        <button
          @click="$emit('edit', oportunidade)"
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
      <div v-if="oportunidade.email" class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {{ oportunidade.email }}
      </div>
      <div v-if="oportunidade.phone" class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {{ oportunidade.phone }}
      </div>
      <div v-if="oportunidade.city" class="flex items-center text-xs text-gray-600">
        <svg class="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ oportunidade.city }}{{ oportunidade.state ? ` - ${oportunidade.state}` : '' }}
      </div>
    </div>

    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-green-600">
        {{ formatCurrency(oportunidade.opportunityValue) }}
      </span>
      <span v-if="oportunidade.source" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {{ oportunidade.source }}
      </span>
    </div>

    <div class="text-xs text-gray-500">
      Criado em: {{ formatDate(oportunidade.createdAt) }}
    </div>

    <div v-if="oportunidade.notes" class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
      {{ oportunidade.notes }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Oportunidade } from '~~/shared/types'

interface Props {
  oportunidade: Oportunidade
}

interface Emits {
  (e: 'edit', oportunidade: Oportunidade): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isDragging = ref(false)

function handleDragStart(event: DragEvent) {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/json', JSON.stringify({
      oportunidadeId: props.oportunidade.id,
      currentStatus: props.oportunidade.status
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
