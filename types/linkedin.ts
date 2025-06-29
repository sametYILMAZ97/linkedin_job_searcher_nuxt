/**
 * LinkedIn Job Search URL Builder Types
 * Based on the comprehensive Python implementation
 */

export interface LinkedInSearchParams {
  // Core search parameters
  keywords?: string
  location?: string
  distance?: number
  currentJobId?: string
  geoId?: string

  // Time filtering
  timePosted?: string // Custom time filter (e.g., "1 hour", "24 hours")
  customHours?: number // Custom hours for precise filtering

  // Experience and job type filters
  experienceLevel?: string[]
  jobType?: string[]
  workplaceType?: string[]

  // Sorting and additional filters
  sortBy?: 'R' | 'DD' // R = Relevance, DD = Date posted

  // Advanced parameters
  origin?: string // Usually 'JOB_SEARCH_PAGE_JOB_FILTER'
}

export interface FavoriteSearch {
  id: string
  name: string
  params: LinkedInSearchParams
  createdAt: string
  lastUsed?: string
  tags?: string[] // For categorizing favorites
  description?: string // Optional description
}

export interface SearchHistoryItem {
  id: string
  params: LinkedInSearchParams
  searchedAt: string
  resultsFound?: number
  url: string
}

export interface UrlAnalysis {
  isValid: boolean
  parameterCount: number
  hasTimeFilter: boolean
  hasLocationFilter: boolean
  hasExperienceFilter: boolean
  estimatedResults?: 'high' | 'medium' | 'low'
  warnings?: string[]
  suggestions?: string[]
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  autoSaveHistory: boolean
  maxHistoryItems: number
  showAnalytics: boolean
  defaultSortBy: 'R' | 'DD'
  defaultWorkplaceTypes: string[]
  language: string
}

export interface FormValidation {
  keywords: boolean
  location: boolean
  distance: boolean
  geoId: boolean
  customHours: boolean
}

export interface UIState {
  isAdvancedFiltersOpen: boolean
  isAnalyticsOpen: boolean
  activeTab: 'form' | 'favorites' | 'history' | 'analytics'
  showMobileMenu: boolean
  notification: {
    show: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  } | null
}

export interface JobSearchStore {
  // Current form state
  form: LinkedInSearchParams

  // Generated URL and analysis
  generatedUrl: string
  urlAnalysis: UrlAnalysis | null

  // Favorites and history
  favorites: FavoriteSearch[]
  searchHistory: SearchHistoryItem[]

  // Settings
  settings: AppSettings

  // UI state
  isLoading: boolean
  error: string | null
  ui: UIState

  // Validation
  validation: FormValidation
}

// LinkedIn URL Parameter Mappings
export const TIME_FILTERS = {
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
} as const

export const EXPERIENCE_LEVELS = {
  '1': 'Internship',
  '2': 'Entry level',
  '3': 'Associate',
  '4': 'Mid-Senior level',
  '5': 'Director',
  '6': 'Executive'
} as const

export const JOB_TYPES = {
  'F': 'Full-time',
  'P': 'Part-time',
  'C': 'Contract',
  'T': 'Temporary',
  'I': 'Internship',
  'V': 'Volunteer',
  'O': 'Other'
} as const

export const WORKPLACE_TYPES = {
  '1': 'On-site',
  '2': 'Remote',
  '3': 'Hybrid'
} as const

export const DISTANCE_OPTIONS = [
  { value: '', label: 'Any distance' },
  { value: '5', label: '5 miles' },
  { value: '10', label: '10 miles' },
  { value: '25', label: '25 miles' },
  { value: '50', label: '50 miles' },
  { value: '75', label: '75 miles' },
  { value: '100', label: '100 miles' }
] as const

// Time conversion utilities
export const TIME_SECONDS = {
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  WEEK: 604800,
  MONTH: 2592000
} as const

// Quick time filter presets (like Python version)
export const QUICK_TIME_FILTERS = [
  { label: '30 minutes', value: 'r1800', hours: 0.5 },
  { label: '1 hour', value: 'r3600', hours: 1 },
  { label: '2 hours', value: 'r7200', hours: 2 },
  { label: '4 hours', value: 'r14400', hours: 4 },
  { label: '8 hours', value: 'r28800', hours: 8 },
  { label: '24 hours', value: 'r86400', hours: 24 },
  { label: '3 days', value: 'r259200', hours: 72 },
  { label: '1 week', value: 'r604800', hours: 168 },
  { label: '1 month', value: 'r2592000', hours: 720 }
] as const

// Geographic regions for better UX
export const POPULAR_LOCATIONS = [
  'Remote',
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'Turkey',
  'Netherlands',
  'Australia',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Berlin, Germany',
  'Istanbul, Turkey',
  'Ankara, Turkey'
] as const

// LinkedIn URL origins
export const URL_ORIGINS = {
  JOB_SEARCH: 'JOB_SEARCH_PAGE_JOB_FILTER',
  SEARCH_RESULTS: 'SWITCH_SEARCH_VERTICAL',
  DIRECT: 'JOBS_HOME_VERTICAL_IN_SEARCH'
} as const

// Utility functions
export const convertHoursToSeconds = (hours: number): number => {
  return Math.floor(hours * TIME_SECONDS.HOUR)
}

export const convertSecondsToHours = (seconds: number): number => {
  return seconds / TIME_SECONDS.HOUR
}

export const generateTimeFilterValue = (hours: number): string => {
  return `r${convertHoursToSeconds(hours)}`
}

export const parseTimeFilterValue = (value: string): number | null => {
  const match = value.match(/^r(\d+)$/)
  return match ? convertSecondsToHours(parseInt(match[1])) : null
}

export type TimeFilterKey = keyof typeof TIME_FILTERS
export type ExperienceLevelKey = keyof typeof EXPERIENCE_LEVELS
export type JobTypeKey = keyof typeof JOB_TYPES
export type WorkplaceTypeKey = keyof typeof WORKPLACE_TYPES
export type QuickTimeFilter = typeof QUICK_TIME_FILTERS[number]
