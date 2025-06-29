<template>
  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        🔍 URL Analysis
      </h3>
      <button
        @click="isExpanded = !isExpanded"
        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
      >
        {{ isExpanded ? 'Hide Details' : 'Show Details' }}
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {{ analysis.parameterCount }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Parameters</div>
      </div>

      <div class="text-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div class="text-2xl font-bold" :class="validityColor">
          {{ analysis.isValid ? '✓' : '✗' }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Valid URL</div>
      </div>

      <div class="text-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div class="text-2xl font-bold" :class="resultsColor">
          {{ resultsIndicator }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Est. Results</div>
      </div>

      <div class="text-center p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {{ activeFilters }}
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">Active Filters</div>
      </div>
    </div>

    <!-- Expanded Details -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-96"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-96"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded" class="space-y-4 overflow-hidden">
        <!-- Active Filters Breakdown -->
        <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">Active Filters</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-if="analysis.hasTimeFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Time Filter</span>
            </div>
            <div v-if="analysis.hasLocationFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Location Filter</span>
            </div>
            <div v-if="analysis.hasExperienceFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Experience Level</span>
            </div>
            <div v-if="hasJobTypeFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Job Type</span>
            </div>
            <div v-if="hasWorkplaceFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-red-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Workplace Type</span>
            </div>
            <div v-if="hasDistanceFilter" class="flex items-center space-x-2">
              <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
              <span class="text-sm text-gray-700 dark:text-gray-300">Distance</span>
            </div>
          </div>
        </div>

        <!-- Warnings -->
        <div v-if="analysis.warnings && analysis.warnings.length > 0" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
            <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
            Warnings
          </h4>
          <ul class="space-y-1">
            <li v-for="warning in analysis.warnings" :key="warning" class="text-sm text-yellow-700 dark:text-yellow-300">
              • {{ warning }}
            </li>
          </ul>
        </div>

        <!-- Suggestions -->
        <div v-if="analysis.suggestions && analysis.suggestions.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <InformationCircleIcon class="h-5 w-5 mr-2" />
            Suggestions
          </h4>
          <ul class="space-y-1">
            <li v-for="suggestion in analysis.suggestions" :key="suggestion" class="text-sm text-blue-700 dark:text-blue-300">
              • {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- URL Breakdown -->
        <div class="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <h4 class="font-medium text-gray-900 dark:text-white mb-3">URL Parameters</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="param in urlParameters" :key="param.key" class="flex justify-between items-center text-sm">
              <span class="font-mono text-gray-600 dark:text-gray-400">{{ param.key }}</span>
              <span class="text-gray-900 dark:text-gray-100 truncate ml-2 max-w-48">{{ param.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import type { UrlAnalysis } from '~/types/linkedin'

interface Props {
  analysis: UrlAnalysis
  url: string
}

const props = defineProps<Props>()

const isExpanded = ref(false)

const validityColor = computed(() => ({
  'text-green-600 dark:text-green-400': props.analysis.isValid,
  'text-red-600 dark:text-red-400': !props.analysis.isValid
}))

const resultsColor = computed(() => ({
  'text-green-600 dark:text-green-400': props.analysis.estimatedResults === 'high',
  'text-yellow-600 dark:text-yellow-400': props.analysis.estimatedResults === 'medium',
  'text-red-600 dark:text-red-400': props.analysis.estimatedResults === 'low'
}))

const resultsIndicator = computed(() => {
  switch (props.analysis.estimatedResults) {
    case 'high': return '📈'
    case 'medium': return '📊'
    case 'low': return '📉'
    default: return '❓'
  }
})

const activeFilters = computed(() => {
  let count = 0
  if (props.analysis.hasTimeFilter) count++
  if (props.analysis.hasLocationFilter) count++
  if (props.analysis.hasExperienceFilter) count++
  if (hasJobTypeFilter.value) count++
  if (hasWorkplaceFilter.value) count++
  if (hasDistanceFilter.value) count++
  return count
})

const hasJobTypeFilter = computed(() => {
  try {
    const url = new URL(props.url)
    return url.searchParams.has('f_JT')
  } catch {
    return false
  }
})

const hasWorkplaceFilter = computed(() => {
  try {
    const url = new URL(props.url)
    return url.searchParams.has('f_WT')
  } catch {
    return false
  }
})

const hasDistanceFilter = computed(() => {
  try {
    const url = new URL(props.url)
    return url.searchParams.has('distance')
  } catch {
    return false
  }
})

const urlParameters = computed(() => {
  try {
    const url = new URL(props.url)
    const params: { key: string; value: string }[] = []

    url.searchParams.forEach((value, key) => {
      params.push({ key, value })
    })

    return params.sort((a, b) => a.key.localeCompare(b.key))
  } catch {
    return []
  }
})
</script>
