<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="show"
        :class="containerClass"
        role="alert"
        aria-live="polite"
      >
        <div :class="toastClass">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <component :is="iconComponent" :class="iconClass" />
          </div>

          <!-- Content -->
          <div class="ml-3 flex-1">
            <p v-if="title" :class="titleClass">
              {{ title }}
            </p>
            <p :class="messageClass">
              {{ message }}
            </p>
          </div>

          <!-- Close button -->
          <div class="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              :class="closeButtonClass"
              @click="onClose"
              aria-label="Close notification"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000,
  position: 'top-right'
})

const emit = defineEmits<{
  close: []
}>()

// Auto close timer
let timer: NodeJS.Timeout | null = null

watch(() => props.show, (newShow) => {
  if (newShow && props.duration > 0) {
    timer = setTimeout(() => {
      onClose()
    }, props.duration)
  } else if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})

const onClose = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  emit('close')
}

const containerClass = computed(() => [
  'fixed z-50 p-4 pointer-events-none',
  {
    'top-0 right-0': props.position === 'top-right',
    'top-0 left-0': props.position === 'top-left',
    'bottom-0 right-0': props.position === 'bottom-right',
    'bottom-0 left-0': props.position === 'bottom-left',
    'top-0 left-1/2 transform -translate-x-1/2': props.position === 'top-center'
  }
])

const toastClass = computed(() => [
  'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
  'flex p-4'
])

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success': return CheckCircleIcon
    case 'error': return XCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
    default: return InformationCircleIcon
  }
})

const iconClass = computed(() => [
  'h-6 w-6',
  {
    'text-green-400': props.type === 'success',
    'text-red-400': props.type === 'error',
    'text-yellow-400': props.type === 'warning',
    'text-blue-400': props.type === 'info'
  }
])

const titleClass = computed(() => [
  'text-sm font-medium',
  {
    'text-green-800': props.type === 'success',
    'text-red-800': props.type === 'error',
    'text-yellow-800': props.type === 'warning',
    'text-blue-800': props.type === 'info'
  }
])

const messageClass = computed(() => [
  'text-sm',
  {
    'text-green-700': props.type === 'success',
    'text-red-700': props.type === 'error',
    'text-yellow-700': props.type === 'warning',
    'text-blue-700': props.type === 'info',
    'mt-1': props.title
  }
])

const closeButtonClass = computed(() => [
  'bg-white rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    'text-green-400 hover:text-green-500 focus:ring-green-500': props.type === 'success',
    'text-red-400 hover:text-red-500 focus:ring-red-500': props.type === 'error',
    'text-yellow-400 hover:text-yellow-500 focus:ring-yellow-500': props.type === 'warning',
    'text-blue-400 hover:text-blue-500 focus:ring-blue-500': props.type === 'info'
  }
])
</script>
