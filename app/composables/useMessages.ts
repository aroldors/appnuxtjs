import type { MessageTemplate } from '~~/shared/types'

// Mock data
const mockMessageTemplates: MessageTemplate[] = [
  {
    id: '1',
    title: 'Primeiro Contato - LinkedIn',
    type: 'whatsapp',
    content: 'Olá {{nome}}! Vi seu perfil no LinkedIn e fiquei interessado em conversar sobre como podemos ajudar a {{empresa}} a otimizar seus processos. Você teria alguns minutos para uma conversa?',
    tags: ['primeiro-contato', 'linkedin', 'apresentacao'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: '2',
    title: 'Follow-up Proposta',
    type: 'email',
    content: `Olá {{nome}},

Espero que esteja bem! Enviei uma proposta para a {{empresa}} há alguns dias e gostaria de saber se você teve a oportunidade de analisá-la.

Nossa solução pode trazer os seguintes benefícios:
- Redução de 30% nos custos operacionais
- Aumento de 50% na produtividade
- ROI garantido em 6 meses

Você tem alguma dúvida ou gostaria de agendar uma reunião para discutirmos os detalhes?

Aguardo seu retorno!

Atenciosamente,
{{assinatura}}`,
    tags: ['follow-up', 'proposta', 'email'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: '3',
    title: 'Agradecimento - Fechamento',
    type: 'whatsapp',
    content: 'Muito obrigado {{nome}} pela confiança em nosso trabalho! A {{empresa}} fez uma excelente escolha. Vamos trabalhar juntos para superar todas as expectativas! 🎉',
    tags: ['agradecimento', 'fechamento', 'sucesso'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10')
  },
  {
    id: '4',
    title: 'Reativação de Lead',
    type: 'email',
    content: `Olá {{nome}},

Faz um tempo que não conversamos! Espero que a {{empresa}} esteja indo muito bem.

Tenho algumas novidades que podem ser interessantes para vocês:
- Novos recursos em nossa plataforma
- Casos de sucesso de empresas similares
- Promoção especial para este mês

Que tal agendarmos um café virtual para conversarmos sobre as oportunidades?

Abraços,
{{assinatura}}`,
    tags: ['reativacao', 'follow-up', 'promocao'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15')
  },
  {
    id: '5',
    title: 'Convite para Demo',
    type: 'whatsapp',
    content: 'Oi {{nome}}! Que tal conhecer nossa solução na prática? Preparei uma demo personalizada para a {{empresa}}. Podemos agendar para esta semana? É só 30 minutinhos! ⚡',
    tags: ['demo', 'convite', 'apresentacao'],
    companyId: 'company-1',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20')
  }
]

export const useMessages = () => {
  const messageTemplates = useState<MessageTemplate[]>('messages.templates', () => mockMessageTemplates)
  const loading = ref(false)

  const getMessageTemplates = () => {
    return messageTemplates.value
  }

  const getTemplateById = (id: string) => {
    return messageTemplates.value.find(template => template.id === id)
  }

  const getTemplatesByType = (type: MessageTemplate['type']) => {
    return messageTemplates.value.filter(template => template.type === type)
  }

  const createTemplate = (templateData: Omit<MessageTemplate, 'id' | 'createdAt' | 'updatedAt' | 'companyId'>) => {
    const { currentCompany } = useAuth()
    
    const newTemplate: MessageTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      companyId: currentCompany.value?.id || 'company-1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    messageTemplates.value.push(newTemplate)
    return newTemplate
  }

  const updateTemplate = (templateId: string, templateData: Partial<MessageTemplate>) => {
    const templateIndex = messageTemplates.value.findIndex(template => template.id === templateId)
    if (templateIndex !== -1) {
      const existingTemplate = messageTemplates.value[templateIndex]
      messageTemplates.value[templateIndex] = {
        ...existingTemplate,
        ...templateData,
        updatedAt: new Date()
      } as MessageTemplate
    }
  }

  const deleteTemplate = (templateId: string) => {
    const templateIndex = messageTemplates.value.findIndex(template => template.id === templateId)
    if (templateIndex !== -1) {
      messageTemplates.value.splice(templateIndex, 1)
    }
  }

  const filterTemplates = (filters: {
    type?: MessageTemplate['type'][]
    tags?: string[]
    search?: string
  }) => {
    let filteredTemplates = [...messageTemplates.value]

    if (filters.type?.length) {
      filteredTemplates = filteredTemplates.filter(template => filters.type!.includes(template.type))
    }

    if (filters.tags?.length) {
      filteredTemplates = filteredTemplates.filter(template =>
        filters.tags!.some((tag: string) => template.tags.includes(tag))
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredTemplates = filteredTemplates.filter(template =>
        template.title.toLowerCase().includes(searchLower) ||
        template.content.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    return filteredTemplates
  }

  const copyTemplateToClipboard = async (templateId: string, variables?: Record<string, string>) => {
    const template = getTemplateById(templateId)
    if (!template) return false

    let content = template.content
    
    // Substituir variáveis se fornecidas
    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        content = content.replace(regex, value)
      })
    }

    try {
      await navigator.clipboard.writeText(content)
      return true
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error)
      return false
    }
  }

  const getTemplatesStats = () => {
    const total = messageTemplates.value.length
    const whatsappTemplates = messageTemplates.value.filter(t => t.type === 'whatsapp').length
    const emailTemplates = messageTemplates.value.filter(t => t.type === 'email').length

    const tagsCount = messageTemplates.value.reduce((acc, template) => {
      template.tags.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const topTags = Object.entries(tagsCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }))

    return {
      total,
      whatsappTemplates,
      emailTemplates,
      topTags
    }
  }

  const processTemplate = (content: string, variables: Record<string, string>) => {
    let processedContent = content
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processedContent = processedContent.replace(regex, value)
    })
    
    return processedContent
  }

  return {
    messageTemplates: readonly(messageTemplates),
    loading: readonly(loading),
    getMessageTemplates,
    getTemplateById,
    getTemplatesByType,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    filterTemplates,
    copyTemplateToClipboard,
    getTemplatesStats,
    processTemplate
  }
}