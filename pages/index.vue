<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              🔍 LinkedIn Job Search URL Builder
            </h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">
              Create optimized LinkedIn job search URLs with advanced filtering options
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-2 pb-0.5 aspect-square rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              :title="$colorMode.value === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <Icon
                v-if="$colorMode.value === 'dark'"
                name="heroicons:sun"
                class="w-5 h-5 text-yellow-500"
              />
              <Icon
                v-else
                name="heroicons:moon"
                class="w-5 h-5 text-gray-600 dark:text-gray-300"
              />
            </button>

            <div class="text-right">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                v{{ $config.public.appVersion }}
              </div>
              <div class="text-xs text-gray-400 dark:text-gray-500">
                Nuxt.js Version
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- LinkedIn URL Hacking Info Box -->
      <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          🎯 LinkedIn URL Hacking Technique
        </h2>
        <div class="text-blue-800 dark:text-blue-200 text-sm space-y-2">
          <p>
            <strong>Precision Time Filtering:</strong> Find jobs posted within custom time frames (30 minutes to months)
          </p>
          <p>
            <strong>Fresh Opportunities:</strong> Catch new job postings before they get flooded with applications
          </p>
          <p>
            <strong>Pro Tip:</strong> Use 1-4 hour filters for frequent checking to catch new postings quickly
          </p>
        </div>
      </div>

      <!-- Search Form -->
      <div class="card mb-8">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Search Parameters
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mt-1">
            Configure your LinkedIn job search with advanced filters
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Core Search Fields -->
          <div class="grid form-grid gap-6">
            <!-- Keywords -->
            <div>
              <label class="form-label">
                Keywords / Job Title
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="store.form.keywords"
                type="text"
                class="form-input"
                :class="{ 'error-input': !store.validation.keywords }"
                placeholder="e.g. Software Engineer, Data Scientist"
                @input="() => store.validateField('keywords')"
              />
              <p v-if="!store.validation.keywords" class="error-text">
                Please enter at least 2 characters
              </p>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Be specific (e.g., "Senior Python Developer" vs "Developer")
              </p>
            </div>

            <!-- Location -->
            <div>
              <label class="form-label">
                Location
              </label>
              <input
                v-model="store.form.location"
                type="text"
                class="form-input"
                :class="{ 'error-input': !store.validation.location }"
                placeholder="e.g. Turkey, Ankara, Remote"
                @input="() => store.validateField('location')"
              />
              <p v-if="!store.validation.location" class="error-text">
                Please enter at least 2 characters
              </p>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Use city/country names or "Remote" for remote positions
              </p>
            </div>

            <!-- Distance -->
            <div>
              <label class="form-label">
                Distance (miles)
              </label>
              <select
                v-model.number="store.form.distance"
                class="form-select"
                @change="() => store.validateField('distance')"
              >
                <option :value="undefined">Any distance</option>
                <option :value="5">5 miles</option>
                <option :value="10">10 miles</option>
                <option :value="25">25 miles</option>
                <option :value="50">50 miles</option>
                <option :value="75">75 miles</option>
                <option :value="100" selected>100 miles</option>
              </select>
            </div>

            <!-- Geographic ID (Manual) -->
            <div>
              <label class="form-label">
                Manual Geographic ID
                <Icon
                  name="heroicons:question-mark-circle"
                  class="w-4 h-4 text-gray-400 inline ml-1"
                  title="Find the exact LinkedIn geo ID from a LinkedIn search URL"
                />
              </label>
              <input
                v-model="store.form.geoId"
                type="text"
                class="form-input"
                :class="{ 'error-input': !store.validation.geoId }"
                placeholder="e.g. 103644278"
                @input="() => store.validateField('geoId')"
              />
              <p v-if="!store.validation.geoId" class="error-text">
                Please enter a valid numeric geo ID
              </p>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Optional: Find geo ID from LinkedIn URL after searching
              </p>
            </div>
          </div>

          <!-- Time Filtering Section -->
          <TimeFilterSelector />

          <!-- Advanced Filters -->
          <div class="grid form-grid gap-6">
            <!-- Experience Level -->
            <ExperienceLevelSelector />

            <!-- Job Type -->
            <JobTypeSelector />

            <!-- Workplace Type -->
            <div>
              <label class="form-label">
                Work Arrangement
              </label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="store.form.workplaceType"
                    type="checkbox"
                    value="1"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">On-site</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="store.form.workplaceType"
                    type="checkbox"
                    value="2"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Remote</span>
                </label>
                <label class="flex items-center">
                  <input
                    v-model="store.form.workplaceType"
                    type="checkbox"
                    value="3"
                    class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  >
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Hybrid</span>
                </label>
              </div>
            </div>

            <!-- Sort By -->
            <div>
              <label class="form-label">
                Sort By
              </label>
              <select
                v-model="store.form.sortBy"
                class="form-select"
              >
                <option value="R">Most Relevant</option>
                <option value="DD">Most Recent (Recommended for time filters)</option>
              </select>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Use "Most Recent" when using short time filters
              </p>
            </div>
          </div>

          <!-- Optional Fields -->
          <details class="border border-gray-200 dark:border-gray-600 rounded-lg">
            <summary class="p-4 cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              🔧 Advanced Options (Optional)
            </summary>
            <div class="p-4 pt-0 space-y-4">
              <div>
                <label class="form-label">
                  Current Job ID
                </label>
                <input
                  v-model="store.form.currentJobId"
                  type="text"
                  class="form-input"
                  placeholder="e.g. 4185657072"
                >
                <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Optional: Specific job ID for tracking
                </p>
              </div>
            </div>
          </details>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex gap-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="store.resetForm"
              >
                🔄 Reset Form
              </button>
            </div>
            <button
              type="submit"
              class="btn-linkedin flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold"
              :disabled="store.isLoading || !store.isFormValid"
            >
              <span v-if="store.isLoading" class="spinner"></span>
              <Icon v-else name="heroicons:link" class="w-5 h-5" />
              {{ store.isLoading ? 'Generating...' : 'Generate LinkedIn Search URL' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Generated URL Result -->
      <URLResult />

      <!-- URL Analysis -->
      <UrlAnalysis
        v-if="store.generatedUrl && store.urlAnalysis"
        :url="store.generatedUrl"
        :analysis="store.urlAnalysis"
      />

      <!-- Search History -->
      <SearchHistory
        :history="store.searchHistory"
        @load-search="handleLoadSearch"
        @delete-item="store.deleteHistoryItem"
        @clear-all="store.clearSearchHistory"
        @copy-url="store.copyToClipboard"
      />

      <!-- Loading Spinner -->
      <LoadingSpinner v-if="store.isLoading" />

      <!-- Toast Notifications -->
      <Toast
        v-if="store.ui.notification?.show"
        :show="store.ui.notification.show"
        :type="store.ui.notification.type"
        :title="''"
        :message="store.ui.notification.message"
        @close="store.hideNotification"
      />

      <!-- Error Toast -->
      <UNotification
        v-if="store.error"
        :title="store.error"
        color="red"
        variant="subtle"
        :actions="[{ label: 'Dismiss', click: () => store.clearError() }]"
      />
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-16">
      <div class="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <div class="space-y-2">
          <p>
            <strong class="text-gray-900 dark:text-white">LinkedIn Job Search URL Builder</strong> - Nuxt.js Version
          </p>
          <p class="text-sm">
            Based on the comprehensive Python implementation.
            Creates URLs for LinkedIn's public job search without bypassing any restrictions.
          </p>
          <p class="text-xs text-gray-500">
            Always respect LinkedIn's usage policies and rate limits.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJobSearchStore } from '~/stores/jobSearch'
import type { LinkedInSearchParams } from '~/types/linkedin'

// Components
import URLResult from '~/components/URLResult.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import Toast from '~/components/Toast.vue'
import UrlAnalysis from '~/components/UrlAnalysis.vue'
import TimeFilterSelector from '~/components/TimeFilterSelector.vue'
import SearchHistory from '~/components/SearchHistory.vue'
import ExperienceLevelSelector from '~/components/ExperienceLevelSelector.vue'
import JobTypeSelector from '~/components/JobTypeSelector.vue'

// Store
const store = useJobSearchStore()

// Handle search loading from history
const handleLoadSearch = (params: LinkedInSearchParams) => {
  // Find the history item that matches these params
  const historyItem = store.searchHistory.find(item =>
    JSON.stringify(item.params) === JSON.stringify(params)
  )
  if (historyItem) {
    store.loadFromHistory(historyItem)
  } else {
    // If not found, just load the params directly
    store.form = { ...params }
  }
}

// Theme management
const { $colorMode } = useNuxtApp()

const toggleDarkMode = () => {
  $colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'
  store.settings.theme = $colorMode.preference as 'light' | 'dark' | 'system'
}

// Page metadata
useHead({
  title: 'LinkedIn Job Search URL Builder - Nuxt.js',
  meta: [
    { name: 'description', content: 'Create optimized LinkedIn job search URLs with advanced filtering options. Precision time filtering, experience levels, job types, and remote work options.' },
    { name: 'keywords', content: 'LinkedIn, job search, URL builder, remote jobs, job filters, career search' }
  ]
})

// Methods
const handleSubmit = async () => {
  if (!store.isFormValid) {
    store.error = 'Please check the form for errors'
    return
  }

  try {
    await store.generateURL()

    // Auto-copy to clipboard
    const copied = await store.copyToClipboard()
    if (copied) {
      // Show success notification
      store.showNotification('success', 'URL generated and copied to clipboard!')
    }
  } catch (error) {
    console.error('Failed to generate URL:', error)
  }
}

// Auto-load favorites on mount
onMounted(() => {
  store.loadFavoritesFromStorage()
})
</script>

<style scoped>
/* Component-specific styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Multi-select styling */
select[multiple] {
  height: auto;
}

/* Checkbox styling */
input[type="checkbox"]:checked {
  background-color: var(--linkedin-blue);
  border-color: var(--linkedin-blue);
}

/* Details/summary styling */
details[open] summary {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}
</style>
