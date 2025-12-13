<template>
  <div class="space-y-1">
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
      />
      
      <!-- Icon slot -->
      <div v-if="$slots.icon" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <slot name="icon" />
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
interface Props {
  modelValue?: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'error' | 'success'
  helpText?: string
  errorMessage?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

// Generate unique ID for accessibility
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Two-way data binding
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value || '')
})

const inputClasses = computed(() => {
  const baseClasses = 'block w-full border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  }
  
  const stateClasses = []
  
  if (props.disabled) {
    stateClasses.push('bg-gray-50 text-gray-500 cursor-not-allowed')
  } else if (props.readonly) {
    stateClasses.push('bg-gray-50')
  }
  
  // Add padding for icon
  const iconClass = 'pr-10'
  
  return [
    baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    ...stateClasses,
    iconClass
  ].join(' ')
})
</script>