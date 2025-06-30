<template>
  <div>
    <label class="form-label"> Job Type </label>
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
            v-for="option in jobTypeOptions"
            :key="option.value"
            class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            <input
              v-model="store.form.jobType"
              type="checkbox"
              :value="option.value"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
            />
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

    <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Select the types of employment you're interested in</p>
  </div>
</template>

<script setup lang="ts">
const store = useJobSearchStore()
const isOpen = ref(false)

const jobTypeOptions = [
  { value: 'F', label: 'Full-time', description: 'Traditional employment' },
  { value: 'P', label: 'Part-time', description: 'Flexible hours' },
  { value: 'C', label: 'Contract', description: 'Project-based' },
  { value: 'T', label: 'Temporary', description: 'Short-term' },
  { value: 'I', label: 'Internship', description: 'Learning opportunity' },
  { value: 'V', label: 'Volunteer', description: 'Unpaid work' },
  { value: 'O', label: 'Other', description: 'Alternative arrangements' },
]

const selectedText = computed(() => {
  const types = store.form.jobType || []
  if (types.length === 0) {
    return 'Any job type'
  }
  if (types.length === 1) {
    const selected = jobTypeOptions.find(opt => opt.value === types[0])
    return selected?.label || 'Unknown'
  }
  return `${types.length} types selected`
})

const clearSelection = () => {
  store.form.jobType = []
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', event => {
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
