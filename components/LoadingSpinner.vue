<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div
        v-for="i in 3"
        :key="i"
        :class="dotClass"
        :style="{ animationDelay: `${(i - 1) * 0.16}s` }"
      />
    </div>
    <p v-if="message" :class="messageClass">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'white'
  message?: string
  overlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  overlay: false
})

const containerClass = computed(() => [
  'flex flex-col items-center justify-center',
  {
    'fixed inset-0 bg-black bg-opacity-50 z-50': props.overlay,
    'p-4': props.overlay
  }
])

const spinnerClass = computed(() => [
  'flex space-x-1',
  {
    'scale-75': props.size === 'sm',
    'scale-100': props.size === 'md',
    'scale-125': props.size === 'lg'
  }
])

const dotClass = computed(() => [
  'w-2 h-2 rounded-full animate-bounce',
  {
    'bg-blue-600': props.variant === 'primary',
    'bg-gray-600': props.variant === 'secondary',
    'bg-white': props.variant === 'white'
  }
])

const messageClass = computed(() => [
  'mt-3 text-sm font-medium',
  {
    'text-blue-600': props.variant === 'primary',
    'text-gray-600': props.variant === 'secondary',
    'text-white': props.variant === 'white'
  }
])
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite ease-in-out both;
}
</style>
