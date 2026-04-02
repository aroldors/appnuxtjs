<template>
  <div id="agendamento-regua-horarios" class="flex flex-col w-16 shrink-0 select-none bg-indigo-50/50 rounded-t-lg" :style="{ height: `${slotHeight * horarios.length}px` }">
    <div
      v-for="hora in horarios"
      :key="hora"
      class="flex items-start justify-center pt-0.5 border-b border-indigo-100/70"
      :style="{ height: `${slotHeight}px` }"
    >
      <span class="text-xs text-gray-400 leading-none">{{ hora }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  slotHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  slotHeight: 160
})

const horaInicio = 8
const horaFim = 19
const horarios = Array.from({ length: horaFim - horaInicio + 1 }, (_, i) =>
  `${String(i + horaInicio).padStart(2, '0')}:00`
)
</script>
