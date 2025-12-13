<template>
  <div class="space-y-6">
      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              "
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Perfil do Usuário -->
          <div v-if="activeTab === 'profile'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Informações Pessoais</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  v-model="userForm.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  v-model="userForm.email"
                  type="email"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </label>
                <select
                  v-model="userForm.role"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha (deixe em branco para manter atual)
                </label>
                <input
                  v-model="userForm.password"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                @click="resetUserForm"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                @click="saveUserProfile"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Salvar Perfil
              </button>
            </div>
          </div>

          <!-- Dados da Empresa -->
          <div v-if="activeTab === 'company'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">Informações da Empresa</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Empresa
                </label>
                <input
                  v-model="companyForm.name"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                <input
                  v-model="companyForm.cnpj"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Fuso Horário
                </label>
                <select
                  v-model="companyForm.timezone"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select
                  v-model="companyForm.currency"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="BRL">Real (BRL)</option>
                  <option value="USD">Dólar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button
                @click="resetCompanyForm"
                class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                @click="saveCompanyData"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Salvar Empresa
              </button>
            </div>
          </div>

          <!-- Gerenciar Usuários -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Usuários da Empresa</h3>
              <button
                @click="showNewUserModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                + Adicionar Usuário
              </button>
            </div>
            
            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in companyUsers" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">
                              {{ user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                          <div class="text-sm text-gray-500">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                      >
                        {{ user.role === 'admin' ? 'Administrador' : 'Vendedor' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(user.createdAt) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        v-if="user.id !== currentUser?.id"
                        @click="removeUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                      <span v-else class="text-gray-400">Você</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Adicionar Usuário -->
      <UserModal
        v-if="showNewUserModal"
        @save="handleAddUser"
        @cancel="showNewUserModal = false"
      />
    </div>
</template>

<script setup lang="ts">
import type { User, Company } from '~~/shared/types'

definePageMeta({
  layout: 'default'
})

const { currentUser, currentCompany, updateProfile, updateCompany } = useAuth()

const activeTab = ref('profile')
const showNewUserModal = ref(false)

const tabs = [
  { id: 'profile', name: 'Perfil' },
  { id: 'company', name: 'Empresa' },
  { id: 'users', name: 'Usuários' }
]

// Forms
const userForm = reactive({
  name: currentUser.value?.name || '',
  email: currentUser.value?.email || '',
  role: currentUser.value?.role || 'vendedor',
  password: ''
})

const companyForm = reactive({
  name: currentCompany.value?.name || '',
  cnpj: currentCompany.value?.cnpj || '',
  timezone: currentCompany.value?.timezone || 'America/Sao_Paulo',
  currency: currentCompany.value?.currency || 'BRL'
})

// Mock users data
const companyUsers = ref([
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    role: 'admin' as const,
    companyId: 'company-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    role: 'vendedor' as const,
    companyId: 'company-1',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-01')
  }
])

function saveUserProfile() {
  const { password, ...profileData } = userForm
  updateProfile(profileData)
  alert('Perfil atualizado com sucesso!')
}

function saveCompanyData() {
  updateCompany(companyForm)
  alert('Dados da empresa atualizados com sucesso!')
}

function resetUserForm() {
  userForm.name = currentUser.value?.name || ''
  userForm.email = currentUser.value?.email || ''
  userForm.role = currentUser.value?.role || 'vendedor'
  userForm.password = ''
}

function resetCompanyForm() {
  companyForm.name = currentCompany.value?.name || ''
  companyForm.cnpj = currentCompany.value?.cnpj || ''
  companyForm.timezone = currentCompany.value?.timezone || 'America/Sao_Paulo'
  companyForm.currency = currentCompany.value?.currency || 'BRL'
}

function handleAddUser(userData: { name: string; email: string; role: User['role'] }) {
  const newUser = {
    id: `user-${Date.now()}`,
    ...userData,
    companyId: currentCompany.value?.id || 'company-1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  companyUsers.value.push(newUser)
  showNewUserModal.value = false
  alert('Usuário adicionado com sucesso!')
}

function removeUser(userId: string) {
  if (confirm('Tem certeza que deseja remover este usuário?')) {
    const userIndex = companyUsers.value.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      companyUsers.value.splice(userIndex, 1)
      alert('Usuário removido com sucesso!')
    }
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}
</script>