<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="lead-modal">
    <div class="relative top-20 mx-auto p-5 border w-[650px] shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ lead ? 'Editar Lead' : 'Novo Lead' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
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
              LinkedIn
            </label>
            <input
              v-model="form.linkedin"
              type="url"
              placeholder="https://linkedin.com/in/..."
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
              Ramo de Atividade
            </label>
            <input
              v-model="form.businessSector"
              type="text"
              placeholder="Ex: Tecnologia, Saúde, Educação"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
          </div>
          
          <!-- Linha com 3 colunas para Valor da Oportunidade, Status e Fonte -->
          <div class="col-span-2 grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Valor da Oportunidade *
              </label>
              <input
                v-model="formattedOpportunityValue"
                type="text"
                required
                placeholder="R$ 0,00"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                @input="handleCurrencyInput"
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
          </div>
          
          <div></div>
          
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Informações adicionais sobre o lead..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <div class="col-span-2 flex justify-end space-x-3 pt-4">
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
  linkedin: props.lead?.linkedin || '',
  email: props.lead?.email || '',
  phone: props.lead?.phone || '',
  position: props.lead?.position || '',
  businessSector: props.lead?.businessSector || '',
  potentialValue: props.lead?.potentialValue || 0,
  opportunityValue: props.lead?.opportunityValue || 0,
  status: props.lead?.status || 'novo' as Lead['status'],
  source: props.lead?.source || 'LinkedIn',
  notes: props.lead?.notes || '',
  assignedUserId: props.lead?.assignedUserId || currentUser.value?.id || '1',
  lastContact: props.lead?.lastContact
})

// Computed property para formatar valor monetário
const formattedOpportunityValue = computed({
  get() {
    if (!form.opportunityValue || form.opportunityValue === 0) return ''
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(form.opportunityValue)
  },
  set(value: string) {
    // Remove formatação e converte para número
    const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.')
    form.opportunityValue = parseFloat(numericValue) || 0
  }
})

// Função para lidar com input de moeda
function handleCurrencyInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = target.value
  
  // Remove tudo exceto dígitos
  value = value.replace(/[^\d]/g, '')
  
  if (value === '') {
    form.opportunityValue = 0
    return
  }
  
  // Converte para centavos e depois para reais
  const numericValue = parseInt(value) / 100
  form.opportunityValue = numericValue
  
  // Atualiza o valor formatado no campo
  nextTick(() => {
    target.value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(numericValue)
  })
}

function handleSubmit() {
  // Use opportunityValue as the main value, fallback to potentialValue for compatibility
  const submitData = {
    ...form,
    potentialValue: form.opportunityValue || form.potentialValue
  }
  emit('save', submitData)
}
</script>