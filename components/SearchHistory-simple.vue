<template>
  <div>
    <div v-if="jobSearchStore.searchHistory.length === 0" class="text-center py-8">
      <Icon name="heroicons:clock" class="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
      <p class="text-slate-600 dark:text-slate-400 text-sm">No recent searches</p>
      <p class="text-slate-500 dark:text-slate-500 text-xs mt-1">Your search history will appear here</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="item in jobSearchStore.searchHistory.slice(0, 5)"
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

          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="loadSearch(item)"
              class="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Load this search"
            >
              <Icon name="heroicons:arrow-up-tray" class="w-4 h-4" />
            </button>
            <button
              @click="copyUrl(item.url)"
              class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              title="Copy URL"
            >
              <Icon name="heroicons:clipboard-document" class="w-4 h-4" />
            </button>
            <button
              @click="deleteItem(item.id)"
              class="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="jobSearchStore.searchHistory.length > 5" class="text-center pt-2">
        <p class="text-xs text-slate-500 dark:text-slate-500">
          Showing 5 of {{ jobSearchStore.searchHistory.length }} searches
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobSearchStore } from '~/stores/jobSearch'

const jobSearchStore = useJobSearchStore()

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

const loadSearch = (item: any) => {
  jobSearchStore.loadFromHistory(item)
}

const copyUrl = async (url: string) => {
  await jobSearchStore.copyToClipboard(url)
}

const deleteItem = (id: string) => {
  jobSearchStore.deleteHistoryItem(id)
}
</script>
