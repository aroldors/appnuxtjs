<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="contact-modal">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ contact ? 'Editar Contato' : 'Novo Contato' }}
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
              <option value="Importação">Importação</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              v-model="form.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="decisor, tecnologia, ceo"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
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
              {{ contact ? 'Atualizar' : 'Criar' }} Contato
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~~/shared/types'

interface Props {
  contact?: Contact | null
}

interface Emits {
  (e: 'save', data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  name: props.contact?.name || '',
  email: props.contact?.email || '',
  phone: props.contact?.phone || '',
  company: props.contact?.company || '',
  position: props.contact?.position || '',
  source: props.contact?.source || 'LinkedIn',
  status: props.contact?.status || 'ativo' as Contact['status']
})

const tagsInput = ref(props.contact?.tags?.join(', ') || '')

function handleSubmit() {
  const tags = tagsInput.value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0)
  
  emit('save', { ...form, tags })
}
</script>