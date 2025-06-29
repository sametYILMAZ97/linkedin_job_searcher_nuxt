/**
 * LinkedIn Job Search Store - Nuxt/Pinia Implementation (Composition API)
 * Based on the comprehensive Python LinkedIn URL Builder
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  LinkedInSearchParams,
  FavoriteSearch,
  FormValidation,
  TimeFilterKey,
  SearchHistoryItem,
  UrlAnalysis,
  AppSettings,
  UIState
} from '~/types/linkedin'
import { TIME_SECONDS, convertHoursToSeconds } from '~/types/linkedin'

export const useJobSearchStore = defineStore('jobSearch', () => {
  // State
  const form = ref<LinkedInSearchParams>({
    keywords: '',
    location: '',
    distance: 100, // Default to 100 miles
    timePosted: '',
    customHours: undefined,
    experienceLevel: [],
    jobType: [],
    sortBy: 'DD', // Default to Most Recent
    workplaceType: ['1', '3'], // Default to On-site and Hybrid
    currentJobId: '',
    geoId: '',
    origin: 'JOB_SEARCH_PAGE_JOB_FILTER'
  })

  const generatedUrl = ref<string>('')
  const urlAnalysis = ref<UrlAnalysis | null>(null)
  const favorites = ref<FavoriteSearch[]>([])
  const searchHistory = ref<SearchHistoryItem[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const settings = ref<AppSettings>({
    theme: 'dark',
    autoSaveHistory: true,
    maxHistoryItems: 100,
    showAnalytics: true,
    defaultSortBy: 'DD', // Default to Most Recent
    defaultWorkplaceTypes: ['1', '3'], // On-site + Hybrid
    language: 'en'
  })

  const ui = ref<UIState>({
    isAdvancedFiltersOpen: false,
    isAnalyticsOpen: false,
    activeTab: 'form',
    showMobileMenu: false,
    notification: null
  })

  const validation = ref<FormValidation>({
    keywords: true,
    location: true,
    distance: true,
    geoId: true,
    customHours: true
  })

  // Getters
  const isFormValid = computed(() => {
    return Object.values(validation.value).every(valid => valid)
  })

  const favoriteCount = computed(() => {
    return favorites.value.length
  })

  const hasRecentFavorites = computed(() => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return favorites.value.some((fav: FavoriteSearch) => new Date(fav.createdAt) > oneWeekAgo)
  })

  // Actions
  /**
   * Generate LinkedIn URL based on current form parameters
   * Implements the Python URL builder logic
   */
  const generateURL = async (params?: LinkedInSearchParams): Promise<string> => {
    isLoading.value = true
    error.value = null

    try {
      const searchParams = params || form.value
      const url = new URL('https://www.linkedin.com/jobs/search/')

      // Add keywords (URL encoded)
      if (searchParams.keywords?.trim()) {
        url.searchParams.set('keywords', searchParams.keywords.trim())
      }

      // Add location
      if (searchParams.location?.trim()) {
        url.searchParams.set('location', searchParams.location.trim())
      }

      // Add geographic ID if provided
      if (searchParams.geoId?.trim()) {
        url.searchParams.set('geoId', searchParams.geoId.trim())
      }

      // Add distance
      if (searchParams.distance && searchParams.distance > 0) {
        url.searchParams.set('distance', searchParams.distance.toString())
      }

      // Add time filter (f_TPR parameter)
      if (searchParams.timePosted) {
        url.searchParams.set('f_TPR', searchParams.timePosted)
      } else if (searchParams.customHours && searchParams.customHours > 0) {
        const seconds = Math.floor(searchParams.customHours * TIME_SECONDS.HOUR)
        url.searchParams.set('f_TPR', `r${seconds}`)
      }

      // Add experience level filter (f_E)
      if (searchParams.experienceLevel && searchParams.experienceLevel.length > 0) {
        url.searchParams.set('f_E', searchParams.experienceLevel.join(','))
      }

      // Add job type filter (f_JT)
      if (searchParams.jobType && searchParams.jobType.length > 0) {
        url.searchParams.set('f_JT', searchParams.jobType.join(','))
      }

      // Add workplace type filter (f_WT)
      if (searchParams.workplaceType && searchParams.workplaceType.length > 0) {
        url.searchParams.set('f_WT', searchParams.workplaceType.join(','))
      }

      // Add sort by
      if (searchParams.sortBy) {
        url.searchParams.set('sortBy', searchParams.sortBy)
      }

      // Add current job ID if provided
      if (searchParams.currentJobId?.trim()) {
        url.searchParams.set('currentJobId', searchParams.currentJobId.trim())
      }

      // Add origin parameter
      if (searchParams.origin) {
        url.searchParams.set('origin', searchParams.origin)
      }

      const newGeneratedUrl = url.toString()
      generatedUrl.value = newGeneratedUrl

      // Analyze the URL
      urlAnalysis.value = analyzeUrl(newGeneratedUrl, searchParams)

      // Add to search history if enabled
      if (settings.value.autoSaveHistory) {
        addToSearchHistory(searchParams, newGeneratedUrl)
      }

      // Simulate API delay for loading state
      await new Promise(resolve => setTimeout(resolve, 300))

      return newGeneratedUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate URL'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Analyze URL quality and provide insights
   */
  const analyzeUrl = (url: string, params: LinkedInSearchParams): UrlAnalysis => {
    const analysis: UrlAnalysis = {
      isValid: true,
      parameterCount: 0,
      hasTimeFilter: false,
      hasLocationFilter: false,
      hasExperienceFilter: false,
      warnings: [],
      suggestions: []
    }

    try {
      const urlObj = new URL(url)
      const searchParams = urlObj.searchParams

      // Count parameters
      analysis.parameterCount = Array.from(searchParams.keys()).length

      // Check for specific filters
      analysis.hasTimeFilter = searchParams.has('f_TPR')
      analysis.hasLocationFilter = searchParams.has('location') || searchParams.has('geoId')
      analysis.hasExperienceFilter = searchParams.has('f_E')

      // Estimate results based on filters
      let specificity = 0
      if (params.keywords) specificity += 2
      if (analysis.hasLocationFilter) specificity += 1
      if (analysis.hasTimeFilter) specificity += 2
      if (analysis.hasExperienceFilter) specificity += 1
      if (searchParams.has('f_JT')) specificity += 1
      if (searchParams.has('f_WT')) specificity += 1

      if (specificity >= 6) analysis.estimatedResults = 'low'
      else if (specificity >= 3) analysis.estimatedResults = 'medium'
      else analysis.estimatedResults = 'high'

      // Generate warnings
      if (!params.keywords) {
        analysis.warnings?.push('No keywords specified - results may be too broad')
      }

      if (!analysis.hasTimeFilter) {
        analysis.warnings?.push('No time filter - you may see old job postings')
      }

      if (params.customHours && params.customHours < 1) {
        analysis.warnings?.push('Very short time filter may return few results')
      }

      // Generate suggestions
      if (!analysis.hasLocationFilter && !params.workplaceType?.includes('2')) {
        analysis.suggestions?.push('Consider adding a location or selecting "Remote" work type')
      }

      if (params.sortBy === 'R' && analysis.hasTimeFilter) {
        analysis.suggestions?.push('Consider sorting by "Date Posted" when using time filters')
      }

      if (analysis.estimatedResults === 'low') {
        analysis.suggestions?.push('Try reducing filters or broadening keywords for more results')
      }

    } catch (error) {
      analysis.isValid = false
      analysis.warnings?.push('Invalid URL format')
    }

    return analysis
  }

  /**
   * Validate form fields
   */
  const validateField = (field: keyof FormValidation, value?: any): boolean => {
    const fieldValue = value !== undefined ? value : form.value[field as keyof LinkedInSearchParams]

    switch (field) {
      case 'keywords':
        validation.value.keywords = !fieldValue || (typeof fieldValue === 'string' && fieldValue.length >= 2)
        break
      case 'location':
        validation.value.location = !fieldValue || (typeof fieldValue === 'string' && fieldValue.length >= 2)
        break
      case 'distance':
        validation.value.distance = fieldValue === undefined || fieldValue === null || (typeof fieldValue === 'number' && fieldValue > 0)
        break
      case 'geoId':
        validation.value.geoId = !fieldValue || (typeof fieldValue === 'string' && /^\d+$/.test(fieldValue))
        break
    }

    return validation.value[field]
  }

  /**
   * Reset form to default values
   */
  const resetForm = (): void => {
    form.value = {
      keywords: '',
      location: '',
      distance: 100, // Default to 100 miles
      timePosted: '',
      experienceLevel: [],
      jobType: [],
      sortBy: 'DD', // Default to Most Recent
      workplaceType: ['1', '3'], // Default to On-site and Hybrid
      currentJobId: '',
      geoId: '',
      origin: 'JOB_SEARCH_PAGE_JOB_FILTER'
    }
    generatedUrl.value = ''
    error.value = null
    validation.value = {
      keywords: true,
      location: true,
      distance: true,
      geoId: true,
      customHours: true
    }
  }

  /**
   * Add search to history
   */
  const addToSearchHistory = (params: LinkedInSearchParams, url: string): void => {
    if (!settings.value.autoSaveHistory) return

    const historyItem: SearchHistoryItem = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      params: { ...params },
      searchedAt: new Date().toISOString(),
      url
    }

    // Add to beginning of array
    searchHistory.value.unshift(historyItem)

    // Trim to max items
    if (searchHistory.value.length > settings.value.maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, settings.value.maxHistoryItems)
    }

    saveHistoryToStorage()
  }

  /**
   * Load search from history
   */
  const loadFromHistory = (historyItem: SearchHistoryItem): void => {
    form.value = { ...historyItem.params }
    generatedUrl.value = historyItem.url
    if (historyItem.url) {
      urlAnalysis.value = analyzeUrl(historyItem.url, historyItem.params)
    }
  }

  /**
   * Delete history item
   */
  const deleteHistoryItem = (id: string): void => {
    const index = searchHistory.value.findIndex(item => item.id === id)
    if (index > -1) {
      searchHistory.value.splice(index, 1)
      saveHistoryToStorage()
    }
  }

  /**
   * Clear all search history
   */
  const clearSearchHistory = (): void => {
    searchHistory.value = []
    saveHistoryToStorage()
  }

  /**
   * Show notification
   */
  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', message: string, duration = 5000): void => {
    ui.value.notification = {
      show: true,
      type,
      message,
      duration
    }

    // Auto-hide the notification after the specified duration
    if (duration > 0) {
      setTimeout(() => {
        hideNotification()
      }, duration)
    }
  }

  /**
   * Hide notification
   */
  const hideNotification = (): void => {
    if (ui.value.notification) {
      ui.value.notification.show = false
    }
  }

  /**
   * Update settings
   */
  const updateSettings = (newSettings: Partial<AppSettings>): void => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettingsToStorage()
  }

  /**
   * Copy URL to clipboard with enhanced feedback
   */
  const copyToClipboard = async (url?: string): Promise<boolean> => {
    const urlToCopy = url || generatedUrl.value

    if (!urlToCopy) {
      error.value = 'No URL to copy'
      showNotification('error', 'No URL to copy')
      return false
    }

    try {
      await navigator.clipboard.writeText(urlToCopy)
      showNotification('success', 'URL copied to clipboard!', 3000)
      return true
    } catch (err) {
      error.value = 'Failed to copy to clipboard'
      showNotification('error', 'Failed to copy to clipboard')
      return false
    }
  }

  /**
   * Open URL in LinkedIn
   */
  const openInLinkedIn = (url?: string): void => {
    const urlToOpen = url || generatedUrl.value

    if (!urlToOpen) {
      showNotification('error', 'No URL to open')
      return
    }

    window.open(urlToOpen, '_blank', 'noopener,noreferrer')
    showNotification('info', 'Opening LinkedIn in new tab...', 2000)
  }

  /**
   * Load favorite search
   */
  const loadFavorite = (favoriteId: string): void => {
    const favorite = favorites.value.find(f => f.id === favoriteId)
    if (favorite) {
      form.value = { ...favorite.params }
      favorite.lastUsed = new Date().toISOString()
      saveFavoritesToStorage()
    }
  }

  /**
   * Delete favorite search
   */
  const deleteFavorite = (favoriteId: string): void => {
    const index = favorites.value.findIndex(f => f.id === favoriteId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavoritesToStorage()
    }
  }

  /**
   * Load favorites from localStorage
   */
  const loadFavoritesFromStorage = (): void => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('linkedin_job_search_favorites')
        if (stored) {
          favorites.value = JSON.parse(stored)
        }
      } catch (err) {
        console.warn('Failed to load favorites from storage:', err)
      }
    }
  }

  /**
   * Save favorites to localStorage
   */
  const saveFavoritesToStorage = (): void => {
    if (process.client) {
      try {
        localStorage.setItem('linkedin_job_search_favorites', JSON.stringify(favorites.value))
      } catch (err) {
        console.warn('Failed to save favorites to storage:', err)
      }
    }
  }

  /**
   * Save settings to localStorage
   */
  const saveSettingsToStorage = (): void => {
    if (process.client) {
      try {
        localStorage.setItem('linkedin_job_search_settings', JSON.stringify(settings.value))
      } catch (err) {
        console.warn('Failed to save settings to storage:', err)
      }
    }
  }

  /**
   * Load settings from localStorage
   */
  const loadSettingsFromStorage = (): void => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('linkedin_job_search_settings')
        if (stored) {
          settings.value = { ...settings.value, ...JSON.parse(stored) }
        }
      } catch (err) {
        console.warn('Failed to load settings from storage:', err)
      }
    }
  }

  /**
   * Save search history to localStorage
   */
  const saveHistoryToStorage = (): void => {
    if (process.client) {
      try {
        localStorage.setItem('linkedin_job_search_history', JSON.stringify(searchHistory.value))
      } catch (err) {
        console.warn('Failed to save history to storage:', err)
      }
    }
  }

  /**
   * Load search history from localStorage
   */
  const loadHistoryFromStorage = (): void => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('linkedin_job_search_history')
        if (stored) {
          searchHistory.value = JSON.parse(stored)
        }
      } catch (err) {
        console.warn('Failed to load history from storage:', err)
      }
    }
  }

  /**
   * Save current search as favorite (enhanced version)
   */
  const saveFavorite = (name: string, description?: string, tags?: string[]): void => {
    if (!name.trim()) {
      error.value = 'Please provide a name for the favorite search'
      showNotification('error', 'Please provide a name for the favorite search')
      return
    }

    const favorite: FavoriteSearch = {
      id: `favorite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      params: { ...form.value },
      createdAt: new Date().toISOString(),
      description: description?.trim(),
      tags: tags || []
    }

    favorites.value.push(favorite)
    saveFavoritesToStorage()
    showNotification('success', `Favorite "${name}" saved!`)
  }

  /**
   * Clear all errors
   */
  const clearError = (): void => {
    error.value = null
  }

  /**
   * Convert custom time to LinkedIn format
   */
  const convertCustomTimeToFilter = (hours: number): string => {
    const seconds = Math.floor(hours * TIME_SECONDS.HOUR)
    return `r${seconds}`
  }

  /**
   * Get time filter display name
   */
  const getTimeFilterDisplay = (filterKey: TimeFilterKey): string => {
    const timeFilters = {
      '': 'Any time',
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
    return timeFilters[filterKey] || 'Custom'
  }

  // Auto-load favorites, history, and settings on store creation
  if (process.client) {
    loadFavoritesFromStorage()
    loadHistoryFromStorage()
    loadSettingsFromStorage()
  }

  return {
    // State
    form,
    generatedUrl,
    urlAnalysis,
    favorites,
    searchHistory,
    settings,
    ui,
    isLoading,
    error,
    validation,
    // Getters
    isFormValid,
    favoriteCount,
    hasRecentFavorites,
    // Actions
    generateURL,
    analyzeUrl,
    validateField,
    resetForm,
    addToSearchHistory,
    loadFromHistory,
    deleteHistoryItem,
    clearSearchHistory,
    showNotification,
    hideNotification,
    updateSettings,
    copyToClipboard,
    openInLinkedIn,
    saveSettingsToStorage,
    loadSettingsFromStorage,
    saveHistoryToStorage,
    loadHistoryFromStorage,
    saveFavorite,
    loadFavorite,
    deleteFavorite,
    loadFavoritesFromStorage,
    saveFavoritesToStorage,
    clearError,
    convertCustomTimeToFilter,
    getTimeFilterDisplay
  }
})
