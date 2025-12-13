<template>
  <div id="nuxt-app">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAuthenticated } = useAuth()

// Redirecionar baseado na autenticação
watch(() => route.path, (newPath) => {
  if (process.client) {
    if (newPath === '/') {
      if (isAuthenticated.value) {
        navigateTo('/dashboard')
      } else {
        navigateTo('/login')
      }
    } else if (newPath !== '/login' && !isAuthenticated.value) {
      navigateTo('/login')
    }
  }
}, { immediate: true })
</script>
