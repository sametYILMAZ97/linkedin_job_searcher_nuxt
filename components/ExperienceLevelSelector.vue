<template>
  <div>
    <label class="form-label">
      Experience Level
    </label>
    <div class="relative">
      <button
        type="button"
        class="form-select flex items-center justify-between w-full"
        :class="{ 'ring-2 ring-blue-500': isOpen }"
        @click="isOpen = !isOpen"
      >
        <span class="text-gray-900 dark:text-white">
          {{ selectedText }}
        </span>
        <Icon
          name="heroicons:chevron-down"
          class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <div
        v-if="isOpen"
        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
      >
        <div class="p-2 space-y-2">
          <label
            v-for="option in experienceLevelOptions"
            :key="option.value"
            class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            <input
              v-model="store.form.experienceLevel"
              type="checkbox"
              :value="option.value"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
            >
            <span class="ml-3 text-sm text-gray-900 dark:text-white">
              {{ option.label }}
            </span>
            <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
              {{ option.description }}
            </span>
          </label>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-600 p-2">
          <button
            type="button"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            @click="clearSelection"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
      Select multiple experience levels that match your target roles
    </p>
  </div>
</template>

<script setup lang="ts">
const store = useJobSearchStore()
const isOpen = ref(false)

const experienceLevelOptions = [
  { value: '1', label: 'Internship', description: '0-1 years' },
  { value: '2', label: 'Entry level', description: '0-2 years' },
  { value: '3', label: 'Associate', description: '1-3 years' },
  { value: '4', label: 'Mid-Senior level', description: '3-8 years' },
  { value: '5', label: 'Director', description: '8+ years' },
  { value: '6', label: 'Executive', description: 'C-level' }
]

const selectedText = computed(() => {
  const levels = store.form.experienceLevel || []
  if (levels.length === 0) {
    return 'Any experience level'
  }
  if (levels.length === 1) {
    const selected = experienceLevelOptions.find(opt => opt.value === levels[0])
    return selected?.label || 'Unknown'
  }
  return `${levels.length} levels selected`
})

const clearSelection = () => {
  store.form.experienceLevel = []
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
      isOpen.value = false
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', () => {})
})
</script>
