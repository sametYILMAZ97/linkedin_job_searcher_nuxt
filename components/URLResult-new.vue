<template>
  <div class="card-elevated">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="heading-sm">Generated URL</h3>
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Ready
          </span>
        </div>
      </div>

      <!-- URL Display -->
      <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">LinkedIn Job Search URL:</p>
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded p-3 font-mono text-sm break-all text-slate-900 dark:text-slate-100">
          {{ jobSearchStore.generatedUrl }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          @click="copyToClipboard"
          class="btn-primary flex-1 justify-center"
          :disabled="isCopying"
        >
          <Icon
            :name="isCopying ? 'heroicons:check' : 'heroicons:clipboard-document'"
            class="w-4 h-4 mr-2"
          />
          {{ isCopying ? 'Copied!' : 'Copy URL' }}
        </button>

        <button
          @click="openInLinkedIn"
          class="btn-linkedin flex-1 justify-center"
        >
          <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 mr-2" />
          Open
        </button>
      </div>

      <!-- Quick Stats -->
      <div v-if="jobSearchStore.urlAnalysis" class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ jobSearchStore.urlAnalysis.parameterCount }}
            </div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Parameters</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
              {{ jobSearchStore.urlAnalysis.estimatedResults || 'N/A' }}
            </div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Est. Results</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useJobSearchStore } from '~/stores/jobSearch'

const jobSearchStore = useJobSearchStore()

// Component state
const isCopying = ref(false)

// Methods
const copyToClipboard = async () => {
  isCopying.value = true

  try {
    await jobSearchStore.copyToClipboard()
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
    isCopying.value = false
  }
}

const openInLinkedIn = () => {
  jobSearchStore.openInLinkedIn()
}
</script>

<style scoped>
.btn-primary,
.btn-linkedin {
  @apply flex items-center;
}
</style>
