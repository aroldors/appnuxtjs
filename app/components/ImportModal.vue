<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" id="import-modal">
    <div class="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Importar Contatos
        </h3>
        
        <div class="space-y-4">
          <!-- Opções de Importação -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Escolha o método de importação:
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="importMethod"
                  type="radio"
                  value="csv"
                  class="mr-2"
                >
                Arquivo CSV/Excel
              </label>
              <label class="flex items-center">
                <input
                  v-model="importMethod"
                  type="radio"
                  value="sheets"
                  class="mr-2"
                >
                Google Sheets (futuro)
              </label>
              <label class="flex items-center">
                <input
                  v-model="importMethod"
                  type="radio"
                  value="manual"
                  class="mr-2"
                >
                Inserção Manual (demo)
              </label>
            </div>
          </div>
          
          <!-- Upload de Arquivo -->
          <div v-if="importMethod === 'csv'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo:
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              @change="handleFileSelect"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
            <p class="text-xs text-gray-500 mt-1">
              Formatos aceitos: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          
          <!-- Google Sheets -->
          <div v-if="importMethod === 'sheets'">
            <p class="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
              🚧 Integração com Google Sheets será implementada em versões futuras
            </p>
          </div>
          
          <!-- Demo Manual -->
          <div v-if="importMethod === 'manual'">
            <p class="text-sm text-gray-600 mb-3">
              Para demonstração, vamos importar alguns contatos de exemplo:
            </p>
            <div class="bg-gray-50 rounded-md p-3 text-xs">
              <div class="space-y-1">
                <div>• Ana Costa - ana@empresa1.com - TechStart</div>
                <div>• Bruno Lima - bruno@empresa2.com - Innovation Co</div>
                <div>• Carla Santos - carla@empresa3.com - Digital Plus</div>
              </div>
            </div>
          </div>
          
          <!-- Template de exemplo -->
          <div v-if="importMethod === 'csv'" class="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 class="text-sm font-medium text-blue-900 mb-2">Formato esperado:</h4>
            <div class="text-xs text-blue-700 font-mono">
              nome,email,telefone,empresa,cargo<br>
              João Silva,joao@empresa.com,(11) 99999-9999,Empresa XYZ,Diretor
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
              @click="handleImport"
              :disabled="!canImport"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'import', data: any[]): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const importMethod = ref('manual')
const selectedFile = ref<File | null>(null)

const canImport = computed(() => {
  if (importMethod.value === 'manual') return true
  if (importMethod.value === 'csv') return !!selectedFile.value
  return false
})

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
}

function handleImport() {
  if (importMethod.value === 'manual') {
    // Demo data
    const demoData = [
      {
        nome: 'Ana Costa',
        email: 'ana@empresa1.com',
        telefone: '(11) 98888-1111',
        empresa: 'TechStart',
        cargo: 'CEO'
      },
      {
        nome: 'Bruno Lima',
        email: 'bruno@empresa2.com',
        telefone: '(11) 97777-2222',
        empresa: 'Innovation Co',
        cargo: 'CTO'
      },
      {
        nome: 'Carla Santos',
        email: 'carla@empresa3.com',
        telefone: '(11) 96666-3333',
        empresa: 'Digital Plus',
        cargo: 'Diretora Comercial'
      }
    ]
    emit('import', demoData)
  } else if (importMethod.value === 'csv' && selectedFile.value) {
    // Em uma implementação real, aqui seria feito o parse do arquivo CSV
    alert('Funcionalidade de importação CSV será implementada')
  } else if (importMethod.value === 'sheets') {
    alert('Integração com Google Sheets será implementada')
  }
}
</script>