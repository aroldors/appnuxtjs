# System Design — Prospector CRM

> Documento gerado em 12/03/2026. Descreve a arquitetura, estrutura de dados, fluxos e convenções do projeto.

---

## 1. Visão Geral

**Prospector CRM** é uma aplicação SaaS de CRM (Customer Relationship Management) voltada para gestão de leads, contatos, contas, profissionais e modelos de mensagens. A aplicação é desenvolvida com **Nuxt 4** no front-end e utiliza o **Supabase** como BaaS (Backend as a Service), provendo autenticação, banco de dados PostgreSQL e funções RPC.

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Nuxt | ^4.2.1 |
| UI Framework | Vue | ^3.5.24 |
| CSS | Tailwind CSS | ^6.14.0 |
| State Management | Pinia | ^3.0.4 |
| BaaS / Auth / DB | Supabase | ^2.0.3 |
| Ícones | Heroicons + Nuxt Icon | ^2.2.0 / ^2.2.1 |
| Notificações | Vue Toastification | ^2.0.0-rc.5 |
| Roteamento | Vue Router | ^4.6.3 |

---

## 3. Arquitetura da Aplicação

```
┌────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                        │
│                                                                │
│  ┌──────────────┐   ┌─────────────┐   ┌────────────────────┐  │
│  │    Pages     │ → │ Composables │ → │   Pinia Stores     │  │
│  │  (app/pages) │   │(app/composables)│  │  (app/stores)      │  │
│  └──────────────┘   └─────────────┘   └────────────────────┘  │
│         ↕                  ↕                   ↕               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Components                            │  │
│  │      Base (Input, Modal, Button, DataGrid, Dropdown)     │  │
│  │      Modais específicas por domínio                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼─────────────────────────────────────┐
│                      Nuxt Server (Nitro)                        │
│                                                                 │
│   server/api/users/invite.post.ts  (convite de usuários)        │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Supabase Client (REST / RPC)
┌──────────────────────────▼──────────────────────────────────────┐
│                        SUPABASE                                  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────────┐  ┌────────────────────┐  │
│  │ auth.users  │  │  public.tables  │  │     Functions      │  │
│  │ (auth built-in)│  │leads, contas,   │  │update_user_profile │  │
│  └─────────────┘  │contatos,usuarios│  └────────────────────┘  │
│                   │especialidades,  │                            │
│                   │profissionais    │                            │
│                   └─────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Estrutura de Pastas

```
AppNuxtJs/
├── app/
│   ├── app.vue                  # Shell: NuxtLayout > NuxtPage
│   ├── components/              # Componentes de UI (sem lógica de dados)
│   │   ├── Base*/               # Componentes genéricos reusáveis
│   │   ├── *Modal.vue           # Modais de criação/edição por domínio
│   │   ├── *ViewModal.vue       # Modais de visualização
│   │   ├── AppHeader.vue        # Header global
│   │   └── AppSidebar.vue       # Sidebar com navegação
│   ├── composables/             # Lógica de domínio reativa
│   ├── layouts/
│   │   └── default.vue          # Layout padrão (Sidebar + Header + slot)
│   ├── middleware/              # Guards de rota (client/server)
│   ├── pages/                   # Rotas file-based
│   ├── plugins/
│   │   ├── toast.client.ts      # Registro do Vue Toastification
│   │   └── user.client.ts       # Inicialização do store de usuário
│   ├── stores/
│   │   └── user.ts              # Store global de autenticação e perfil
│   └── types/
│       └── database.ts          # Tipos TypeScript gerados do schema Supabase
├── public/
│   ├── Prospector_Logo.png      # Logo principal
│   └── Prospector_Logo.webp     # Logo versão webp
├── server/
│   └── api/
│       └── users/
│           └── invite.post.ts   # Endpoint para convidar usuários
├── shared/
│   └── types/
│       └── index.ts             # Interfaces de domínio (Lead, Contact, User…)
├── nuxt.config.ts
└── package.json
```

---

## 5. Camadas e Responsabilidades

| Camada | Localização | Responsabilidade |
|---|---|---|
| **UI** | `app/components/` | Renderização, interações visuais, sem lógica de dados |
| **Pages** | `app/pages/` | Composição de componentes, orquestração de fluxo de rota |
| **Composables** | `app/composables/` | Lógica de domínio, acesso ao Supabase, estado de lista/paginação |
| **Stores** | `app/stores/` | Estado global compartilhado (sessão, perfil de usuário) |
| **Server API** | `server/api/` | Operações privilegiadas (service role, convites) |
| **Tipos** | `shared/types/`, `app/types/database.ts` | Contratos TypeScript |

### Regra de fluxo
```
Page → Composable → Supabase Client
Page → Store      → Supabase Client
Page → Server API → Supabase (service role)
```

---

## 6. Autenticação e Autorização

### Provedor
Supabase Auth com estratégia **email/password** e suporte a **magic link / convite**.

### Configuração (`nuxt.config.ts`)
```ts
supabase: {
  redirect: true,
  redirectOptions: {
    login: '/login',
    callback: '/confirm',
    exclude: [
      '/esqueci-senha',
      '/recupera-senha',
      '/criar-conta',
      '/confirm',
      '/completar-cadastro'
    ]
  }
}
```

- Todas as rotas não listadas em `exclude` exigem autenticação.
- O módulo `@nuxtjs/supabase` injeta automaticamente o redirect para `/login`.

### Relacionamento de identidade

```
auth.users (Supabase)
    id (uuid)  ──────────────────────┐
                                     │ FK: usuario_auth
                              public.usuarios
                                  id (bigint, PK)
                                  usuario_auth (uuid) ← campo de relacionamento
                                  user_id (uuid)      ← campo de auditoria (auth.uid() padrão)
                                  nome, cpf, telefone, endereço...
                                  role (user | admin)
                                  ativo (boolean)
                                  cliente_id (uuid, FK → clientes)
