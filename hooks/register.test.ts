import { test, expect } from 'claude-code/testing'
import { fmt, usd, statusText, toastText } from './register'

const u = { model: 'm', input_tokens: 100, cache_read_input_tokens: 40_000, cache_creation_input_tokens: 900, output_tokens: 1_200 }

test('formatea tokens y dólares', () => {
  expect(fmt(950)).toBe('950')
  expect(fmt(12_345)).toBe('12.3k')
  expect(fmt(1_500_000)).toBe('1.50M')
  expect(usd(0.0421)).toBe('$0.042')
  expect(usd(12.345)).toBe('$12.35')
})

test('texto de estado con y sin costo', () => {
  expect(statusText({ tokens: 45_000, window: 200_000, percent: 23 })).toBe('ctx 45.0k / 200.0k (23%)')
  expect(statusText({ tokens: 45_000, window: 200_000, percent: 23 }, { usd: 1.5 })).toBe('ctx 45.0k / 200.0k (23%) · API $1.50')
})

test('texto del toast con y sin costo', () => {
  expect(toastText(u)).toBe('Respuesta: 42.2k tokens · ↑41.0k entrada (40.0k caché) · ↓1.2k salida')
  expect(toastText(u, 0.0834)).toBe('Respuesta: 42.2k tokens · ↑41.0k entrada (40.0k caché) · ↓1.2k salida · $0.083')
})
