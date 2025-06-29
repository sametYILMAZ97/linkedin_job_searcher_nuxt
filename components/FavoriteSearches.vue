<template>
  <div v-if="store.favorites.length > 0" class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Icon name="heroicons:star" class="w-6 h-6 text-yellow-500" />
            Favorite Searches
          </h2>
          <p class="text-gray-600 mt-1">
            {{ store.favoriteCount }} saved search{{ store.favoriteCount !== 1 ? 'es' : '' }}
          </p>
        </div>
        <button
          class="text-sm text-blue-600 hover:text-blue-800"
          @click="showManage = !showManage"
        >
          {{ showManage ? 'Hide' : 'Manage' }}
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Recent Favorites Quick Access -->
      <div v-if="!showManage && recentFavorites.length > 0">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Recent Favorites</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="favorite in recentFavorites.slice(0, 6)"
            :key="favorite.id"
            class="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="loadFavorite(favorite)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 truncate">
                  {{ favorite.name }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  <span v-if="favorite.params.keywords">{{ favorite.params.keywords }}</span>
                  <span v-if="favorite.params.location"> • {{ favorite.params.location }}</span>
                  <span v-if="favorite.params.timePosted"> • {{ getTimeDisplay(favorite.params.timePosted) }}</span>
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Created {{ formatDate(favorite.createdAt) }}
                  <span v-if="favorite.lastUsed"> • Last used {{ formatDate(favorite.lastUsed) }}</span>
                </p>
              </div>
              <Icon name="heroicons:arrow-right" class="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </div>
          </div>
        </div>

        <div v-if="store.favorites.length > 6" class="mt-3 text-center">
          <button
            class="text-sm text-blue-600 hover:text-blue-800"
            @click="showManage = true"
          >
            View all {{ store.favorites.length }} favorites →
          </button>
        </div>
      </div>

      <!-- Full Management View -->
      <div v-if="showManage">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">All Saved Searches</h3>
          <div class="flex gap-2">
            <button
              class="text-sm text-gray-600 hover:text-gray-800"
              @click="sortFavorites('name')"
            >
              Sort by Name
            </button>
            <button
              class="text-sm text-gray-600 hover:text-gray-800"
              @click="sortFavorites('date')"
            >
              Sort by Date
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="favorite in sortedFavorites"
            :key="favorite.id"
            class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h4 class="font-medium text-gray-900">
                    {{ favorite.name }}
                  </h4>
                  <span v-if="favorite.lastUsed" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Recently Used
                  </span>
                </div>

                <div class="text-sm text-gray-600 space-y-1">
                  <p v-if="favorite.params.keywords">
                    <strong>Keywords:</strong> {{ favorite.params.keywords }}
                  </p>
                  <p v-if="favorite.params.location">
                    <strong>Location:</strong> {{ favorite.params.location }}
                  </p>
                  <p v-if="favorite.params.timePosted">
                    <strong>Time Filter:</strong> {{ getTimeDisplay(favorite.params.timePosted) }}
                  </p>
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span v-if="favorite.params.experienceLevel?.length" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {{ favorite.params.experienceLevel.length }} experience level{{ favorite.params.experienceLevel.length !== 1 ? 's' : '' }}
                    </span>
                    <span v-if="favorite.params.jobType?.length" class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {{ favorite.params.jobType.length }} job type{{ favorite.params.jobType.length !== 1 ? 's' : '' }}
                    </span>
                    <span v-if="favorite.params.workplaceType?.length" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {{ getWorkplaceDisplay(favorite.params.workplaceType) }}
                    </span>
                  </div>
                </div>

                <p class="text-xs text-gray-500 mt-2">
                  Created {{ formatDate(favorite.createdAt) }}
                  <span v-if="favorite.lastUsed"> • Last used {{ formatDate(favorite.lastUsed) }}</span>
                </p>
              </div>

              <div class="flex gap-2 ml-4">
                <button
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  @click="loadFavorite(favorite)"
                  title="Load this search"
                >
                  <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
                </button>
                <button
                  class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  @click="generateDirectUrl(favorite)"
                  title="Generate URL directly"
                >
                  <Icon name="heroicons:link" class="w-4 h-4" />
                </button>
                <button
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  @click="confirmDelete(favorite)"
                  title="Delete favorite"
                >
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Management View -->
      <div v-if="showManage && store.favorites.length === 0" class="text-center py-8 text-gray-500">
        <Icon name="heroicons:star" class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No saved searches yet</p>
        <p class="text-sm">Generate a URL and save it as a favorite to get started</p>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <UModal v-model="showDeleteModal">
    <div class="p-6">
      <h3 class="text-lg font-semibold mb-4">Delete Favorite Search</h3>
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete "{{ favoriteToDelete?.name }}"? This action cannot be undone.
      </p>
      <div class="flex gap-3 justify-end">
        <button
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          @click="showDeleteModal = false"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          @click="deleteFavorite"
        >
          Delete
        </button>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJobSearchStore } from '~/stores/jobSearch'
import type { FavoriteSearch } from '~/types/linkedin'

const store = useJobSearchStore()

// Component state
const showManage = ref(false)
const showDeleteModal = ref(false)
const favoriteToDelete = ref<FavoriteSearch | null>(null)
const sortBy = ref<'name' | 'date'>('date')

// Computed
const recentFavorites = computed(() => {
  return [...store.favorites]
    .sort((a, b) => {
      // Sort by last used first, then by created date
      const aDate = a.lastUsed || a.createdAt
      const bDate = b.lastUsed || b.createdAt
      return new Date(bDate).getTime() - new Date(aDate).getTime()
    })
})

const sortedFavorites = computed(() => {
  const favorites = [...store.favorites]

  if (sortBy.value === 'name') {
    return favorites.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    return favorites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
})

// Methods
const loadFavorite = (favorite: FavoriteSearch) => {
  store.loadFavorite(favorite.id)
  showManage.value = false

  // Scroll to top to see the loaded form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const generateDirectUrl = async (favorite: FavoriteSearch) => {
  try {
    await store.generateURL(favorite.params)
    // Auto-copy to clipboard
    await store.copyToClipboard()
  } catch (error) {
    console.error('Failed to generate URL:', error)
  }
}

const confirmDelete = (favorite: FavoriteSearch) => {
  favoriteToDelete.value = favorite
  showDeleteModal.value = true
}

const deleteFavorite = () => {
  if (favoriteToDelete.value) {
    store.deleteFavorite(favoriteToDelete.value.id)
    showDeleteModal.value = false
    favoriteToDelete.value = null
  }
}

const sortFavorites = (type: 'name' | 'date') => {
  sortBy.value = type
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins} min ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

const getTimeDisplay = (timePosted?: string): string => {
  if (!timePosted) return 'Any time'

  const timeMap: Record<string, string> = {
    'r1800': '30 minutes',
    'r3600': '1 hour',
    'r7200': '2 hours',
    'r14400': '4 hours',
    'r28800': '8 hours',
    'r86400': '24 hours',
    'r259200': '3 days',
    'r604800': '1 week',
    'r2592000': '1 month'
  }

  return timeMap[timePosted] || timePosted
}

const getWorkplaceDisplay = (workplaceTypes?: string[]): string => {
  if (!workplaceTypes?.length) return ''

  const workMap: Record<string, string> = {
    '1': 'On-site',
    '2': 'Remote',
    '3': 'Hybrid'
  }

  return workplaceTypes.map(type => workMap[type] || type).join(', ')
}
</script>
