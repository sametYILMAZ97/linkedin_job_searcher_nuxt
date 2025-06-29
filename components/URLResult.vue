<template>
  <div v-if="store.generatedUrl" class="card">
    <div class="card-header">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon name="heroicons:link" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
        Generated LinkedIn URL
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">
        Your optimized LinkedIn job search URL is ready!
      </p>
    </div>

    <div class="space-y-4">
      <!-- URL Display -->
      <div class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="flex-1 min-w-0">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn Search URL
            </label>
            <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
              {{ store.generatedUrl }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          class="btn-linkedin flex items-center justify-center gap-2"
          @click="copyToClipboard"
          :disabled="copyLoading"
        >
          <span v-if="copyLoading" class="spinner"></span>
          <Icon v-else-if="copied" name="heroicons:check" class="w-5 h-5" />
          <Icon v-else name="heroicons:clipboard" class="w-5 h-5" />
          {{ copyLoading ? 'Copying...' : copied ? 'Copied!' : '📋 Copy to Clipboard' }}
        </button>

        <a
          :href="store.generatedUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Icon name="heroicons:arrow-top-right-on-square" class="w-5 h-5" />
          🚀 Open in LinkedIn
        </a>
      </div>

      <!-- Success Message -->
      <div v-if="copied" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
        <div class="flex items-center gap-2 text-green-800 dark:text-green-300">
          <Icon name="heroicons:check-circle" class="w-5 h-5" />
          <span class="font-medium">Success!</span>
        </div>
        <p class="text-green-700 dark:text-green-400 text-sm mt-1">
          URL has been copied to your clipboard. You can now paste it into LinkedIn or bookmark it for later use.
        </p>
      </div>

      <!-- Pro Tips -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h3 class="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">💡 Pro Tips</h3>
        <ul class="text-yellow-800 dark:text-yellow-300 text-sm space-y-1">
          <li>• <strong>Bookmark this URL</strong> for quick access to fresh job postings</li>
          <li>• <strong>Set browser alerts</strong> to check this search multiple times daily</li>
          <li>• <strong>Adjust time filters</strong> based on job posting frequency in your field</li>
          <li>• <strong>Use multiple searches</strong> with different keywords and locations</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJobSearchStore } from '~/stores/jobSearch'

const store = useJobSearchStore()

// Component state
const copyLoading = ref(false)
const copied = ref(false)

// Methods
const copyToClipboard = async () => {
  copyLoading.value = true

  try {
    const success = await store.copyToClipboard()
    if (success) {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 3000)
    }
  } catch (error) {
    console.error('Copy failed:', error)
  } finally {
    copyLoading.value = false
  }
}
</script>
