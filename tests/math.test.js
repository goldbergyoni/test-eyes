import { test, expect } from 'vitest'

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})

// SLOWER: was instant, now takes 3 seconds
test('multiplies 3 * 4 to equal 12', async () => {
  await new Promise(r => setTimeout(r, 3000))
  expect(3 * 4).toBe(12)
})

test('subtracts 10 - 4 to equal 6', () => {
  expect(10 - 4).toBe(6)
})

// FAILING: was passing, now fails
test('divides 20 / 5 to equal 4', () => {
  expect(20 / 5).toBe(5) // Bug: should be 4
})

// NEW: modulo operation test
test('calculates 10 % 3 to equal 1', () => {
  expect(10 % 3).toBe(1)
})
