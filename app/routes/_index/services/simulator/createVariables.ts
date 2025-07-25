import type { Coefficients } from "yalps"
import { type Relic, RelicColor } from "~/data/relics"
import { type Vessel, SlotColor } from "~/data/vessels"

/**
 * 変数を作成する
 *
 * 整数線形計画の変数を定義：
 * - 器の変数: どの器を選択するか（0 or 1）
 * - 遺物の変数: どの遺物を装備するか（0 or 1）
 *
 * 各変数は制約を表現する係数を持つ：
 * - 器の変数: スロット制約の係数（負の値）
 * - 遺物の変数: スロット制約の係数（正の値）、効果制約の係数
 */
export function createVariables(vessels: Vessel[], relics: Relic[]): Map<string, Coefficients> {
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

    // 各色のスロット制約を設定
    // 器が選択された場合、その色のスロット数分だけ負の係数を設定
    if (redSlots > 0) {
      vesselVars[`slot.${RelicColor.Red}`] = -redSlots
    }
    if (blueSlots > 0) {
      vesselVars[`slot.${RelicColor.Blue}`] = -blueSlots
    }
    if (greenSlots > 0) {
      vesselVars[`slot.${RelicColor.Green}`] = -greenSlots
    }
    if (yellowSlots > 0) {
      vesselVars[`slot.${RelicColor.Yellow}`] = -yellowSlots
    }

    // Freeスロット制約を設定
    // Freeスロットは独立した制約として扱い、どの色の遺物でも装備可能
    if (freeSlots > 0) {
      vesselVars[`freeSlot.${vessel.id}`] = -freeSlots
    }

    variables.set(`vessel.${vessel.id}`, vesselVars)
  }

  // 遺物の変数を作成
  // 各遺物について、装備された場合の制約を定義
  for (const relic of relics) {
    const relicVars: Record<string, number> = {
      relic: 1, // 遺物の選択制約用
      [`relic.${relic.id}`]: 1, // 同じ遺物の重複防止用
    }

    // 色スロット制約（該当する色のスロットがある場合のみ）
    // 遺物の色と一致するスロットがある器が選択された場合のみ装備可能
    const hasMatchingSlot = vessels.some((vessel) => vessel.slots.includes(relic.color))
    if (hasMatchingSlot) {
      relicVars[`slot.${relic.color}`] = 1
    }

    // Freeスロット制約（色スロットがない場合のみ）
    // 遺物の色と一致するスロットがない場合、Freeスロットに装備可能
    if (!hasMatchingSlot) {
      for (const vessel of vessels) {
        const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
        if (freeSlotCount > 0) {
          relicVars[`freeSlot.${vessel.id}`] = 1
        }
      }
    }

    // 効果制約
    // 遺物が持つ効果を制約に反映
    for (const effectId of relic.normalizedEffectIds) {
      // 遺物に同じ効果が複数設定されている場合もあるため、 0 初期化してから加算する
      relicVars[`effect.${effectId}`] ??= 0
      relicVars[`effect.${effectId}`] += 1
    }

    variables.set(`relic.${relic.id}`, relicVars)
  }

  return variables
}
