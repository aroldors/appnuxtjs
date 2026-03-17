<template>
  <div id="agendamento-regua-horarios" class="flex flex-col w-16 shrink-0 select-none">
    <div
      v-for="hora in horarios"
      :key="hora"
      class="flex items-start justify-end pr-2 pt-0.5"
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

const horaInicio = 6
const horaFim = 22
const horarios = Array.from({ length: horaFim - horaInicio + 1 }, (_, i) =>
  `${String(i + horaInicio).padStart(2, '0')}:00`
)
</script>
