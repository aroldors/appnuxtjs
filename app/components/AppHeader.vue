<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div class="flex items-center justify-between px-6 h-[73px]">
      <div class="flex items-center gap-3">
        <button
          id="sidebar-toggle-btn"
          type="button"
          class="p-1.5 text-gray-500 border border-gray-300 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50 transition-colors focus:outline-none"
          style="border-radius: 5px;"
          @click="toggle"
          aria-label="Alternar menu lateral"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
      </div>

      <!-- User Menu -->
      <div class="relative" ref="menuRef">
        <ClientOnly>
          <!-- Trigger -->
          <button
            id="user-menu-trigger"
            type="button"
            class="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors focus:outline-none"
            @click="dropdownOpen = !dropdownOpen"
          >
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
              <span class="text-sm font-medium text-gray-700">{{ userInitials }}</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ profile?.nome || 'Usuário' }}</span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': dropdownOpen }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="dropdownOpen"
              id="user-menu-dropdown"
              class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50"
            >
              <!-- Welcome -->
              <div class="px-4 py-2.5 border-b border-gray-100">
                <p class="text-xs text-gray-400">Bem-vindo de volta!</p>
                <p class="text-sm font-semibold text-gray-800 truncate">{{ profile?.nome || 'Usuário' }}</p>
              </div>

              <!-- Items -->
              <ul class="py-1">
                <li>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    @click="goToProfile"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Perfil
                  </button>
                </li>
              </ul>

              <div class="border-t border-gray-100 py-1">
                <button
                  type="button"
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  @click="logout"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          </Transition>

          <template #fallback>
            <div class="flex items-center gap-2.5 px-2 py-1.5">
              <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse shrink-0" />
              <div class="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useSidebar } from '~/composables/useSidebar'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const { toggle } = useSidebar()

const dropdownOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/funil': 'Funil de Vendas',
    '/contatos': 'Contatos',
    '/mensagens': 'Modelos de Mensagens',
    '/configuracoes': 'Configurações',
    '/perfil': 'Meu Perfil',
    '/teste': 'Teste de Componentes'
  }
  return titles[route.path] || 'Prospectra'
})

const userInitials = computed(() => {
  if (!profile.value?.nome) return 'U'
  return profile.value.nome
    .split(' ')
    .filter((name: string) => name.length > 0)
    .map((name: string) => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

function goToProfile() {
  dropdownOpen.value = false
  router.push('/perfil')
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>