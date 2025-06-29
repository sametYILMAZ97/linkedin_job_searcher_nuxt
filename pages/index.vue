<template>
  <div class="container-app">
    <!-- Header -->
    <header class="header-app">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                LinkedIn Job Search
              </h1>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                URL Builder Tool
              </p>
            </div>
          </div>
          <button
            @click="toggleDarkMode"
            class="btn-ghost"
            aria-label="Toggle theme"
          >
            <Icon
              :name="
                $colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'
              "
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Search Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Primary Search -->
          <div class="section">
            <div class="card-header">
              <h2 class="heading-md">Search Parameters</h2>
              <p class="text-body mt-1">
                Configure your LinkedIn job search criteria
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Keywords -->
              <div>
                <label for="keywords" class="form-label"> Job Keywords </label>
                <input
                  id="keywords"
                  v-model="jobSearchStore.form.keywords"
                  type="text"
                  class="form-input"
                  placeholder="e.g., Software Engineer, Product Manager"
                  @input="jobSearchStore.validateField('keywords')"
                />
                <p class="form-helper">Job titles, skills, or company names</p>
              </div>

              <!-- Location -->
              <div>
                <label for="location" class="form-label"> Location </label>
                <input
                  id="location"
                  v-model="jobSearchStore.form.location"
                  type="text"
                  class="form-input"
                  placeholder="e.g., San Francisco, CA"
                  @input="jobSearchStore.validateField('location')"
                />
                <p class="form-helper">City, state, or country</p>
              </div>
            </div>

            <!-- Distance -->
            <div>
              <label for="distance" class="form-label"> Search Radius </label>
              <select
                id="distance"
                v-model.number="jobSearchStore.form.distance"
                class="form-select"
              >
                <option :value="5">5 miles</option>
                <option :value="10">10 miles</option>
                <option :value="25">25 miles</option>
                <option :value="50">50 miles</option>
                <option :value="100">100 miles</option>
              </select>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div class="section">
            <div class="card-header">
              <h3 class="heading-sm">Advanced Filters</h3>
              <p class="text-body mt-1">
                Refine your search with additional criteria
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Time Filter -->
              <div>
                <TimeFilterSelector />
              </div>

              <!-- Sort By -->
              <div>
                <label for="sortBy" class="form-label"> Sort Results </label>
                <select
                  id="sortBy"
                  v-model="jobSearchStore.form.sortBy"
                  class="form-select"
                >
                  <option value="DD">Most Recent</option>
                  <option value="R">Most Relevant</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Experience Level -->
              <div>
                <ExperienceLevelSelector />
              </div>

              <!-- Job Type -->
              <div>
                <JobTypeSelector />
              </div>
            </div>

            <!-- Work Arrangement -->
            <div>
              <label class="form-label">Work Arrangement</label>
              <div class="space-y-3">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    value="1"
                    v-model="jobSearchStore.form.workplaceType"
                    class="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-slate-700 dark:text-slate-300"
                    >On-site</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    value="2"
                    v-model="jobSearchStore.form.workplaceType"
                    class="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-slate-700 dark:text-slate-300"
                    >Remote</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    value="3"
                    v-model="jobSearchStore.form.workplaceType"
                    class="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-slate-700 dark:text-slate-300"
                    >Hybrid</span
                  >
                </label>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                @click="handleGenerateURL"
                :disabled="jobSearchStore.isLoading"
                class="btn-primary w-full"
              >
                <Icon
                  v-if="jobSearchStore.isLoading"
                  name="heroicons:arrow-path"
                  class="w-5 h-5 mr-2 animate-spin"
                />
                <Icon
                  v-else
                  name="heroicons:magnifying-glass"
                  class="w-5 h-5 mr-2"
                />
                {{
                  jobSearchStore.isLoading
                    ? "Generating..."
                    : "Generate LinkedIn URL"
                }}
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- URL Result -->
            <div v-if="jobSearchStore.generatedUrl" class="animate-fade-in">
              <URLResult />
            </div>

            <!-- Search History -->
            <div class="section-compact">
              <div class="flex items-center justify-between mb-4">
                <h3 class="heading-sm">Recent Searches</h3>
                <button
                  v-if="jobSearchStore.searchHistory.length > 0"
                  @click="jobSearchStore.clearSearchHistory()"
                  class="btn-ghost text-sm"
                >
                  Clear All
                </button>
              </div>
              <SearchHistory />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { useJobSearchStore } from "~/stores/jobSearch";

// Store
const jobSearchStore = useJobSearchStore();

// Color mode
const colorMode = useColorMode();

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};

// Initialize store on mount
onMounted(() => {
  jobSearchStore.initializeStore();
});

// URL Generation
const handleGenerateURL = async () => {
  try {
    await jobSearchStore.generateURL();
  } catch (error) {
    console.error("Error generating URL:", error);
  }
};

// SEO
useHead({
  title: "LinkedIn Job Search URL Builder",
  meta: [
    {
      name: "description",
      content:
        "Generate optimized LinkedIn job search URLs with advanced filtering options. Find your perfect job faster with our professional URL builder tool.",
    },
    {
      name: "keywords",
      content:
        "LinkedIn, job search, URL builder, job filter, career, employment",
    },
  ],
});
</script>

<style scoped>
.btn-secondary,
.btn-linkedin {
  display: flex;
  align-items: center;
}
</style>
