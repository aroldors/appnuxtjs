<template>
  <aside
    id="app-sidebar"
    class="fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Logo -->
    <div class="flex items-center h-[73px] border-b border-gray-200 px-3 overflow-hidden">
      <img
        v-if="!collapsed"
        src="/Prospectra_Logo.png"
        alt="Prospectra"
        class="h-full w-full object-contain py-2"
      />
      <div v-else class="flex items-center justify-center w-full">
        <img src="/Prospectra_Lupa.png" alt="Prospectra" class="h-9 w-9 object-contain" />
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="mt-6 px-2 flex-1 overflow-y-auto overflow-x-hidden">
      <div class="space-y-1">
        <NuxtLink
          to="/dashboard"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Dashboard' : undefined"
        >
          <ChartBarIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Dashboard</span>
        </NuxtLink>

        <NuxtLink
          to="/funil"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/funil') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-900 hover:bg-blue-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Funil' : undefined"
        >
          <FunnelIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Funil</span>
        </NuxtLink>

        <NuxtLink
          to="/oportunidades"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/oportunidades') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-900 hover:bg-blue-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Oportunidades' : undefined"
        >
          <BriefcaseIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Oportunidades</span>
        </NuxtLink>

        <NuxtLink
          to="/contatos"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/contatos') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-900 hover:bg-blue-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Contatos' : undefined"
        >
          <UsersIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Contatos</span>
        </NuxtLink>

        <NuxtLink
          to="/contas"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/contas') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Contas' : undefined"
        >
          <BuildingOfficeIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Contas</span>
        </NuxtLink>

        <NuxtLink
          to="/agendamentos"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/agendamentos') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-900 hover:bg-blue-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Agendamentos' : undefined"
        >
          <CalendarDaysIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Agendamentos</span>
        </NuxtLink>

        <NuxtLink
          to="/especialidades"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/especialidades') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Especialidades' : undefined"
        >
          <AcademicCapIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Especialidades</span>
        </NuxtLink>

        <NuxtLink
          to="/profissionais"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/profissionais') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Profissionais' : undefined"
        >
          <UserGroupIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Profissionais</span>
        </NuxtLink>

        <NuxtLink
          to="/mensagens"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/mensagens') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Modelos de Mensagens' : undefined"
        >
          <ChatBubbleLeftEllipsisIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Modelos de Mensagens</span>
        </NuxtLink>

        <NuxtLink
          to="/configuracoes"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            isActivePath('/configuracoes') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? 'Configurações' : undefined"
        >
          <Cog6ToothIcon class="h-5 w-5 shrink-0" :class="collapsed ? '' : 'mr-3'" />
          <span v-if="!collapsed" class="truncate">Configurações</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Social Media Icons -->
    <div class="px-3 py-4 border-t border-gray-200">
      <div class="flex justify-center" :class="collapsed ? 'flex-col items-center space-y-2' : 'space-x-3'">
        <!-- Twitter -->
        <a
          href="#"
          class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-md transition-colors hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600"
          title="Twitter"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>

        <!-- Facebook -->
        <a
          href="#"
          class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-md transition-colors hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600"
          title="Facebook"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <!-- LinkedIn -->
        <a
          href="#"
          class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-md transition-colors hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600"
          title="LinkedIn"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>

        <!-- Email -->
        <a
          href="#"
          class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-md transition-colors hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600"
          title="Email"
        >
          <EnvelopeIcon class="w-5 h-5" />
        </a>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  ChartBarIcon,
  FunnelIcon,
  BriefcaseIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  EnvelopeIcon
} from '@heroicons/vue/24/outline'
import { useSidebar } from '~/composables/useSidebar'

const route = useRoute()
const { collapsed } = useSidebar()

function isActivePath(path: string): boolean {
  return route.path === path
}
</script>