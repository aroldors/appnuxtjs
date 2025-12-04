<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" id="stats-card">
    <div class="flex items-center">
      <div class="p-3 rounded-lg" :class="iconBgColor">
        <svg class="h-6 w-6" :class="iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="icon === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          <path v-else-if="icon === 'check-circle'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path v-else-if="icon === 'trending-up'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          <path v-else-if="icon === 'currency-dollar'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      </div>
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900">{{ value }}</p>
        <p v-if="subtitle" class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: 'users' | 'check-circle' | 'trending-up' | 'currency-dollar'
  color: 'blue' | 'green' | 'purple' | 'yellow'
  subtitle?: string
}

const props = defineProps<Props>()

const iconBgColor = computed(() => {
  const colors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100'
  }
  return colors[props.color]
})

const iconColor = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600'
  }
  return colors[props.color]
})
</script>