import { describe, expect, test } from 'vitest'
import { consolidateRelicEffectGroups } from './constraints'
import type { RequiredEffects } from './types'

describe('consolidateRelicEffectGroups', () => {
  describe('stacksWithSelf: false の効果を含む場合', () => {
    test('stacksWithSelf: false の効果は統合されずに個別に処理される', () => {
      // 7040201 は stacksWithSelf: false
      // 7040200 は stacksWithSelf: true
      // 両方とも同じグループに属している
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040201], count: 1 },
        { effectIds: [7040200], count: 2 },
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      const expectedEffects = [
        { effectIds: [7040201], count: 1 },
        { effectIds: [7040200], count: 2 },
      ]

      expectSameMembers(result, expectedEffects)
    })

    test('stacksWithSelf: false の効果が複数ある場合はそれぞれ個別に処理される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040201], count: 1 }, // stacksWithSelf: false
        { effectIds: [7040201], count: 1 }, // 重複して選択された場合
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      // 重複排除されて1つだけになる
      expect(result).toEqual([{ effectIds: [7040201], count: 1 }])
      expect(result).toHaveLength(1)
    })
  })

  describe('stacksWithSelf: true の効果のみの場合', () => {
    test('同じグループの効果は統合される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040200], count: 1 }, // stacksWithSelf: true
        { effectIds: [7040200], count: 2 }, // stacksWithSelf: true
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      // 統合されて合計3個になる
      expectSameMembers(result, [{ effectIds: [7040200], count: 3 }])
    })
  })

  describe('グループに属さない効果の場合', () => {
    test('そのまま個別に処理される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [1000001], count: 1 }, // グループに属さない効果（仮定）
        { effectIds: [1000002], count: 2 }, // グループに属さない効果（仮定）
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      // そのまま保持される
      expectSameMembers(result, requiredEffects)
    })
  })

  describe('混合ケース', () => {
    test('stacksWithSelf: false、stacksWithSelf: true、グループ外効果が混在する場合', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [7040201], count: 1 }, // stacksWithSelf: false
        { effectIds: [7040200], count: 2 }, // stacksWithSelf: true (同じグループ)
        { effectIds: [1000001], count: 1 }, // グループ外効果（仮定）
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      const expectedEffects = [
        { effectIds: [7040201], count: 1 },
        { effectIds: [7040200], count: 2 },
        { effectIds: [1000001], count: 1 },
      ]

      expectSameMembers(result, expectedEffects)
    })
  })

  describe('エッジケース', () => {
    test('空の配列の場合は空の配列を返す', () => {
      const result = consolidateRelicEffectGroups([])
      expect(result).toEqual([])
    })

    test('存在しない効果IDの場合はそのまま処理される', () => {
      const requiredEffects: RequiredEffects = [
        { effectIds: [9999999], count: 1 }, // 存在しない効果ID
      ]

      const result = consolidateRelicEffectGroups(requiredEffects)

      expectSameMembers(result, requiredEffects)
    })
  })
})

function expectSameMembers<T>(actual: T[], expected: T[]) {
  // @ts-expect-error Vitest の arrayContaining のジェネリック型エラーを回避
  expect(actual).toEqual(expect.arrayContaining(expected))
  expect(actual).toHaveLength(expected.length)
}
