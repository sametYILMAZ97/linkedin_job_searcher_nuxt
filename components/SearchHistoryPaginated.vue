<template>
  <div>
    <div v-if="jobSearchStore.searchHistory.length === 0" class="text-center py-8">
      <Icon name="heroicons:clock" class="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
      <p class="text-slate-600 dark:text-slate-400 text-sm">No recent searches</p>
      <p class="text-slate-500 dark:text-slate-500 text-xs mt-1">Your search history will appear here</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Items per page selector -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-600 dark:text-slate-400">
          Showing {{ startItem }}-{{ endItem }} of {{ jobSearchStore.searchHistory.length }} searches
        </span>
        <div class="flex items-center space-x-2">
          <label class="text-slate-600 dark:text-slate-400">Show:</label>
          <select 
            :value="jobSearchStore.historyPagination.itemsPerPage"
            class="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
            @change="changeItemsPerPage"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Search history items -->
      <div class="space-y-3">
        <div
          v-for="item in jobSearchStore.paginatedSearchHistory"
          :key="item.id"
          class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-2">
                <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-slate-400" />
                <h4 class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {{ item.params.keywords || 'Any Keywords' }}
                </h4>
              </div>
              
              <div class="space-y-1">
                <p v-if="item.params.location" class="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                  <Icon name="heroicons:map-pin" class="w-3 h-3 mr-1" />
                  {{ item.params.location }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-500">
                  {{ formatDate(item.searchedAt) }}
                </p>
              </div>
            </div>
            
            <div class="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                title="Copy URL"
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded"
                @click="copyUrl(item.url)"
              >
                <Icon name="heroicons:clipboard-document" class="w-3.5 h-3.5" />
              </button>
              <button
                title="Open in LinkedIn"
                class="p-1 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded"
                @click="openInLinkedIn(item.url)"
              >
                <Icon name="heroicons:arrow-top-right-on-square" class="w-3.5 h-3.5" />
              </button>
              <button
                title="Add to History"
                class="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded"
                @click="addToHistory()"
              >
                <Icon name="heroicons:plus" class="w-3.5 h-3.5" />
              </button>
              <button
                title="Load this search"
                class="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                @click="loadSearch(item)"
              >
                <Icon name="heroicons:arrow-up-tray" class="w-3.5 h-3.5" />
              </button>
              <button
                title="Delete"
                class="p-1 text-slate-400 hover:text-red-500 transition-colors rounded"
                @click="deleteItem(item.id)"
              >
                <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination controls -->
      <div v-if="jobSearchStore.totalHistoryPages > 1" class="flex items-center justify-center space-x-1 pt-4">
        <button
          title="Previous page"
          :disabled="!jobSearchStore.hasPrevHistoryPage"
          class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
          @click="jobSearchStore.prevHistoryPage()"
        >
          <Icon name="heroicons:chevron-left" class="w-3.5 h-3.5" />
        </button>

        <!-- Page numbers -->
        <div class="flex items-center space-x-0.5">
          <button
            v-for="page in getVisiblePages"
            :key="page"
            :class="[
              'px-2 py-1 text-xs rounded transition-colors',
              page === jobSearchStore.historyPagination.currentPage
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            ]"
            @click="jobSearchStore.setHistoryPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          title="Next page"
          :disabled="!jobSearchStore.hasNextHistoryPage"
          class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
          @click="jobSearchStore.nextHistoryPage()"
        >
          <Icon name="heroicons:chevron-right" class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useJobSearchStore } from '~/stores/jobSearch'
import type { SearchHistoryItem } from '~/types/linkedin'

const jobSearchStore = useJobSearchStore()

// Computed properties
const startItem = computed(() => {
  return (jobSearchStore.historyPagination.currentPage - 1) * jobSearchStore.historyPagination.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(
    jobSearchStore.historyPagination.currentPage * jobSearchStore.historyPagination.itemsPerPage,
    jobSearchStore.searchHistory.length
  )
})

const getVisiblePages = computed(() => {
  const currentPage = jobSearchStore.historyPagination.currentPage
  const totalPages = jobSearchStore.totalHistoryPages
  const maxVisible = 5
  
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return 'Yesterday'
  
  return date.toLocaleDateString()
}

const loadSearch = (item: SearchHistoryItem) => {
  jobSearchStore.loadFromHistory(item)
}

const copyUrl = async (url: string) => {
  await jobSearchStore.copyToClipboard(url)
}

const openInLinkedIn = (url: string) => {
  jobSearchStore.openInLinkedIn(url)
}

const addToHistory = () => {
  // Add current form state to history manually
  jobSearchStore.addCurrentSearchToHistory()
  jobSearchStore.showNotification('success', 'Current search added to history')
}

const deleteItem = (id: string) => {
  jobSearchStore.deleteHistoryItem(id)
}

const changeItemsPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const itemsPerPage = parseInt(target.value)
  jobSearchStore.setHistoryItemsPerPage(itemsPerPage)
}
</script>
