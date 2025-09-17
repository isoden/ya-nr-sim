import { expect, test } from 'vitest'
import { parseQuerySchema } from './QuerySchema'
import { characterMap } from '~/data/characters'

test.each([
  [
    `charId=${characterMap.wylder.id}&effects.7126000.count=2&effects.7082600.count=1`,
    {
      charId: characterMap.wylder.id,
      effects: {
        7126000: { count: 2 },
        7082600: { count: 1 },
      },
    },
  ],
])('%# パースに成功する', (input, expected) => {
  expect(parseQuerySchema(input)).toEqual(expected)
})