```

**Atenção**: `user_id` é um campo de **auditoria** (preenchido automaticamente via `default auth.uid()`). O campo `usuario_auth` é a **FK de relacionamento** entre `auth.users` e `public.usuarios`.

### Roles
| Role | Acesso |
|---|---|
| `user` | Acesso padrão às funcionalidades |
| `admin` | Pode convidar novos usuários via `/api/users/invite` |

---

## 7. Estado Global (Pinia Store — `user.ts`)

### Estado
```ts
profile: UserProfile | null  // dados da tabela public.usuarios
loading: boolean
error: string | null
```

### Getters
```ts
isAuthenticated  // computed: !!useSupabaseUser().value
userName         // profile.nome ?? 'Usuário'
userRole         // profile.role ?? 'user'
isActive         // profile.ativo ?? false
```

### Actions

| Action | Descrição |
|---|---|
| `fetchProfile()` | Busca `public.usuarios` via `.eq('usuario_auth', userId)` |
| `updateProfile(updates)` | Atualiza via `.update().eq('id', profile.id)` |
| `createProfile(data)` | Insere novo perfil com `usuario_auth` |
| `clearProfile()` | Limpa estado ao fazer logout |
| `initializeProfile()` | Watcher em `supabaseUser` → chama `fetchProfile()` automaticamente |

---

## 8. Composables de Domínio

### Padrão comum de paginação
Todos os composables de listagem seguem o mesmo padrão:

```ts
const PAGE_SIZE = 10       // tamanho da página (varia por módulo)
const currentPage = ref(1)
const searchQuery = ref('')
const totalItems = ref(0)

// Busca com paginação e filtro
const { data } = await supabase
  .from('tabela')
  .select('*', { count: 'exact' })
  .ilike('campo_busca', `%${searchQuery.value}%`)
  .range(offset, offset + PAGE_SIZE - 1)
