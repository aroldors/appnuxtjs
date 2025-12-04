<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="lead-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ lead ? 'Editar Lead' : 'Novo Lead' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <input
              v-model="form.company"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              v-model="form.phone"
              type="tel"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Empresa *
            </label>
            <input
              v-model="form.company"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Cargo *
            </label>
            <input
              v-model="form.position"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="novo">Novo</option>
              <option value="em-contato">Em Contato</option>
              <option value="proposta-enviada">Proposta Enviada</option>
              <option value="fechado-ganho">Fechado Ganho</option>
              <option value="fechado-perdido">Fechado Perdido</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Valor Potencial *
            </label>
            <input
              v-model.number="form.potentialValue"
              type="number"
              required
              min="0"
              step="0.01"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fonte
            </label>
            <select
              v-model="form.source"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Website">Website</option>
              <option value="Indicação">Indicação</option>
              <option value="Cold Email">Cold Email</option>
              <option value="Evento">Evento</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('cancel')"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {{ lead ? 'Atualizar' : 'Criar' }} Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Lead } from '~~/shared/types'

interface Props {
  lead?: Lead | null
}

interface Emits {
  (e: 'save', data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { currentUser } = useAuth()

const form = reactive({
  name: props.lead?.name || '',
  company: props.lead?.company || '',
  email: props.lead?.email || '',
  phone: props.lead?.phone || '',
  position: props.lead?.position || '',
  status: props.lead?.status || 'novo' as Lead['status'],
  potentialValue: props.lead?.potentialValue || 0,
  source: props.lead?.source || 'LinkedIn',
  notes: props.lead?.notes || '',
  assignedUserId: props.lead?.assignedUserId || currentUser.value?.id || '1',
  lastContact: props.lead?.lastContact
})

function handleSubmit() {
  emit('save', { ...form })
}
</script>