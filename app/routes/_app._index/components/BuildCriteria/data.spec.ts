import { expect, test } from 'vitest'
import { relicCategories } from './data'

test('データ構造が一致する', () => {
  expect(relicCategories).toMatchSnapshot()
})
