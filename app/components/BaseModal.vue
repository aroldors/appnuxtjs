<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        :id="modalId"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-900 bg-opacity-50"
          @click="!disableBackdropClose && emit('close')"
        />

        <!-- Modal panel -->
        <div
          class="relative w-full bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[90vh]"
          :class="sizeClasses"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
            </slot>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              @click="emit('close')"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg shrink-0">
            <slot name="footer">
              <BaseButton
                variant="outline"
                :disabled="loading"
                @click="emit('close')"
              >
                {{ cancelText }}
              </BaseButton>
              <BaseButton
                :variant="confirmVariant"
                :loading="loading"
                :loading-text="loadingText"
                @click="emit('confirm')"
              >
                {{ confirmText }}
              </BaseButton>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import BaseButton from './BaseButton.vue'

interface Props {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  loading?: boolean
  loadingText?: string
  disableBackdropClose?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmVariant: 'primary',
  loading: false,
  loadingText: 'Salvando...',
  disableBackdropClose: false
})

const emit = defineEmits<Emits>()

const modalId = useId()

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  }
  return sizes[props.size]
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
