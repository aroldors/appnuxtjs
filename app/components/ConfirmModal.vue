<template>
  <BaseModal
    :open="open"
    :title="title"
    size="sm"
    :confirm-text="confirmText"
    :cancel-text="cancelText"
    :loading="loading"
    confirm-variant="danger"
    @close="emit('cancel')"
    @confirm="emit('confirm')"
  >
    <p class="text-sm text-gray-600">{{ message }}</p>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'

interface Props {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar exclusão',
  message: 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
  confirmText: 'Excluir',
  cancelText: 'Cancelar',
  loading: false
})

const emit = defineEmits<Emits>()
</script>
