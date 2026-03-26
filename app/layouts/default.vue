<template>
  <div class="min-h-screen bg-gray-50" id="layout-app">
    <!-- Sidebar Component -->
    <AppSidebar />

    <!-- Main Content -->
    <div
      class="flex flex-col h-screen transition-all duration-300 ease-in-out"
      :class="collapsed ? 'pl-16' : 'pl-64'"
    >
      <!-- Header Component -->
      <AppHeader />

      <!-- Page Content -->
      <main class="p-6 flex flex-col flex-1 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '~/composables/useSidebar'

const { collapsed } = useSidebar()
</script>