```

### Mapa de composables

| Composable | Tabela/View | PAGE_SIZE | Observação |
|---|---|---|---|
| `useAuth` | `auth.*` + RPC | — | Auth, updateProfile via RPC `update_user_profile` |
| `useContacts` | `vw_contatos_contas` / `contatos` | 10 | Usa view para leitura, tabela para escrita |
| `useContas` | `contas` | 5 | — |
| `useEspecialidades` | `especialidades` | 10 | — |
| `useLeads` | `leads` | — | Sem paginação; transforma `LeadRow` → `Lead` |
| `useMessages` | — | — | **Mock data** (dados fictícios hardcoded) |
| `useProfissionais` | `vw_profissionais` | 10 | Somente leitura via view |

---

## 9. Rotas da Aplicação

### Rotas públicas (sem autenticação)
| Rota | Página | Descrição |
|---|---|---|
| `/login` | `login.vue` | Login com email/senha |
| `/criar-conta` | `criar-conta.vue` | Cadastro de novo usuário |
| `/esqueci-senha` | `esqueci-senha.vue` | Solicitar reset de senha |
| `/recupera-senha` | `recupera-senha.vue` | Confirmar nova senha |
| `/confirm` | `confirm.vue` | Callback de magic link/invite |
| `/completar-cadastro` | `completar-cadastro.vue` | Onboarding pós-confirmação |

### Rotas protegidas (autenticação obrigatória)
| Rota | Página | Módulo |
|---|---|---|
| `/dashboard` | `dashboard.vue` | KPIs e estatísticas |
| `/funil` | `funil.vue` | Pipeline de vendas (Kanban) |
| `/contatos` | `contatos.vue` | CRUD de contatos |
| `/contas` | `contas.vue` | CRUD de contas/clientes |
| `/especialidades` | `especialidades.vue` | CRUD de especialidades |
| `/profissionais` | `profissionais.vue` | Listagem de profissionais |
| `/mensagens` | `mensagens.vue` | Templates de mensagens |
| `/perfil` | `perfil.vue` | Edição do perfil do usuário |
| `/configuracoes` | `configuracoes.vue` | Configurações da aplicação |

---

## 10. Schema do Banco de Dados

### Tabelas principais

#### `public.usuarios`
```sql
id              bigint (PK, auto-increment)
cpf             varchar
nome            varchar
identificacao   varchar
endereco        varchar
numero          varchar
bairro          varchar
cidade          varchar
uf              varchar
telefone        varchar
role            varchar   DEFAULT 'user'
ativo           boolean   DEFAULT true
user_id         uuid      DEFAULT auth.uid()   -- auditoria
usuario_auth    uuid      FK → auth.users(id)   -- relacionamento
cliente_id      uuid      FK → clientes(id)
evento          varchar
evento_id       bigint
created_at      timestamptz
updated_at      timestamp
```

#### `public.leads`
```sql
id                bigint (PK)
nome              varchar
email             varchar
telefone          varchar
cargo             varchar
linkedin          varchar
endereco, numero, bairro, cidade, estado, cep
ramo_atividade    varchar
vlr_oportunidade  numeric
status            varchar  -- novo | em-contato | proposta-enviada | fechado-ganho | fechado-perdido
origem            varchar
observacoes       text
resumo            text
user_id           uuid     FK → auth.users
created_at / updated_at
```

#### `public.contas`
```sql
id              bigint (PK)
razao_social    varchar
cpf_cnpj        varchar (NOT NULL)
nome_fantasia   varchar
ramo_atividade  varchar
endereco, numero, bairro, cidade, estado, cep, rg
fone_comercial  varchar
fone_celular    varchar
email           varchar
website         varchar
contato         varchar
gestor_conta    bigint
user_id         uuid (NOT NULL)
cliente_id      uuid
created_at / updated_at
```

#### `public.contatos`
Estrutura com: `nome`, `email`, `telefone`, `cargo`, `origem`, `status`, `tags` (array), `conta` (FK), `user_id`, endereço completo.

#### `public.especialidades`
Tabela simples com `id`, `nome`, campos de auditoria.

#### `public.profissionais`
Tabela relacional: `usuario_id` (FK → usuarios), `especialidade_id` (FK → especialidades), `user_id`.

### Views
| View | Propósito |
|---|---|
| `vw_profissionais` | Join de profissionais + usuários + especialidades (id, nome, identificacao, especialidade) |
| `vw_contatos_contas` | Join de contatos + contas (dados completos para listagem) |

### Funções RPC
| Função | Parâmetros | Propósito |
|---|---|---|
| `update_user_profile` | `p_nome`, `p_cpf`, `p_identificacao`, `p_endereco`, `p_numero`, `p_bairro`, `p_cidade`, `p_uf`, `p_telefone` | Atualiza perfil do usuário autenticado via `auth.uid()` |

---

## 11. Server API

### `POST /api/users/invite`

Endpoint privilegiado para convidar novos usuários via e-mail.

**Autenticação**: Requer usuário autenticado com role `admin`.

**Body**:
```json
{
  "email": "string (obrigatório)",
  "nome": "string (obrigatório)",
  "role": "string (opcional, padrão: 'user')"
}
```

**Fluxo**:
1. Valida `email` e `nome`
2. Usa **Supabase Service Role** (elevado) para criar convite
3. Define redirect para `/completar-cadastro`
4. Insere linha na tabela `usuarios`

**Resposta**: `{ success: true }`

---

## 12. Layout e Navegação

### Layout padrão (`default.vue`)
```
┌──────────────────────────────────────────────────────┐
│  AppSidebar (w-64, fixed, left-0)                    │
│  ┌────────────────────────────────────────────────┐  │
│  │ Logo (Prospector CRM)                          │  │
│  │ Nav Links: Dashboard, Funil, Contatos, Contas, │  │
│  │   Especialidades, Profissionais, Mensagens,    │  │
│  │   Configurações                                │  │
│  │ Social Icons (Twitter, Facebook, LinkedIn,     │  │
│  │   Email)                                       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌── pl-64 ──────────────────────────────────────┐   │
│  │  AppHeader (h-[73px], border-b)               │   │
│  │  ┌────────────────────────────────────────┐   │   │
│  │  │ main.p-6                               │   │   │
│  │  │  <slot />                              │   │   │
│  │  └────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

