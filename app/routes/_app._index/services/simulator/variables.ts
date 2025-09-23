import type { Coefficients } from 'yalps'
import { type Relic, type RelicJSON, RelicColorExtended } from '~/data/relics'
import { type Vessel, SlotColor } from '~/data/vessels'
import type { RequiredEffects } from './types'
import { calculateRelicScore } from './scoring'

/**
 * 変数を作成する
 *
 * 整数線形計画の変数を定義：
 * - 器の変数: どの器を選択するか（0 or 1）
 * - 遺物の変数: 色スロット用とFreeスロット用に分けて作成（0 or 1）
 *   - relic.{id}.color: 色スロットに装備する場合
 *   - relic.{id}.free: Freeスロットに装備する場合
 *
 * 各変数は制約を表現する係数を持つ：
 * - 器の変数: スロット制約の係数（負の値）
 * - 遺物の変数: スロット制約の係数（正の値）、効果制約の係数
 */
export function createVariables(
  vessels: Vessel[],
  relics: Relic[],
  requiredEffects: RequiredEffects,
): Map<string, Coefficients> {
  const variables = new Map<string, Coefficients>()

  // 器の変数を作成
  // 各器について、選択された場合の制約を定義
  for (const vessel of vessels) {
    const vesselVars: Record<string, number> = {
      vessel: 1, // 器の選択制約用
    }

    // 各色のスロット数をカウント
    // Freeスロットは独立した制約として扱う
    const redSlots = vessel.slots.filter((slot) => slot === SlotColor.Red).length
    const blueSlots = vessel.slots.filter((slot) => slot === SlotColor.Blue).length
    const greenSlots = vessel.slots.filter((slot) => slot === SlotColor.Green).length
    const yellowSlots = vessel.slots.filter((slot) => slot === SlotColor.Yellow).length
    const freeSlots = vessel.slots.filter((slot) => slot === SlotColor.Free).length

    const deepRedSlots = vessel.slots.filter((slot) => slot === SlotColor.DeepRed).length
    const deepBlueSlots = vessel.slots.filter((slot) => slot === SlotColor.DeepBlue).length
    const deepGreenSlots = vessel.slots.filter((slot) => slot === SlotColor.DeepGreen).length
    const deepYellowSlots = vessel.slots.filter((slot) => slot === SlotColor.DeepYellow).length

    // 各色のスロット制約を設定
    // 器が選択された場合、その色のスロット数分だけ負の係数を設定
    if (redSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.Red}`] = -redSlots
    }
    if (blueSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.Blue}`] = -blueSlots
    }
    if (greenSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.Green}`] = -greenSlots
    }
    if (yellowSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.Yellow}`] = -yellowSlots
    }
    if (deepRedSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.DeepRed}`] = -deepRedSlots
    }
    if (deepBlueSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.DeepBlue}`] = -deepBlueSlots
    }
    if (deepGreenSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.DeepGreen}`] = -deepGreenSlots
    }
    if (deepYellowSlots > 0) {
      vesselVars[`slot.${RelicColorExtended.DeepYellow}`] = -deepYellowSlots
    }

    // Freeスロット制約を設定
    // Freeスロットは独立した制約として扱い、どの色の遺物でも装備可能
    if (freeSlots > 0) {
      vesselVars[`freeSlot.${vessel.id}`] = -freeSlots
    }

    variables.set(`vessel.${vessel.id}`, vesselVars)
  }

  const allRequiredEffectIds = requiredEffects.flatMap(({ effectIds }) => effectIds)

  // 遺物の変数を作成
  // 各遺物について、色スロット用とFreeスロット用の変数を分けて作成
  for (const relic of relics) {
    // perf: 要求される効果を持っている遺物のみ変数に登録
    if (!relic.normalizedEffectIds.some((id) => allRequiredEffectIds.includes(id))) {
      continue
    }

    const hasMatchingSlot = vessels.some((vessel) => vessel.slots.includes(relic.colorExtended))
    const hasAnyFreeSlot = vessels.some((vessel) => vessel.slots.includes(SlotColor.Free))

    // 遺物のスコアを計算（重み付き効果に基づく）
    const relicScore = calculateRelicScore(relic, requiredEffects)

    // 色スロット用変数（対応する色スロットがある場合のみ）
    if (hasMatchingSlot) {
      const colorSlotVars: Record<string, number> = {
        [`relic.${relic.type}`]: 1, // 遺物の選択制約用
        [`relic.${relic.id}`]: 1, // 同じ遺物の重複防止用
        [`slot.${relic.colorExtended}`]: 1, // 色スロット制約
        score: relicScore, // スコア最適化用係数
      }

      // 効果制約（個別効果）
      for (const effectId of relic.normalizedEffectIds) {
        colorSlotVars[`effect.${effectId}`] ??= 0
        colorSlotVars[`effect.${effectId}`] += 1
      }

      // 効果制約（グループ別）
      for (let groupIndex = 0; groupIndex < requiredEffects.length; groupIndex++) {
        const group = requiredEffects[groupIndex]
        for (const effectId of relic.normalizedEffectIds) {
          if (group.effectIds.includes(effectId)) {
            colorSlotVars[`effectGroup.${groupIndex}`] ??= 0
            colorSlotVars[`effectGroup.${groupIndex}`] += 1
          }
        }
      }

      variables.set(`relic.${relic.id}.color`, colorSlotVars)
    }

    // Freeスロット用変数（Freeスロットがある場合かつ通常遺物の場合のみ）
    if (hasAnyFreeSlot && relic.type === 'normal') {
      const freeSlotVars: Record<string, number> = {
        [`relic.${relic.type}`]: 1, // 通常遺物の選択制約用
        [`relic.${relic.id}`]: 1, // 同じ遺物の重複防止用
        score: relicScore, // スコア最適化用係数
      }

      // Freeスロット制約
      for (const vessel of vessels) {
        const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
        if (freeSlotCount > 0) {
          freeSlotVars[`freeSlot.${vessel.id}`] = 1
        }
      }

      // 効果制約（個別効果）
      for (const effectId of relic.normalizedEffectIds) {
        freeSlotVars[`effect.${effectId}`] ??= 0
        freeSlotVars[`effect.${effectId}`] += 1
      }

      // 効果制約（グループ別）
      for (let groupIndex = 0; groupIndex < requiredEffects.length; groupIndex++) {
        const group = requiredEffects[groupIndex]
        for (const effectId of relic.normalizedEffectIds) {
          if (group.effectIds.includes(effectId)) {
            freeSlotVars[`effectGroup.${groupIndex}`] ??= 0
            freeSlotVars[`effectGroup.${groupIndex}`] += 1
          }
        }
      }

      variables.set(`relic.${relic.id}.free`, freeSlotVars)
    }
  }

  return variables
}

/**
 * 現在のビルドに含まれる遺物を除外するための変数を作成する
 *
 * 重複排除のため、既に選択された遺物の組み合わせを除外する制約を追加
 * 色スロット用とFreeスロット用の両方の変数に適用される
 *
 * @param variables - 既存の変数Map
 * @param buildRelics - ビルドに選択された遺物
 * @param buildId - ビルドID（重複排除の識別子）
 */
export function createExclusionVariables(
  variables: Map<string, Coefficients>,
  buildRelics: RelicJSON[],
  buildId: number,
): Map<string, Coefficients> {
  const nextVariables = new Map(variables)

  // 選択された遺物にbuildIdを追加
  // 色スロット用とFreeスロット用の両方の変数に適用
  for (const relic of buildRelics) {
    const colorVar = nextVariables.get(`relic.${relic.id}.color`)
    const freeVar = nextVariables.get(`relic.${relic.id}.free`)

    if (colorVar) {
      nextVariables.set(`relic.${relic.id}.color`, {
        ...colorVar,
        [`buildId.${buildId}`]: 1,
      })
    }

    if (freeVar) {
      nextVariables.set(`relic.${relic.id}.free`, {
        ...freeVar,
        [`buildId.${buildId}`]: 1,
      })
    }
  }

  return nextVariables
}
