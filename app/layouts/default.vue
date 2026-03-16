<template>
  <div class="min-h-screen bg-gray-50" id="layout-app">
    <!-- Sidebar Component -->
    <AppSidebar />

    <!-- Main Content -->
    <div class="pl-64 flex flex-col h-screen">
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
// No additional logic needed as components handle their own state
</script>