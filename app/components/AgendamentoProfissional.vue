<template>
  <div id="agendamento-profissional" class="flex flex-col items-center gap-0.5">
    <template v-if="loading">
      <div class="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      <div class="h-3 w-20 bg-gray-200 rounded animate-pulse mt-1" />
    </template>
    <template v-else-if="profissional">
      <span class="text-sm font-bold text-gray-900 tracking-wide uppercase">
        {{ profissional.nome ?? '—' }}
      </span>
      <span class="text-xs text-gray-500">
        {{ profissional.especialidade ?? '—' }}
      </span>
    </template>
    <template v-else>
      <span class="text-sm text-gray-400">Nenhum profissional</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'
import type { Database } from '~/types/database'

type VwProfissionalRow = Database['public']['Views']['vw_profissionais']['Row']

const userStore = useUserStore()
const { fetchProfissionalByUsuarioId } = useProfissionais()

const profissional = ref<VwProfissionalRow | null>(null)
const loading = ref(false)

onMounted(async () => {
  const usuarioId = userStore.profile?.id
  if (!usuarioId) return
  loading.value = true
  profissional.value = await fetchProfissionalByUsuarioId(usuarioId)
  loading.value = false
})
</script>