### Indicação de rota ativa
A sidebar usa `isActivePath(path)` — compara `route.path === path` via `useRoute()` — para aplicar a classe `bg-blue-50 text-blue-700` no link ativo.

---

## 13. Componentes Base

| Componente | Props principais | Eventos |
|---|---|---|
| `BaseButton` | `variant` (primary/secondary/danger/success/outline), `loading`, `disabled`, `size` | `click` |
| `BaseInput` | `modelValue`, `label`, `type`, `placeholder`, `disabled`, `helpText`, `error` | `update:modelValue` |
| `BaseModal` | `modelValue` (v-model), `title`, `size` (sm/md/lg/xl) | `update:modelValue` |
| `BaseDropdown` | `modelValue`, `options`, `label`, `placeholder` | `update:modelValue` |
| `BaseDataGrid` | `columns`, `rows`, `totalItems`, `currentPage`, `pageSize`, `loading` | `update:currentPage`, `search` |

---

## 14. Convenções de Código

### Nomenclatura
| Tipo | Padrão | Exemplo |
|---|---|---|
| Componentes | PascalCase | `UserCard.vue`, `BaseModal.vue` |
| Páginas | minúsculas | `login.vue`, `perfil.vue` |
| Layouts | PascalCase | `default.vue` |
| Composables | `use` + PascalCase | `useAuth.ts`, `useLeads.ts` |
| Stores | camelCase | `user.ts` |
| Tipos | PascalCase | `UserProfile`, `LeadRow` |

### Imports
- Todos os imports são **explícitos** (sem auto-imports implícitos)
- Composables Nuxt (`useSupabaseClient`, `useRoute`, `useState`, etc.) são a exceção — disponíveis globalmente pelo framework

### TypeScript
- `lang="ts"` obrigatório em todos os `<script setup>`
- Evitar `any` — usar `as any` somente quando necessário por limitações de tipagem do Supabase
- Tipos de banco em `app/types/database.ts`
- Tipos de domínio em `shared/types/index.ts`

---

## 15. Fluxos Principais

### Fluxo de Login
```
/login → LoginForm → useAuth.login()
  → supabase.auth.signInWithPassword()
  → sucesso → redirect /dashboard
  → user.client.ts plugin → userStore.initializeProfile()
  → fetchProfile() → .eq('usuario_auth', userId) → public.usuarios
```

### Fluxo de Convite
```
/admin → POST /api/users/invite (service role)
  → supabase.auth.admin.inviteUserByEmail()
  → redirect /completar-cadastro
  → usuário recebe email → clica no link
  → /confirm (callback)
  → /completar-cadastro (onboarding)
```

### Fluxo de Atualização de Perfil
```
/perfil → handleSave() → useAuth.updateProfile()
  → supabase.rpc('update_user_profile', { p_nome, p_cpf, ... })
  → function SQL usa auth.uid() internamente
  → sucesso → userStore.fetchProfile() (recarrega estado)
```

### Fluxo de Listagem com Paginação
```
Page monta → composable.fetch()
  → supabase.from('tabela').select('*', { count: 'exact' })
    .ilike('campo', '%query%')
    .range(offset, offset + PAGE_SIZE - 1)
  → totalItems.value = count
  → BaseDataGrid renderiza rows + paginação
```

---

## 16. Pontos de Atenção / Débito Técnico

| Item | Situação | Observação |
|---|---|---|
| `useMessages` | Mock data hardcoded | Não possui integração com banco; templates são fictícios |
| `shared/types/index.ts` | Tipos paralelos ao `database.ts` | Algumas interfaces duplicam estruturas; manter sincronizados |
| `TestUserStore.vue` e `teste.vue` | Componentes de teste em produção | Devem ser removidos antes do deploy |
| `as any` no supabase client | Workaround de tipagem | Resolver após atualização dos tipos gerados pelo Supabase CLI |
| RLS (Row Level Security) | Não documentado | Verificar políticas ativas no Supabase para cada tabela |
