<template>
  <NuxtLayout name="default-layout">
    <div class="space-y-4">
      <!-- Titulo do dashboard -->
      <div class="bg-transparent px-0 pb-2">
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <span class="text-sm text-gray-500">Visão geral do desempenho em vendas</span>
        </div>
      </div>

      <!-- Header com filtros -->
      <div class="bg-transparent px-0 pt-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <button 
              v-for="period in filterPeriods" 
              :key="period.value"
              @click="selectedPeriod = period.value"
              :class="[
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                selectedPeriod === period.value 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cards de estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total de Leads -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                <span class="text-sm text-gray-600">Total de Leads</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.totalLeads }}</div>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Taxa de Conversão -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-2 rounded-full bg-green-500"></div>
                <span class="text-sm text-gray-600">Taxa de Conversão</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.conversionRate }}%</div>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Receita Gerada -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-2 rounded-full bg-purple-500"></div>
                <span class="text-sm text-gray-600">Receita Gerada</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">{{ formatCurrencyShort(stats.revenue) }}</div>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Conversão Meta -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-2 mb-1">
                <div class="w-2 h-2 rounded-full bg-orange-500"></div>
                <span class="text-sm text-gray-600">Conversão Meta</span>
              </div>
              <div class="text-3xl font-bold text-gray-900 mb-2">{{ stats.convertedLeads }}</div>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
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

const filterPeriods = [
  { label: 'Última Semana', value: '7' },
  { label: 'Últimos 30 dias', value: '14' },
  { label: 'Último mês', value: '30' },
  { label: 'Este mês', value: 'current' }
]

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

function formatCurrencyShort(value: number) {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
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