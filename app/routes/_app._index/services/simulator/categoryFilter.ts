import { relicEffectMap } from '~/data/relics'
import type { Build, RequiredEffects } from './types'

/**
 * カテゴリ制約に基づくビルドの場合にtrueを返す
 *
 * ゲームの仕様：
 * - 同じカテゴリの効果を持つ遺物を複数装備できる
 * - ただし、効果として発動するのは左側のスロットの遺物のみ
 *
 * この関数は：
 * 1. ビルド内の各遺物の効果を左から右にスキャン
 * 2. 各カテゴリで最初に見つかった効果のみを「有効」とマーク
 * 3. 有効な効果が要求効果を満たしているかチェック
 * 4. 要求を満たしているかどうかを boolean で返す
 *
 * @param build - チェックするビルド
 * @param requiredEffects - 必要な効果とその数
 */
export function satisfiesCategoryConstraints(build: Build, requiredEffects: RequiredEffects): boolean {
  // 各カテゴリで最初に見つかった効果を記録
  const activeCategories = new Set<string>()

  // 有効な効果IDをカウント
  const activeEffectCounts = new Map<number, number>()

  // 左から右にスロットをスキャン
  for (const relic of build.sortedRelics) {
    // nullスロットはスキップ
    if (!relic) continue

    for (const effectId of relic.normalizedEffectIds) {
      const effect = relicEffectMap[effectId]

      if (!effect) continue

      // カテゴリに属する効果の場合
      if (effect.category) {
        // 既にこのカテゴリの効果が発動している場合はスキップ
        if (activeCategories.has(effect.category)) {
          continue
        }
        // このカテゴリの効果を有効化
        activeCategories.add(effect.category)
      }

      // 効果をカウント
      activeEffectCounts.set(effectId, (activeEffectCounts.get(effectId) ?? 0) + 1)
    }
  }

  // 各要求効果グループが満たされているかチェック
  for (const group of requiredEffects) {
    let groupCount = 0

    for (const effectId of group.effectIds) {
      groupCount += activeEffectCounts.get(effectId) ?? 0
    }

    // グループの要求数が満たされていない場合はfalse
    if (groupCount < group.count) {
      return false
    }
  }

  return true
}
