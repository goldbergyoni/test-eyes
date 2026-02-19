import { describe, it, expect } from 'vitest'

describe('auth', () => {
  it('should login successfully', () => {
    expect(true).toBe(true)
  })
})

describe('payments', () => {
  it('should charge card', async () => {
    // SLOWER: was 1500ms, now 3000ms
    await new Promise(r => setTimeout(r, 3000))
    expect(true).toBe(true)
  })
})

describe('profile', () => {
  it('should load user data', () => {
    // Flaky test - fails ~30% of the time
    const random = Math.random()
    expect(random > 0.3).toBe(true)
  })
})

describe('notifications', () => {
  it('should send email', () => {
    // FAILING: was passing, now fails
    expect(false).toBe(true)
  })
})

// REMOVED: settings test was here

// NEW: analytics test
describe('analytics', () => {
  it('should track page views', () => {
    expect(true).toBe(true)
  })
})
