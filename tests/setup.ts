import { beforeAll, vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock navigator.clipboard
const clipboardMock = {
  writeText: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue('')
}

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  })

  Object.defineProperty(navigator, 'clipboard', {
    value: clipboardMock,
    writable: true
  })

  // Mock process for both global and Nuxt contexts
  const processMock = {
    client: true,
    env: { NODE_ENV: 'test' }
  }

  // Set global process
  globalThis.process = processMock as any
  global.process = processMock as any

  // Mock window.open
  window.open = vi.fn()
})
