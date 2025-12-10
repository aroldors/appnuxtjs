/**
 * Utilitário para formatação e manipulação de valores monetários brasileiros
 */

/**
 * Formatar número para moeda brasileira
 */
export function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numericValue) || numericValue === 0) {
    return 'R$ 0,00'
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue)
}

/**
 * Converter string formatada de volta para número
 */
export function parseCurrency(value: string): number {
  if (!value) return 0
  
  // Remove tudo exceto dígitos, vírgulas e pontos
  const cleaned = value.replace(/[^0-9,.]/g, '')
  
  // Se não há vírgula, assume que é um valor inteiro
  if (!cleaned.includes(',')) {
    return parseFloat(cleaned) || 0
  }
  
  // Se tem vírgula, trata como decimal brasileiro (vírgula = decimal)
  const normalized = cleaned.replace(/\./g, '').replace(',', '.')
  return parseFloat(normalized) || 0
}

/**
 * Aplicar máscara de moeda em tempo real durante digitação
 */
export function applyCurrencyMask(value: string): string {
  // Remove todos os caracteres não numéricos
  const digitsOnly = value.replace(/\D/g, '')
  
  if (!digitsOnly) return ''
  
  // Converte para número (centavos) e depois para reais
  const numericValue = parseFloat(digitsOnly) / 100
  
  return formatCurrency(numericValue)
}

/**
 * Máscara de moeda para uso em eventos de input
 */
export function maskCurrency(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target) return
  
  const cursorPosition = target.selectionStart || 0
  const oldValue = target.value
  const newValue = applyCurrencyMask(oldValue)
  
  target.value = newValue
  
  // Ajusta posição do cursor para melhor UX
  const newCursorPosition = Math.max(
    newValue.length - (oldValue.length - cursorPosition),
    0
  )
  
  // Restaura posição do cursor após aplicar máscara
  setTimeout(() => {
    target.setSelectionRange(newCursorPosition, newCursorPosition)
  }, 0)
}

/**
 * Validar se um valor monetário está dentro de um range
 */
export function validateCurrencyRange(
  value: number,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): boolean {
  return value >= min && value <= max
}

/**
 * Composable para usar em componentes Vue com reatividade
 */
export function useCurrencyInput(initialValue: number = 0) {
  const value = ref(initialValue)
  const displayValue = ref(formatCurrency(initialValue))
  
  // Atualiza valor display quando valor numérico muda
  watch(value, (newValue) => {
    displayValue.value = formatCurrency(newValue)
  })
  
  // Função para atualizar com máscara
  const updateValue = (inputValue: string) => {
    const masked = applyCurrencyMask(inputValue)
    displayValue.value = masked
    value.value = parseCurrency(masked)
  }
  
  return {
    value: readonly(value),
    displayValue: readonly(displayValue),
    updateValue,
    setValue: (newValue: number) => {
      value.value = newValue
    },
    clear: () => {
      value.value = 0
      displayValue.value = ''
    }
  }
}