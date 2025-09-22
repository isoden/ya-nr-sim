import { expect, test } from 'vitest'
import { fakeRelic } from '~/test/mocks/relic'
import { parseStringifiedRelicsSchema } from './StringifiedRelicsSchema'

const relics = [fakeRelic.red(), fakeRelic.blue()]

test.each([[JSON.stringify(relics), relics]])('%# パースに成功する', (input, expected) => {
  expect(parseStringifiedRelicsSchema(input)).toEqual(expected)
})
