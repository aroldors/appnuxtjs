import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useState } from '#imports'

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

export const useAgendamentosStore = defineStore('agendamentos', () => {
  const dataReferencia = useState<Date>('agendamentos-dataReferencia', () => new Date())

  const diasSemana = computed<Date[]>(() => {
    const inicio = startOfWeek(dataReferencia.value)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      return d
    })
  })

  function avancarSemana(): void {
    const d = new Date(dataReferencia.value)
    d.setDate(d.getDate() + 7)
    dataReferencia.value = d
  }

  function voltarSemana(): void {
    const d = new Date(dataReferencia.value)
    d.setDate(d.getDate() - 7)
    dataReferencia.value = d
  }

  function $reset(): void {
    dataReferencia.value = new Date()
  }

  return {
    dataReferencia,
    diasSemana,
    avancarSemana,
    voltarSemana,
    $reset,
  }
})
