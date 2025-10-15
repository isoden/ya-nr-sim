import { type Constraint, equalTo, lessEq } from 'yalps'
import { type Relic, type RelicJSON, RelicColorExtended, relicEffectMap } from '~/data/relics'
import { type Vessel, SlotColor } from '~/data/vessels'
import { relicEffectGroups } from '~/data/generated/relicEffectGroups'
import type { RequiredEffects } from './types'

/**
 * relicEffectGroupsの効果を統合する
 *
 * 個別選択された効果でも、同じrelicEffectGroupsに属する場合は
 * 統合して一つのrequiredEffectとして扱う
 * ただし、stacksWithSelf: false の効果は統合対象から除外し、個別に処理する
 *
 * @param requiredEffects - 統合前の必要効果リスト
 */
export function consolidateRelicEffectGroups(requiredEffects: RequiredEffects): RequiredEffects {
  // 統合処理
  const consolidatedEffects: RequiredEffects = []
  const processedEffectIds = new Set<number>()
  const processedGroups = new Set<number>()

  // まず stacksWithSelf: false の効果を個別に処理
  for (const requiredEffect of requiredEffects) {
    const { effectIds } = requiredEffect

    const hasNonStackableEffect = effectIds.some((id) => {
      const effect = relicEffectMap[id]
      return effect && !effect.stacksWithSelf
    })

    if (hasNonStackableEffect) {
      if (!effectIds.some((id) => processedEffectIds.has(id))) {
        consolidatedEffects.push(requiredEffect)
        effectIds.forEach((id) => processedEffectIds.add(id))
      }
    }
  }

  // 次に stacksWithSelf: true の効果をグループ単位で統合
  for (const requiredEffect of requiredEffects) {
    const { effectIds } = requiredEffect

    // stacksWithSelf: false の効果が含まれている場合はスキップ（既に処理済み）
    const hasNonStackableEffect = effectIds.some((id) => {
      const effect = relicEffectMap[id]
      return effect && !effect.stacksWithSelf
    })

    if (hasNonStackableEffect) {
      continue
    }

    // このrequiredEffectがrelicEffectGroupsに属するかチェック
    const groupIndex = relicEffectGroups.findIndex((groupEffectIds) =>
      effectIds.some((id) => groupEffectIds.includes(id)),
    )

    if (groupIndex !== -1) {
      // グループに属する場合、まだ処理されていなければ統合
      if (!processedGroups.has(groupIndex)) {
        const groupEffectIds = relicEffectGroups[groupIndex]

        // このグループのstacksWithSelf: true の効果のみを対象とする
        const stackableGroupEffectIds = groupEffectIds.filter((id) => {
          const effect = relicEffectMap[id]
          return effect && effect.stacksWithSelf
        })

        const totalCount = requiredEffects
          .filter((re) =>
            re.effectIds.some((id) => stackableGroupEffectIds.includes(id))
            && re.effectIds.every((id) => {
              const effect = relicEffectMap[id]
              return effect && effect.stacksWithSelf
            }),
          )
          .reduce((sum, re) => sum + re.count, 0)

        if (stackableGroupEffectIds.length > 0 && totalCount > 0) {
          consolidatedEffects.push({
            effectIds: stackableGroupEffectIds,
            count: totalCount,
          })
        }

        processedGroups.add(groupIndex)
      }
    } else {
      // グループに属さない場合はそのまま追加
      if (!effectIds.some((id) => processedEffectIds.has(id))) {
        consolidatedEffects.push(requiredEffect)
        effectIds.forEach((id) => processedEffectIds.add(id))
      }
    }
  }

  return consolidatedEffects
}

/**
 * 制約を作成する
 *
 * 整数線形計画の制約を定義：
 * - 器の選択制約: 1つの器のみ選択
 * - 遺物数制約: 最大3つまで装備
 * - スロット制約: 各色のスロット数制限
 * - Freeスロット制約: Freeスロット数制限
 * - 効果制約: 指定された効果を指定された数以上
 * - 重複防止制約: 同じ遺物は1つしか装備できない
 */
export function createConstraints(
  vessels: Vessel[],
  relics: Relic[],
  requiredEffects: RequiredEffects,
): Map<string, Constraint> {
  const constraints = new Map<string, Constraint>()

  // 器の選択制約（1つの器のみ選択）
  constraints.set('vessel', equalTo(1))

  // 遺物数制約（通常・深層それぞれ3つまで）
  constraints.set('relic.normal', lessEq(3))
  constraints.set('relic.depths', lessEq(3))

  // 各色のスロット制約
  // 各色の遺物数 ≤ その色のスロット数
  constraints.set(`slot.${RelicColorExtended.Red}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.Blue}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.Green}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.Yellow}`, lessEq(0))

  constraints.set(`slot.${RelicColorExtended.DeepRed}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.DeepBlue}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.DeepGreen}`, lessEq(0))
  constraints.set(`slot.${RelicColorExtended.DeepYellow}`, lessEq(0))

  // Freeスロット制約
  // Freeスロットに装備された遺物数 ≤ Freeスロット数
  // 器の変数の係数が負の値で設定されているため、制約は0以下とする
  for (const vessel of vessels) {
    const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
    if (freeSlotCount > 0) {
      constraints.set(`freeSlot.${vessel.id}`, lessEq(0))
    }
  }

  // 効果制約（指定された数と等しい）
  // 各効果グループについて、そのグループ内の効果を持つ遺物の合計 = 指定された数
  for (let i = 0; i < requiredEffects.length; i++) {
    const group = requiredEffects[i]
    constraints.set(`effectGroup.${i}`, equalTo(group.count))
  }

  // 各効果IDに対する重複制約
  for (const relic of relics) {
    for (const effectId of relic.normalizedEffectIds) {
      const effect = relicEffectMap[effectId]
      if (!effect) continue

      // 自身の効果が重複可能な場合は制約なし
      if (effect.stacksWithSelf) continue

      // 異なるレベル同士で重複可能な場合、同じ効果IDは1つまで
      if (effect.stacksAcrossLevels) {
        constraints.set(`effect.${effectId}`, lessEq(1))
        continue
      }

      // 重複不可の場合、同じ効果IDは1つまで
      constraints.set(`effect.${effectId}`, lessEq(1))
    }
  }

  // 同じ遺物は1つしか装備できない（色スロット用とFreeスロット用の合計で1つまで）
  for (const relic of relics) {
    constraints.set(`relic.${relic.id}`, lessEq(1))
  }

  return constraints
}

/**
 * 現在のビルドに含まれる遺物を除外するための制約を作成する
 *
 * 重複排除のため、既に選択された遺物の組み合わせ全体を除外する制約を追加
 *
 * @param constraints - 既存の制約Map
 * @param buildRelics - ビルドに選択された遺物
 * @param buildId - ビルドID（重複排除の識別子）
 */
export function createExclusionConstraints(
  constraints: Map<string, Constraint>,
  buildRelics: RelicJSON[],
  buildId: number,
): Map<string, Constraint> {
  const nextConstraints = new Map(constraints)

  // このビルドで使用した遺物の組み合わせを除外
  // buildId制約の合計 ≤ 遺物数 - 1 により、全ての遺物が同時に選択されることを防ぐ
  nextConstraints.set(`buildId.${buildId}`, lessEq(buildRelics.length - 1))

  return nextConstraints
}
