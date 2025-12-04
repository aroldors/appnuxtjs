# 🎯 Prospector - App de Prospecção B2B

Um aplicativo web moderno para prospecção de leads B2B com autenticação multiempresa e multiusuário, construído com Nuxt 4 e Tailwind CSS.

## ✨ Funcionalidades

### 📊 Dashboard
- Resumo geral com estatísticas da empresa
- Cards de métricas: leads criados, convertidos, taxa de conversão, receita
- Gráficos de performance por status
- Lista de atividades recentes
- Tabela de leads recentes

### 🧱 Funil Kanban
- Visualização em kanban dos leads por status
- 5 colunas: Novo, Em contato, Proposta enviada, Fechado ganho, Fechado perdido
- Cards de leads com informações detalhadas
- Filtros por fonte e busca textual
- Drag-and-drop para mudança de status (implementação básica)

### 📇 Contatos
- Lista completa de contatos da empresa
- Campos: nome, e-mail, telefone, empresa, cargo, origem, status
- Filtros por status, fonte e busca
- Estatísticas de contatos (total, ativos, inativos, bloqueados)
- Modal para criar/editar contatos
- Importação de contatos (demo com dados mockados)

### 💬 Modelos de Mensagens
- Biblioteca de templates para WhatsApp e E-mail
- Sistema de tags para organização
- Variáveis dinâmicas: {{nome}}, {{empresa}}, {{assinatura}}
- Preview dos templates
- Funcionalidade de copiar para clipboard
- Estatísticas de uso

### ⚙️ Configurações
- **Perfil**: editar dados pessoais, função, senha
- **Empresa**: dados corporativos, CNPJ, fuso horário, moeda
- **Usuários**: gerenciar equipe, adicionar/remover usuários

## 🔐 Autenticação
- Sistema multiempresa (isolation por empresa_id)
- Dois tipos de usuário: Admin e Vendedor
- Credenciais de demo:
  - Admin: `joao@empresa.com` / `admin123`
  - Vendedor: `maria@empresa.com` / `vendedor123`

## 🛠️ Tecnologias

- **Nuxt 4** - Framework Vue.js
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vue 3** - Composables e reatividade
- **Mock Data** - Dados fictícios para demonstração

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar o aplicativo:**
   - URL: http://localhost:3000
   - Login com credenciais de demo

## 📁 Estrutura do Projeto

```
AppNuxtJs/
├── app/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── StatsCard.vue
│   │   ├── LeadCard.vue
│   │   ├── LeadModal.vue
│   │   ├── ContactModal.vue
│   │   ├── MessageTemplateModal.vue
│   │   ├── UserModal.vue
│   │   └── ImportModal.vue
│   ├── composables/         # Lógica de negócio
│   │   ├── useAuth.ts
│   │   ├── useLeads.ts
│   │   ├── useContacts.ts
│   │   └── useMessages.ts
│   ├── layouts/
│   │   └── DefaultLayout.vue
│   ├── pages/               # Rotas
│   │   ├── dashboard.vue
│   │   ├── funil.vue
│   │   ├── contatos.vue
│   │   ├── mensagens.vue
│   │   ├── configuracoes.vue
│   │   └── login.vue
│   └── app.vue
├── shared/
│   └── types/               # Tipos TypeScript
│       └── index.ts
├── nuxt.config.ts
└── package.json
```

## 📋 Funcionalidades Implementadas

### ✅ Completas
- [x] Layout responsivo com sidebar
- [x] Autenticação com mock data
- [x] Dashboard com estatísticas
- [x] Funil kanban com filtros
- [x] CRUD de contatos
- [x] CRUD de templates de mensagens
- [x] Configurações de perfil e empresa
- [x] Gerenciamento de usuários
- [x] Sistema de tipos TypeScript
- [x] Componentes reutilizáveis

### 🔮 Próximas Implementações
- [ ] Drag-and-drop avançado no funil
- [ ] Integração com banco de dados real
- [ ] Integração com APIs de WhatsApp/Email
- [ ] Importação real de planilhas
- [ ] Gráficos interativos
- [ ] Sistema de notificações
- [ ] Relatórios avançados
- [ ] PWA (Progressive Web App)

## 🎨 Design System

O projeto utiliza um design consistente baseado em:
- **Cores primárias**: Blue (600), Gray (50-900)
- **Cores de status**: Green (sucesso), Yellow (atenção), Red (erro)
- **Tipografia**: Sans-serif responsiva
- **Espaçamento**: Sistema baseado em 0.25rem (4px)
- **Componentes**: Cards, modais, formulários, botões padronizados

## 💡 Padrões de Código

### Componentes Vue
- **PascalCase** para nomes de componentes
- Props e emits tipados com TypeScript
- Uso de `<script setup lang="ts">`
- ID único em cada template raiz

### Composables
- Prefixo `use` + PascalCase
- Estado reativo com `useState`
- Funções puras e bem documentadas
- Retorno de dados readonly quando apropriado

### Páginas
- **minúsculas** para nomes de arquivos
- `definePageMeta({ layout: false })` quando necessário
- Uso de composables para lógica de dados

## 🔧 Configurações

### Nuxt Config
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss']
})
```

### TypeScript
- Strict mode habilitado
- Tipos globais em `/shared/types`
- Auto-import configurado para composables

## 📈 Performance

- **Build otimizado** com Vite
- **Code splitting** automático por página
- **Tree shaking** para redução de bundle
- **Lazy loading** de componentes quando aplicável

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido com ❤️ usando Nuxt 4 e TypeScript**
