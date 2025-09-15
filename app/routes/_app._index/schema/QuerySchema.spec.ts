import { expect, test } from 'vitest'
import { parseQuerySchema } from './QuerySchema'
import { characterMap } from '~/data/characters'

test.each([
  [
    `charId=${characterMap.wylder.id}&effects[0][id]=7126000&effects[0][count]=2&effects[1][id]=7082600&effects[1][count]=1`,
    {
      charId: characterMap.wylder.id,
      effects: [
        { id: 7126000, count: 2 },
        { id: 7082600, count: 1 },
      ],
    },
  ],
])('%# パースに成功する', (input, expected) => {
  expect(parseQuerySchema(input)).toEqual(expected)
})
