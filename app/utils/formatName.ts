/**
 * Retorna o primeiro e o último nome do usuário.
 * Exemplo: "Carlos Machado de Campos" → "Carlos Campos"
 */
export function formatShortName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return 'Usuário'

  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 1) return parts[0]

  return `${parts[0]} ${parts[parts.length - 1]}`
}

/**
 * Retorna uma saudação com o primeiro e o último nome do usuário.
 * Exemplo: "Carlos Machado de Campos" → "Olá, Carlos Campos"
 */
export function formatUserGreeting(fullName: string | null | undefined): string {
  return `Olá, ${formatShortName(fullName)}`
}
