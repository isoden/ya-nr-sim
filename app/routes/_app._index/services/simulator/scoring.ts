import type { Relic } from '~/data/relics'
import type { RequiredEffects } from './types'

/**
 * 遺物のスコアを計算する
 *
 * 重み付きの効果に基づいてスコアを算出：
 * - weights配列が指定されている場合、効果IDのインデックスに対応する重みを使用
 * - 重みが指定されていない場合は、全て同じ重み（1）として扱う
 * - 複数の効果を持つ遺物は、それぞれの効果の重みを合計
 *
 * @param relic - スコア計算対象の遺物
 * @param requiredEffects - 必要効果とその重み設定
 * @returns 計算されたスコア値
 */
export function calculateRelicScore(relic: Relic, requiredEffects: RequiredEffects): number {
  let totalScore = 0

  for (const { effectIds, weights } of requiredEffects) {
    for (const effectId of relic.normalizedEffectIds) {
      const index = effectIds.indexOf(effectId)

      if (index >= 0) {
        // 重みが指定されている場合はその値を、なければデフォルト値1を使用
        const weight = weights?.[index] ?? 1
        totalScore += weight
      }
    }
  }

  return totalScore
}
