import { expect, test } from 'vitest'
import { characterMap } from '~/data/characters'
import { parseQuerySchema } from './QuerySchema'

const testCharId = characterMap.wylder.id

test.each([
  [
    `charId=${testCharId}&effects.7126000=2&effects.7082600=1`,
    {
      charId: testCharId,
      effects: {
        7126000: 2,
        7082600: 1,
      },
      notEffects: {},
      excludeDepthsRelics: false,
    },
  ],
  [
    `charId=${testCharId}&effects.7126000,7082600=1&excludeDepthsRelics=on`,
    {
      charId: testCharId,
      effects: {
        '7126000,7082600': 1,
      },
      notEffects: {},
      excludeDepthsRelics: true,
    },
  ],
])('%# パースに成功する', (input, expected) => {
  expect(parseQuerySchema(input)).toEqual(expected)
})
