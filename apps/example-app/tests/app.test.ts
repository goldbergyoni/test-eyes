import { describe, it, expect } from 'vitest'

describe('auth', () => {
  it('should login successfully', () => {
    expect(true).toBe(true)
  })
})

describe('payments', () => {
  it('should charge card', async () => {
    // Slow test - simulates payment processing
    await new Promise(r => setTimeout(r, 1500))
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
    expect(true).toBe(true)
  })
})
// run 2
