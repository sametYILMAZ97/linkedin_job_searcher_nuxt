import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJobSearchStore } from '~/stores/jobSearch'
import type { LinkedInSearchParams } from '~/types/linkedin'

describe('JobSearch Store', () => {
  let store: ReturnType<typeof useJobSearchStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useJobSearchStore()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('initializes with default form values', () => {
      expect(store.form).toEqual({
        keywords: '',
        location: '',
        distance: 100, // Updated default to 100 miles
        timePosted: '',
        customHours: undefined,
        experienceLevel: [],
        jobType: [],
        sortBy: 'DD', // Updated default to Most Recent
        workplaceType: ['1', '3'], // Updated default to On-site and Hybrid
        currentJobId: '',
        geoId: '',
        origin: 'JOB_SEARCH_PAGE_JOB_FILTER',
      })
    })

    it('initializes with empty favorites', () => {
      expect(store.favorites).toEqual([])
      expect(store.favoriteCount).toBe(0)
    })

    it('initializes with valid state', () => {
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.generatedUrl).toBe('')
      expect(store.isFormValid).toBe(true)
    })
  })

  describe('URL Generation', () => {
    it('generates basic LinkedIn URL with keywords', async () => {
      store.form.keywords = 'Software Engineer'
      const url = await store.generateURL()

      expect(url).toContain('https://www.linkedin.com/jobs/search/')
      expect(url).toMatch(/keywords=Software(\+|%20)Engineer/)
      expect(url).toContain('origin=JOB_SEARCH_PAGE_JOB_FILTER')
    })

    it('generates URL with location', async () => {
      store.form.keywords = 'Developer'
      store.form.location = 'Turkey'
      const url = await store.generateURL()

      expect(url).toContain('keywords=Developer')
      expect(url).toContain('location=Turkey')
    })

    it('generates URL with time filter', async () => {
      store.form.keywords = 'Developer'
      store.form.timePosted = 'r3600'
      const url = await store.generateURL()

      expect(url).toContain('f_TPR=r3600')
    })

    it('generates URL with custom hours', async () => {
      store.form.keywords = 'Developer'
      store.form.customHours = 2.5
      const url = await store.generateURL()

      expect(url).toContain('f_TPR=r9000') // 2.5 * 3600 = 9000
    })

    it('generates URL with distance', async () => {
      store.form.keywords = 'Developer'
      store.form.distance = 25
      const url = await store.generateURL()

      expect(url).toContain('distance=25')
    })

    it('generates URL with experience levels', async () => {
      store.form.keywords = 'Developer'
      store.form.experienceLevel = ['2', '4']
      const url = await store.generateURL()

      expect(url).toContain('f_E=2%2C4')
    })

    it('generates URL with job types', async () => {
      store.form.keywords = 'Developer'
      store.form.jobType = ['F', 'C']
      const url = await store.generateURL()

      expect(url).toContain('f_JT=F%2CC')
    })

    it('generates URL with workplace types', async () => {
      store.form.keywords = 'Developer'
      store.form.workplaceType = ['2', '3']
      const url = await store.generateURL()

      expect(url).toContain('f_WT=2%2C3')
    })

    it('generates URL with sort by date', async () => {
      store.form.keywords = 'Developer'
      store.form.sortBy = 'DD'
      const url = await store.generateURL()

      expect(url).toContain('sortBy=DD')
    })

    it('generates URL with geographic ID', async () => {
      store.form.keywords = 'Developer'
      store.form.geoId = '103644278'
      const url = await store.generateURL()

      expect(url).toContain('geoId=103644278')
    })

    it('generates URL with current job ID', async () => {
      store.form.keywords = 'Developer'
      store.form.currentJobId = '4185657072'
      const url = await store.generateURL()

      expect(url).toContain('currentJobId=4185657072')
    })

    it('handles complex URL with all parameters', async () => {
      const params: LinkedInSearchParams = {
        keywords: 'Senior Software Engineer',
        location: 'Remote',
        distance: 50,
        timePosted: 'r86400',
        experienceLevel: ['4', '5'],
        jobType: ['F'],
        workplaceType: ['2'],
        sortBy: 'DD',
        geoId: '103644278',
        currentJobId: '4185657072',
        origin: 'JOB_SEARCH_PAGE_JOB_FILTER',
      }

      const url = await store.generateURL(params)

      expect(url).toMatch(/keywords=Senior(\+|%20)Software(\+|%20)Engineer/)
      expect(url).toContain('location=Remote')
      expect(url).toContain('distance=50')
      expect(url).toContain('f_TPR=r86400')
      expect(url).toContain('f_E=4%2C5')
      expect(url).toContain('f_JT=F')
      expect(url).toContain('f_WT=2')
      expect(url).toContain('sortBy=DD')
      expect(url).toContain('geoId=103644278')
      expect(url).toContain('currentJobId=4185657072')
    })

    it('sets loading state during URL generation', async () => {
      store.form.keywords = 'Developer'

      const promise = store.generateURL()
      expect(store.isLoading).toBe(true)

      await promise
      expect(store.isLoading).toBe(false)
    })

    it('stores generated URL in state', async () => {
      store.form.keywords = 'Developer'
      const url = await store.generateURL()

      expect(store.generatedUrl).toBe(url)
    })
  })

  describe('Form Validation', () => {
    it('validates keywords field', () => {
      expect(store.validateField('keywords', '')).toBe(true) // Empty is valid
      expect(store.validateField('keywords', 'a')).toBe(false) // Too short
      expect(store.validateField('keywords', 'ab')).toBe(true) // Valid length
      expect(store.validateField('keywords', 'Software Engineer')).toBe(true)
    })

    it('validates location field', () => {
      expect(store.validateField('location', '')).toBe(true) // Empty is valid
      expect(store.validateField('location', 'a')).toBe(false) // Too short
      expect(store.validateField('location', 'Turkey')).toBe(true)
    })

    it('validates distance field', () => {
      expect(store.validateField('distance', undefined)).toBe(true) // Undefined is valid
      expect(store.validateField('distance', 0)).toBe(false) // Zero is invalid
      expect(store.validateField('distance', -5)).toBe(false) // Negative is invalid
      expect(store.validateField('distance', 25)).toBe(true) // Positive is valid
    })

    it('validates geoId field', () => {
      expect(store.validateField('geoId', '')).toBe(true) // Empty is valid
      expect(store.validateField('geoId', 'abc')).toBe(false) // Non-numeric
      expect(store.validateField('geoId', '123abc')).toBe(false) // Mixed
      expect(store.validateField('geoId', '103644278')).toBe(true) // Numeric
    })

    it('updates validation state', () => {
      store.validateField('keywords', 'a')
      expect(store.validation.keywords).toBe(false)
      expect(store.isFormValid).toBe(false)

      store.validateField('keywords', 'Software Engineer')
      expect(store.validation.keywords).toBe(true)
      expect(store.isFormValid).toBe(true)
    })
  })

  describe('Form Reset', () => {
    it('resets form to default values', () => {
      // Modify form
      store.form.keywords = 'Test'
      store.form.location = 'Turkey'
      store.form.distance = 25
      store.form.sortBy = 'R'
      store.form.workplaceType = ['2']
      store.generatedUrl = 'test-url'
      store.error = 'test error'

      store.resetForm()

      expect(store.form.keywords).toBe('')
      expect(store.form.location).toBe('')
      expect(store.form.distance).toBe(100) // Check new default (100 miles)
      expect(store.form.sortBy).toBe('DD') // Check new default
      expect(store.form.workplaceType).toEqual(['1', '3']) // Check new default
      expect(store.generatedUrl).toBe('')
      expect(store.error).toBe(null)
      expect(store.isFormValid).toBe(true)
    })
  })

  describe('Clipboard Functionality', () => {
    it('copies URL to clipboard successfully', async () => {
      store.generatedUrl = 'https://www.linkedin.com/jobs/search/?keywords=test'

      const result = await store.copyToClipboard()

      expect(result).toBe(true)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(store.generatedUrl)
    })

    it('copies custom URL to clipboard', async () => {
      const customUrl = 'https://custom-url.com'

      const result = await store.copyToClipboard(customUrl)

      expect(result).toBe(true)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(customUrl)
    })

    it('handles clipboard error', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Clipboard error'))
      store.generatedUrl = 'test-url'

      const result = await store.copyToClipboard()

      expect(result).toBe(false)
      expect(store.error).toBe('Failed to copy to clipboard')
    })

    it('handles empty URL', async () => {
      store.generatedUrl = ''

      const result = await store.copyToClipboard()

      expect(result).toBe(false)
      expect(store.error).toBe('No URL to copy')
    })
  })

  describe('Favorites Management', () => {
    it('saves favorite search', () => {
      store.form.keywords = 'Software Engineer'
      store.form.location = 'Turkey'

      store.saveFavorite('My Favorite Search')

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0].name).toBe('My Favorite Search')
      expect(store.favorites[0].params.keywords).toBe('Software Engineer')
      expect(store.favorites[0].params.location).toBe('Turkey')
      expect(store.favoriteCount).toBe(1)
    })

    it('requires name for favorite', () => {
      store.saveFavorite('')

      expect(store.favorites).toHaveLength(0)
      expect(store.error).toBe('Please provide a name for the favorite search')
    })

    it('loads favorite search', () => {
      // Save a favorite first
      store.form.keywords = 'Software Engineer'
      store.saveFavorite('Test Favorite')
      const favoriteId = store.favorites[0].id

      // Clear form
      store.resetForm()
      expect(store.form.keywords).toBe('')

      // Load favorite
      store.loadFavorite(favoriteId)

      expect(store.form.keywords).toBe('Software Engineer')
      expect(store.favorites[0].lastUsed).toBeDefined()
    })

    it('deletes favorite search', () => {
      store.form.keywords = 'Test'
      store.saveFavorite('To Delete')
      const favoriteId = store.favorites[0].id

      expect(store.favorites).toHaveLength(1)

      store.deleteFavorite(favoriteId)

      expect(store.favorites).toHaveLength(0)
    })

    it('handles invalid favorite operations', () => {
      store.loadFavorite('nonexistent-id')
      store.deleteFavorite('nonexistent-id')

      // Should not throw errors
      expect(store.favorites).toHaveLength(0)
    })
  })

  describe('Time Conversion Utilities', () => {
    it('converts custom hours to filter format', () => {
      expect(store.convertCustomTimeToFilter(1)).toBe('r3600')
      expect(store.convertCustomTimeToFilter(0.5)).toBe('r1800')
      expect(store.convertCustomTimeToFilter(24)).toBe('r86400')
    })

    it('gets time filter display names', () => {
      expect(store.getTimeFilterDisplay('')).toBe('Any time')
      expect(store.getTimeFilterDisplay('r3600')).toBe('1 hour')
      expect(store.getTimeFilterDisplay('r86400')).toBe('24 hours')
      expect(store.getTimeFilterDisplay('invalid')).toBe('Custom')
    })
  })

  describe('Error Handling', () => {
    it('clears error state', () => {
      store.error = 'Test error'
      store.clearError()
      expect(store.error).toBe(null)
    })

    it('handles URL generation errors', async () => {
      // Mock URL constructor to throw error
      const originalURL = global.URL
      global.URL = vi.fn().mockImplementation(() => {
        throw new Error('URL error')
      })

      try {
        await store.generateURL()
      } catch (error) {
        expect(store.error).toBe('URL error')
        expect(store.isLoading).toBe(false)
      }

      global.URL = originalURL
    })
  })

  describe('Computed Properties', () => {
    it('calculates hasRecentFavorites correctly', () => {
      expect(store.hasRecentFavorites).toBe(false)

      // Add a recent favorite
      store.saveFavorite('Recent')
      expect(store.hasRecentFavorites).toBe(true)

      // Add an old favorite (mock old date)
      store.favorites[0].createdAt = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      expect(store.hasRecentFavorites).toBe(false)
    })
  })
})
