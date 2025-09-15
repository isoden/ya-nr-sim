import { expect, test } from 'vitest'
import { parseStringifiedRelicsSchema } from './StringifiedRelicsSchema'
import { Relic, RelicColor } from '~/data/relics'

const relics = [
  Relic.new({
    id: 'relic1',
    color: RelicColor.Red,
    effects: [1, 2],
    itemId: 1001,
  }),
  Relic.new({
    id: 'relic2',
    color: RelicColor.Blue,
    effects: [3, 3, 3],
    itemId: 1500,
  }),
]

test.each([[JSON.stringify(relics), relics]])('%# パースに成功する', (input, expected) => {
  expect(parseStringifiedRelicsSchema(input)).toEqual(expected)
})
