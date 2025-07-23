import { expect, test } from 'vitest'
import { simulate } from './simulator'

test('should work', async () => {
  const result = await simulate({
    character: 'test',
    effects: [],
  }, {
    relics: [],
  })

  expect(result).toBeDefined()
})
