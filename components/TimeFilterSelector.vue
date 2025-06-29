<template>
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
    <h3 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
      ⏰ Precision Time Filtering
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Time Posted Dropdown -->
      <div>
        <label class="form-label">
          Time Posted
        </label>
        <select
          v-model="store.form.timePosted"
          class="form-select"
          @change="onTimeFilterChange"
        >
          <option value="">Any time</option>
          <optgroup label="Ultra Fresh (Minutes/Hours)">
            <option value="r1800">30 minutes (Ultra Fresh!)</option>
            <option value="r3600">1 hour</option>
            <option value="r7200">2 hours</option>
            <option value="r14400">4 hours</option>
            <option value="r28800">8 hours</option>
          </optgroup>
          <optgroup label="Recent (Days)">
            <option value="r86400">24 hours (1 day)</option>
            <option value="r172800">48 hours (2 days)</option>
            <option value="r259200">3 days</option>
            <option value="r604800">1 week</option>
          </optgroup>
          <optgroup label="Extended (Weeks/Months)">
            <option value="r1209600">2 weeks</option>
            <option value="r2592000">1 month</option>
            <option value="r5184000">2 months</option>
            <option value="r7776000">3 months</option>
          </optgroup>
          <optgroup label="Custom">
            <option value="custom">Custom Hours...</option>
          </optgroup>
        </select>
        <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
          Choose how recent job postings should be
        </p>
      </div>

      <!-- Custom Hours Input (shown when custom is selected) -->
      <div v-if="store.form.timePosted === 'custom' || store.form.customHours">
        <label class="form-label">
          Custom Hours
        </label>
        <div class="relative">
          <input
            v-model.number="store.form.customHours"
            type="number"
            step="0.5"
            min="0.1"
            max="8760"
            class="form-input pr-16"
            placeholder="e.g. 0.5, 2.5, 6"
            @input="onCustomHoursChange"
          />
          <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
            hours
          </span>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
          Examples: 0.5 = 30 min, 2.5 = 2.5 hours, 12 = 12 hours
        </p>
      </div>
    </div>

    <!-- Time Filter Preview -->
    <div v-if="timeFilterPreview" class="mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            Selected Filter: {{ timeFilterPreview.label }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
            URL Parameter: f_TPR={{ timeFilterPreview.value }}
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs text-blue-600 dark:text-blue-400">
            {{ timeFilterPreview.description }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pro Tips -->
    <div class="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-3">
      <h4 class="font-medium text-blue-900 dark:text-blue-100 text-sm mb-2">💡 Pro Tips:</h4>
      <ul class="text-blue-800 dark:text-blue-200 text-xs space-y-1">
        <li>• Use 30min-4hr filters for catching fresh postings</li>
        <li>• Set alerts and check frequently with short time filters</li>
        <li>• Combine with "Most Recent" sorting for best results</li>
        <li>• Use custom hours for precise timing (e.g., 6.5 hours)</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useJobSearchStore()

// Computed property for time filter preview
const timeFilterPreview = computed(() => {
  if (store.form.timePosted === 'custom' && store.form.customHours) {
    const seconds = store.form.customHours * 3600
    return {
      label: `${store.form.customHours} hours (custom)`,
      value: `r${seconds}`,
      description: 'Custom time filter'
    }
  }

  if (store.form.timePosted && store.form.timePosted !== 'custom') {
    const timeFilters = [
      { value: 'r1800', label: '30 minutes', description: 'Ultra fresh postings' },
      { value: 'r3600', label: '1 hour', description: 'Very recent postings' },
      { value: 'r7200', label: '2 hours', description: 'Fresh postings' },
      { value: 'r14400', label: '4 hours', description: 'Recent postings' },
      { value: 'r28800', label: '8 hours', description: 'Today\'s postings' },
      { value: 'r86400', label: '24 hours (1 day)', description: 'Yesterday\'s postings' },
      { value: 'r172800', label: '48 hours (2 days)', description: 'Last 2 days' },
      { value: 'r259200', label: '3 days', description: 'Last 3 days' },
      { value: 'r604800', label: '1 week', description: 'This week\'s postings' },
      { value: 'r1209600', label: '2 weeks', description: 'Last 2 weeks' },
      { value: 'r2592000', label: '1 month', description: 'This month\'s postings' },
      { value: 'r5184000', label: '2 months', description: 'Last 2 months' },
      { value: 'r7776000', label: '3 months', description: 'Last 3 months' }
    ]

    return timeFilters.find(filter => filter.value === store.form.timePosted)
  }

  return null
})

// Handle time filter change
const onTimeFilterChange = () => {
  if (store.form.timePosted !== 'custom') {
    store.form.customHours = undefined
  }
}

// Handle custom hours change
const onCustomHoursChange = () => {
  if (store.form.customHours && store.form.customHours > 0) {
    // Keep the custom option selected when user enters custom hours
    if (store.form.timePosted !== 'custom') {
      store.form.timePosted = 'custom'
    }
  }
}
</script>
