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
import { ref, watch } from 'vue'
import { useProfissionais } from '~/composables/useProfissionais'
import { useUserStore } from '~/stores/user'
import type { Database } from '~/types/database'

type VwProfissionalRow = Database['public']['Views']['vw_profissionais']['Row']

const emit = defineEmits<{
  (e: 'loaded', profissional: VwProfissionalRow | null): void
}>()

const userStore = useUserStore()
const { fetchProfissionalByUsuarioId } = useProfissionais()

const profissional = ref<VwProfissionalRow | null>(null)
const loading = ref(false)

watch(
  () => userStore.profile?.id,
  async (id) => {
    if (!id) return
    loading.value = true
    profissional.value = await fetchProfissionalByUsuarioId(id)
    loading.value = false
    emit('loaded', profissional.value)
  },
  { immediate: true }
)
</script>
