<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50" id="oportunidade-modal">
      <div class="w-full max-w-[650px] bg-white rounded-lg shadow-xl border border-gray-200">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ oportunidade ? 'Editar Oportunidade' : 'Nova Oportunidade' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1 md:col-span-2">
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
          <div class="col-span-1 md:col-span-2">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="min-w-0">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Valor da Oportunidade *
                </label>
                <input
                  :value="opportunityValueDisplay"
                  type="text"
                  required
                  placeholder="R$ 0,00"
                  class="w-full min-w-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  @input="handleCurrencyInput"
                >
              </div>

              <div class="min-w-0">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="select-field w-full min-w-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="novo">Novo</option>
                  <option value="em-contato">Em Contato</option>
                  <option value="proposta-enviada">Proposta Enviada</option>
                  <option value="fechado-ganho">Fechado Ganho</option>
                  <option value="fechado-perdido">Fechado Perdido</option>
                </select>
              </div>

              <div class="min-w-0">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Fonte
                </label>
                <select
                  v-model="form.source"
                  class="select-field w-full min-w-0 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Website">Website</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Cold Email">Cold Email</option>
                  <option value="Evento">Evento</option>
                </select>
              </div>
            </div>
          </div>

          <div></div>

          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Informações adicionais sobre a oportunidade..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div class="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100">
            <button
              type="button"
              @click="$emit('cancel')"
              class="order-2 sm:order-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="order-1 sm:order-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              {{ oportunidade ? 'Atualizar' : 'Criar' }} Oportunidade
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Oportunidade } from '~~/shared/types'

interface Props {
  oportunidade?: Oportunidade | null
}

interface Emits {
  (e: 'save', data: Omit<Oportunidade, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  name: props.oportunidade?.name ?? '',
  email: props.oportunidade?.email ?? '',
  phone: props.oportunidade?.phone ?? '',
  position: props.oportunidade?.position ?? '',
  linkedin: props.oportunidade?.linkedin ?? '',
  businessSector: props.oportunidade?.businessSector ?? '',
  address: props.oportunidade?.address ?? '',
  number: props.oportunidade?.number ?? undefined as number | undefined,
  neighborhood: props.oportunidade?.neighborhood ?? '',
  city: props.oportunidade?.city ?? '',
  state: props.oportunidade?.state ?? '',
  zipCode: props.oportunidade?.zipCode ?? '',
  opportunityValue: props.oportunidade?.opportunityValue ?? 0,
  status: props.oportunidade?.status ?? 'novo' as Oportunidade['status'],
  source: props.oportunidade?.source ?? 'LinkedIn',
  notes: props.oportunidade?.notes ?? '',
  summary: props.oportunidade?.summary ?? ''
})

const {
  value: opportunityValueNumber,
  displayValue: opportunityValueDisplay,
  updateValue: updateOpportunityValue,
  setValue: setOpportunityValue
} = useCurrencyInput(form.opportunityValue)

watch(opportunityValueNumber, (newValue) => {
  form.opportunityValue = newValue
})

watch(() => props.oportunidade?.opportunityValue, (newValue) => {
  if (newValue && newValue > 0) {
    form.opportunityValue = newValue
    setOpportunityValue(newValue)
  }
}, { immediate: true })

function handleCurrencyInput(event: Event) {
  const target = event.target as HTMLInputElement
  updateOpportunityValue(target.value)
}

function handleSubmit() {
  emit('save', { ...form })
}
</script>

<style scoped>
.select-field {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 32px;
}

.select-field:focus {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234F46E5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
}
</style>
