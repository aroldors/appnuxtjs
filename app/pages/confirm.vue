<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center" id="confirm-page">
    <div class="text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
        <CheckCircleIcon class="h-8 w-8 text-blue-600" />
      </div>
      <h2 class="text-xl font-semibold text-gray-900">Confirmando sua conta...</h2>
      <p class="text-sm text-gray-500">Aguarde, você será redirecionado em instantes.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false
})

const user = useSupabaseUser()

watch(user, (value) => {
  if (value) {
    navigateTo('/dashboard')
  }
}, { immediate: true })
</script>
