<template>
  <NuxtLayout name="default-layout">
    <div class="space-y-6">
      <!-- Header com filtros -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Visão Geral</h2>
          <div class="flex items-center space-x-3">
            <select v-model="selectedPeriod" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 3 meses</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cards de estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Leads"
          :value="stats.totalLeads"
          icon="users"
          color="blue"
        />
        <StatsCard
          title="Leads Convertidos"
          :value="stats.convertedLeads"
          icon="check-circle"
          color="green"
        />
        <StatsCard
          title="Taxa de Conversão"
          :value="`${stats.conversionRate}%`"
          icon="trending-up"
          color="purple"
        />
        <StatsCard
          title="Receita Gerada"
          :value="formatCurrency(stats.revenue)"
          icon="currency-dollar"
          color="yellow"
        />
      </div>

      <!-- Gráficos e tabelas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gráfico de conversão por período -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Leads por Status</h3>
          <div class="space-y-3">
            <div v-for="status in leadsByStatus" :key="status.name" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="getStatusColor(status.name)"
                ></div>
                <span class="text-sm text-gray-700">{{ getStatusLabel(status.name as 'novo' | 'em-contato' | 'proposta-enviada' | 'fechado-ganho' | 'fechado-perdido') }}</span>
              </div>
              <span class="text-sm font-medium text-gray-900">{{ status.count }}</span>
            </div>
          </div>
        </div>

        <!-- Últimas atividades -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
          <div class="space-y-3">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
              <div 
                class="w-2 h-2 rounded-full mt-2"
                :class="getActivityColor(activity.type)"
              ></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ activity.description }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de leads recentes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Leads Recentes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="lead in recentLeads" :key="lead.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ lead.name }}</div>
                    <div class="text-sm text-gray-500">{{ lead.email }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ lead.company }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusBadgeColor(lead.status)"
                  >
                    {{ getStatusLabel(lead.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(lead.potentialValue) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(lead.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Lead } from '~~/shared/types'

definePageMeta({
  layout: false
})

const { getDashboardStats, getLeads } = useLeads()

const selectedPeriod = ref('30')
const stats = computed(() => getDashboardStats())
const allLeads = computed(() => getLeads())

const recentLeads = computed(() => {
  return [...allLeads.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const leadsByStatus = computed(() => {
  const statusCounts = allLeads.value.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    count
  }))
})

const recentActivities = computed(() => [
  {
    id: '1',
    type: 'lead_created',
    description: 'Novo lead criado: Carlos Eduardo',
    date: new Date()
  },
  {
    id: '2',
    type: 'status_change',
    description: 'Ana Paula moveu para "Proposta enviada"',
    date: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '3',
    type: 'deal_won',
    description: 'Negócio fechado com Mariana Costa',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2)
  }
])

function getStatusLabel(status: Lead['status']): string {
  const labels: Record<Lead['status'], string> = {
    'novo': 'Novo',
    'em-contato': 'Em Contato',
    'proposta-enviada': 'Proposta Enviada',
    'fechado-ganho': 'Fechado Ganho',
    'fechado-perdido': 'Fechado Perdido'
  }
  return labels[status] || status
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'novo': 'bg-blue-500',
    'em-contato': 'bg-yellow-500',
    'proposta-enviada': 'bg-purple-500',
    'fechado-ganho': 'bg-green-500',
    'fechado-perdido': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

function getStatusBadgeColor(status: Lead['status']): string {
  const colors: Record<Lead['status'], string> = {
    'novo': 'bg-blue-100 text-blue-800',
    'em-contato': 'bg-yellow-100 text-yellow-800',
    'proposta-enviada': 'bg-purple-100 text-purple-800',
    'fechado-ganho': 'bg-green-100 text-green-800',
    'fechado-perdido': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    'lead_created': 'bg-blue-500',
    'status_change': 'bg-yellow-500',
    'deal_won': 'bg-green-500'
  }
  return colors[type] || 'bg-gray-500'
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
</script>