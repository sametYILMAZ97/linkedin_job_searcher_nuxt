<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        📈 Search History
      </h2>
      <div class="flex items-center space-x-2">
        <button
          @click="clearHistory"
          :disabled="history.length === 0"
          class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ history.length }} searches
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="history.length === 0" class="text-center py-8">
      <div class="text-gray-400 dark:text-gray-500 text-4xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No search history yet</h3>
      <p class="text-gray-500 dark:text-gray-400">
        Your search history will appear here after you generate URLs
      </p>
    </div>

    <!-- History List -->
    <div v-else class="space-y-3">
      <div
        v-for="item in sortedHistory"
        :key="item.id"
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 dark:text-white truncate">
              {{ item.params.keywords || 'Untitled Search' }}
            </h3>
            <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>{{ formatDate(item.searchedAt) }}</span>
              <span v-if="item.params.location">📍 {{ item.params.location }}</span>
              <span v-if="item.resultsFound !== undefined">
                📊 {{ item.resultsFound }} results
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="loadSearch(item)"
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
              title="Load this search"
            >
              <Icon name="heroicons:arrow-download" class="w-4 h-4" />
              Load
            </button>
            <button
              @click="copyUrl(item.url)"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm p-1"
              title="Copy URL"
            >
              <Icon name="heroicons:clipboard-document" class="w-4 h-4" />
            </button>
            <button
              @click="deleteHistoryItem(item.id)"
              class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm p-1"
              title="Delete"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Search Parameters Summary -->
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="tag in getSearchTags(item.params)"
            :key="tag.key"
            :class="tag.class"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          >
            {{ tag.label }}
          </span>
        </div>

        <!-- URL Preview -->
        <details class="group">
          <summary class="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 select-none">
            <span class="group-open:hidden">Show URL</span>
            <span class="hidden group-open:inline">Hide URL</span>
          </summary>
          <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded border dark:border-gray-600 font-mono text-xs break-all text-gray-900 dark:text-gray-100">
            {{ item.url }}
          </div>
        </details>
      </div>
    </div>

    <!-- Load More (if history is very long) -->
    <div v-if="history.length > displayCount" class="text-center">
      <button
        @click="displayCount += 10"
        class="text-blue-600 hover:text-blue-700 text-sm font-medium"
      >
        Load More ({{ history.length - displayCount }} remaining)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchHistoryItem, LinkedInSearchParams } from '~/types/linkedin'

interface Props {
  history: SearchHistoryItem[]
}

interface Emits {
  'load-search': [params: LinkedInSearchParams]
  'delete-item': [id: string]
  'clear-all': []
  'copy-url': [url: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const displayCount = ref(10)

const sortedHistory = computed(() => {
  return [...props.history]
    .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime())
    .slice(0, displayCount.value)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

const getSearchTags = (params: LinkedInSearchParams) => {
  const tags: Array<{ key: string; label: string; class: string }> = []

  if (params.timePosted) {
    tags.push({
      key: 'time',
      label: `⏰ ${getTimeLabel(params.timePosted)}`,
      class: 'bg-blue-100 text-blue-800'
    })
  }

  if (params.experienceLevel && params.experienceLevel.length > 0) {
    tags.push({
      key: 'experience',
      label: `👔 ${params.experienceLevel.length} levels`,
      class: 'bg-purple-100 text-purple-800'
    })
  }

  if (params.jobType && params.jobType.length > 0) {
    tags.push({
      key: 'jobtype',
      label: `💼 ${params.jobType.length} types`,
      class: 'bg-green-100 text-green-800'
    })
  }

  if (params.workplaceType && params.workplaceType.length > 0) {
    tags.push({
      key: 'workplace',
      label: `🏢 ${params.workplaceType.length} arrangements`,
      class: 'bg-yellow-100 text-yellow-800'
    })
  }

  if (params.distance) {
    tags.push({
      key: 'distance',
      label: `📍 ${params.distance} miles`,
      class: 'bg-gray-100 text-gray-800'
    })
  }

  if (params.sortBy === 'DD') {
    tags.push({
      key: 'sort',
      label: '📅 Date sorted',
      class: 'bg-indigo-100 text-indigo-800'
    })
  }

  return tags
}

const getTimeLabel = (timeFilter: string) => {
  const timeMap: Record<string, string> = {
    'r1800': '30m',
    'r3600': '1h',
    'r7200': '2h',
    'r14400': '4h',
    'r28800': '8h',
    'r86400': '24h',
    'r259200': '3d',
    'r604800': '1w',
    'r2592000': '1m'
  }
  return timeMap[timeFilter] || 'Custom'
}

const loadSearch = (item: SearchHistoryItem) => {
  emit('load-search', item.params)
}

const deleteHistoryItem = (id: string) => {
  emit('delete-item', id)
}

const clearHistory = () => {
  emit('clear-all')
}

const copyUrl = (url: string) => {
  emit('copy-url', url)
}
</script>
