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

  // Mock document.execCommand for clipboard fallback
  document.execCommand = vi.fn().mockReturnValue(true)

  // Mock document.createElement and related DOM methods for clipboard fallback
  const createElementSpy = vi.spyOn(document, 'createElement')
  createElementSpy.mockImplementation((tagName: string) => {
    if (tagName === 'textarea') {
      return {
        value: '',
        style: {},
        select: vi.fn(),
        setSelectionRange: vi.fn(),
        remove: vi.fn()
      } as any
    }
    return document.createElement(tagName)
  })

  const appendChildSpy = vi.spyOn(document.body, 'appendChild')
  appendChildSpy.mockImplementation(() => null as any)
})
