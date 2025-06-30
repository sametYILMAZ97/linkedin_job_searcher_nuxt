<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 transform translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-2"
  >
    <div v-if="jobSearchStore.ui.notification?.show" class="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <Icon :name="getIconName()" :class="getIconClass()" class="w-5 h-5" />
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-slate-900 dark:text-slate-100">
              {{ jobSearchStore.ui.notification.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="jobSearchStore.hideNotification()"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Icon name="heroicons:x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useJobSearchStore } from '~/stores/jobSearch'

const jobSearchStore = useJobSearchStore()

const getIconName = () => {
  const type = jobSearchStore.ui.notification?.type
  switch (type) {
    case 'success':
      return 'heroicons:check-circle'
    case 'error':
      return 'heroicons:x-circle'
    case 'warning':
      return 'heroicons:exclamation-triangle'
    case 'info':
    default:
      return 'heroicons:information-circle'
  }
}

const getIconClass = () => {
  const type = jobSearchStore.ui.notification?.type
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
    default:
      return 'text-blue-500'
  }
}
</script>
