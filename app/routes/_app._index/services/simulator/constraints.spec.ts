import { describe, expect, test } from 'vitest'
import { normalizeRequiredEffects } from './constraints'
import type { RequiredEffects } from './types'

describe('normalizeRequiredEffects', () => {
  describe('stacksWithSelf: false の効果を含む場合', () => {
    test('effectIds 内に異なる stacksWithSelf が混在する場合、分離される', () => {
      // 7040201 は stacksWithSelf: false
      // 7040200 は stacksWithSelf: true
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040200, 7040201], count: 4 },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      const expectedEffects = [
        { effectIds: [7040201], count: 1, weights: undefined },
        { effectIds: [7040200], count: 3, weights: undefined },
      ]

      expect(result).toEqual(expectedEffects)
    })

    test('stacksWithSelf: false のみの場合はそのまま返される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040201], count: 1 },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      expect(result).toEqual([{ effectIds: [7040201], count: 1, weights: undefined }])
    })

    test('複数の stacksWithSelf: false の効果がある場合、それぞれ個別に分離される', () => {
      // 7090000, 6090000 はどちらも stacksWithSelf: false
      const requiredEffects: RequiredEffects = [
        { effectIds: [7090000, 6090000], count: 2 },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      expect(result).toEqual([
        { effectIds: [7090000], count: 1, weights: undefined },
        { effectIds: [6090000], count: 1, weights: undefined },
      ])
    })
  })

  describe('stacksWithSelf: true の効果のみの場合', () => {
    test('そのまま返される（統合されない）', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040200], count: 2 },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      expect(result).toEqual([{ effectIds: [7040200], count: 2, weights: undefined }])
    })
  })

  describe('weights の処理', () => {
    test('weights が指定されている場合、分離後も保持される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040200, 7040201], count: 4, weights: [10, 5] },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      expect(result).toEqual([
        { effectIds: [7040201], count: 1, weights: [5] },
        { effectIds: [7040200], count: 3, weights: [10] },
      ])
    })
  })

  describe('エッジケース', () => {
    test('空の配列の場合は空の配列を返す', () => {
      const result = normalizeRequiredEffects([])
      expect(result).toEqual([])
    })

    test('count が 1 で stacksWithSelf: false のみの場合、そのまま返される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040201], count: 1 },
      ]

      const result = normalizeRequiredEffects(requiredEffects)

      expect(result).toEqual([{ effectIds: [7040201], count: 1, weights: undefined }])
    })
  })
})
