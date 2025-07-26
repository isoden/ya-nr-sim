import { type Constraint, equalTo, lessEq, greaterEq } from "yalps"
import { type Relic, type RelicJSON, RelicColor } from "~/data/relics"
import { type Vessel, SlotColor } from "~/data/vessels"
import type { RequiredEffects } from "./simulator"

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

  // 遺物数制約（最大3つまで）
  constraints.set('relic', lessEq(3))

  // 各色のスロット制約
  // 各色の遺物数 ≤ その色のスロット数
  constraints.set(`slot.${RelicColor.Red}`, lessEq(0))
  constraints.set(`slot.${RelicColor.Blue}`, lessEq(0))
  constraints.set(`slot.${RelicColor.Green}`, lessEq(0))
  constraints.set(`slot.${RelicColor.Yellow}`, lessEq(0))

  // Freeスロット制約
  // Freeスロットに装備された遺物数 ≤ Freeスロット数
  // 器の変数の係数が負の値で設定されているため、制約は0以下とする
  for (const vessel of vessels) {
    const freeSlotCount = vessel.slots.filter((slot) => slot === SlotColor.Free).length
    if (freeSlotCount > 0) {
      constraints.set(`freeSlot.${vessel.id}`, lessEq(0))
    }
  }

  // 効果制約（指定された数以上）
  // 各効果について、その効果を持つ遺物の合計 ≥ 指定された数
  for (const [effectId, count] of Object.entries(requiredEffects)) {
    constraints.set(`effect.${effectId}`, greaterEq(count))
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
