<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        :class="selectClasses"
        v-bind="$attrs"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled :selected="!modelValue && modelValue !== 0">
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Chevron icon -->
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <!-- Help text -->
    <p v-if="helpText" class="text-sm text-gray-500">
      {{ helpText }}
    </p>

    <!-- Error message -->
    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
export interface DropdownOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number | null
  options: DropdownOption[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  helpText?: string
  errorMessage?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  required: false,
  disabled: false
})

const emit = defineEmits<Emits>()

const selectId = useId()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const val = target.value
  emit('update:modelValue', val === '' ? null : val)
}

const selectClasses = computed(() => {
  const base = 'block w-full appearance-none rounded-md border shadow-sm focus:outline-none focus:ring-1 pr-8'

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const stateClasses = props.errorMessage
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

  const disabledClasses = props.disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'

  return [base, sizeClasses[props.size], stateClasses, disabledClasses].join(' ')
})
</script>
