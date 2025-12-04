<template>
  <div id="index-page"></div>
</template>

<script setup lang="ts">
// Redirecionar automaticamente
const { isAuthenticated } = useAuth()

if (process.client) {
  if (isAuthenticated.value) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
}
</script>