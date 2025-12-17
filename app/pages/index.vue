<template>
  <div id="index-page"></div>
</template>

<script setup lang="ts">
// Redirecionar automaticamente baseado no Supabase
const supabaseUser = useSupabaseUser()

// Watch para mudanças no estado de autenticação
watch(() => supabaseUser.value, (user) => {
  if (process.client) {
    if (user) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  }
}, { immediate: true })

// Fallback se não houver mudança no watch
onMounted(() => {
  setTimeout(() => {
    if (supabaseUser.value) {
      navigateTo('/dashboard')
    } else {
      navigateTo('/login')
    }
  }, 100)
})
</script>