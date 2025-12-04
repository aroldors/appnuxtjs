<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="message-template-modal">
    <div class="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ template ? 'Editar Modelo' : 'Novo Modelo de Mensagem' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo *
            </label>
            <select
              v-model="form.type"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Conteúdo *
            </label>
            <textarea
              v-model="form.content"
              rows="8"
              required
              placeholder="Use {{nome}}, {{empresa}}, {{assinatura}} para variáveis"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Variáveis disponíveis: <code>&#123;&#123;nome&#125;&#125;</code>, <code>&#123;&#123;empresa&#125;&#125;</code>, <code>&#123;&#123;assinatura&#125;&#125;</code>
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tags (separadas por vírgula)
            </label>
            <input
              v-model="tagsInput"
              type="text"
              placeholder="primeiro-contato, follow-up, proposta"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <!-- Preview -->
          <div v-if="form.content" class="bg-gray-50 rounded-md p-3">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
            <div class="text-sm text-gray-600 whitespace-pre-wrap bg-white border rounded p-3">
              {{ previewContent }}
            </div>
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
              {{ template ? 'Atualizar' : 'Criar' }} Modelo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageTemplate } from '~~/shared/types'

interface Props {
  template?: MessageTemplate | null
}

interface Emits {
  (e: 'save', data: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  title: props.template?.title || '',
  type: props.template?.type || 'whatsapp' as MessageTemplate['type'],
  content: props.template?.content || ''
})

const tagsInput = ref(props.template?.tags?.join(', ') || '')

const previewContent = computed(() => {
  return form.content
    .replace(/{{nome}}/g, 'João Silva')
    .replace(/{{empresa}}/g, 'TechCorp LTDA')
    .replace(/{{assinatura}}/g, 'Atenciosamente,\nSua Empresa')
})

function handleSubmit() {
  const tags = tagsInput.value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter((tag: string) => tag.length > 0)
  
  emit('save', { ...form, tags })
}
</script>